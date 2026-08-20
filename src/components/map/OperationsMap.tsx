import { useEffect, useRef, useState } from 'react';
import {
  Map,
  NavigationControl,
  setWorkerUrl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
} from 'maplibre-gl';
import { useNavigate } from 'react-router';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Button, Chip, Divider, Stack, Switch, Typography } from '@mui/material';
import { LayersRounded, RouteRounded, SensorsRounded } from '@mui/icons-material';

import { REGIONS, type RegionCode } from '../../config/regions';
import {
  getExceptionHeatGeoJson,
  getGeofenceGeoJson,
  getLiveVehiclePosition,
  getSelectedShipmentRouteGeoJson,
  getTrafficGeoJson,
  getVehicleById,
  getVehicleGeoJson,
  getVehiclesByRegion,
  getWarehouseCapacityGeoJson,
  getWeatherGeoJson,
} from '../../store/api/vehicleTelemetry';
import type { Vehicle } from '../../store/api/mockVehicles';

setWorkerUrl(workerUrl);

interface OperationsMapProps {
  region: RegionCode;
  variant?: 'preview' | 'command';
}

interface OverlayState {
  traffic: boolean;
  weather: boolean;
  exceptionHeat: boolean;
  warehouseCapacity: boolean;
  geofences: boolean;
  routes: boolean;
}

const initialOverlays: OverlayState = {
  traffic: true,
  weather: false,
  exceptionHeat: true,
  warehouseCapacity: true,
  geofences: true,
  routes: true,
};

const previewOverlays: OverlayState = {
  traffic: false,
  weather: false,
  exceptionHeat: true,
  warehouseCapacity: false,
  geofences: false,
  routes: false,
};

const overlayLayers: Record<keyof OverlayState, string[]> = {
  traffic: ['traffic-corridors'],
  weather: ['weather-watch'],
  exceptionHeat: ['exception-heat'],
  warehouseCapacity: ['warehouse-capacity', 'warehouse-capacity-label'],
  geofences: ['geofence-fill', 'geofence-outline', 'geofence-event'],
  routes: ['selected-route-planned', 'selected-route-actual', 'selected-route-deviation'],
};

const overlayLabels: Record<keyof OverlayState, string> = {
  traffic: 'Traffic',
  weather: 'Weather',
  exceptionHeat: 'Exception heat',
  warehouseCapacity: 'Capacity',
  geofences: 'Geofences',
  routes: 'Routes',
};

export default function OperationsMap({ region, variant = 'command' }: OperationsMapProps) {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const selectedVehicleRef = useRef<Vehicle | null>(null);
  const regionRef = useRef<RegionCode>(region);
  const tickRef = useRef(0);

  const [overlays, setOverlays] = useState<OverlayState>(initialOverlays);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleCount, setVehicleCount] = useState(() => getVehiclesByRegion(region).length);
  const [lastTelemetryTime, setLastTelemetryTime] = useState(new Date());
  const isCommandMode = variant === 'command';

  regionRef.current = region;
  selectedVehicleRef.current = selectedVehicle;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const initialRegion = REGIONS[regionRef.current];
    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: initialRegion.center,
      zoom: initialRegion.zoom,
    });

    map.addControl(new NavigationControl(), 'top-right');
    map.on('load', () => {
      addMapSources(map, regionRef.current, tickRef.current);
      addMapLayers(map);
      applyOverlayVisibility(map, isCommandMode ? overlays : previewOverlays);
      setVehicleCount(getVehiclesByRegion(regionRef.current).length);

      map.on('click', 'vehicles-unclustered', handleVehicleClick);
      map.on('click', 'vehicle-clusters', (event) => {
        const feature = map.queryRenderedFeatures(event.point, {
          layers: ['vehicle-clusters'],
        })[0];
        const clusterId = feature?.properties?.['cluster_id'] as number | undefined;
        const source = map.getSource('vehicles') as GeoJSONSource | undefined;

        if (clusterId === undefined || !source) {
          return;
        }

        source.getClusterExpansionZoom(clusterId).then((zoom) => {
          map.easeTo({
            center: (feature.geometry as { coordinates: [number, number] }).coordinates,
            zoom,
          });
        });
      });

      map.on('mouseenter', 'vehicles-unclustered', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'vehicles-unclustered', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const timer = window.setInterval(() => {
      tickRef.current += 1;
      refreshTelemetrySources(map, regionRef.current, tickRef.current, selectedVehicleRef.current);
      setLastTelemetryTime(new Date());
    }, 1200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const selectedRegion = REGIONS[region];
    map.flyTo({
      center: selectedRegion.center,
      zoom: selectedRegion.zoom,
      duration: 1500,
      essential: true,
    });

    setSelectedVehicle(null);
    selectedVehicleRef.current = null;
    setVehicleCount(getVehiclesByRegion(region).length);
    refreshAllSources(map, region, tickRef.current, null);
  }, [region]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    applyOverlayVisibility(map, isCommandMode ? overlays : previewOverlays);
  }, [isCommandMode, overlays]);

  const handleToggleOverlay = (key: keyof OverlayState) => {
    setOverlays((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleClearSelection = () => {
    setSelectedVehicle(null);
    selectedVehicleRef.current = null;
    setSourceData(mapRef.current, 'selected-route', {
      type: 'FeatureCollection',
      features: [],
    });
  };

  function handleVehicleClick(event: MapLayerMouseEvent) {
    const feature = event.features?.[0];
    const vehicleId = feature?.properties?.['id'] as string | undefined;

    if (!vehicleId) {
      return;
    }

    const vehicle = getVehicleById(vehicleId);

    if (!vehicle) {
      return;
    }

    if (!isCommandMode) {
      navigate('/map');
      return;
    }

    setSelectedVehicle(vehicle);
    selectedVehicleRef.current = vehicle;
    setSourceData(mapRef.current, 'selected-route', getSelectedShipmentRouteGeoJson(vehicle, tickRef.current));
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: isCommandMode ? 720 : 460,
        overflow: 'hidden',
        border: '1px solid #d9e3ed',
        borderRadius: '12px',
        backgroundColor: '#eef4f8',
      }}
    >
      <Box
        ref={mapContainerRef}
        sx={{ width: '100%', height: '100%', minHeight: isCommandMode ? 720 : 460 }}
      />

      {isCommandMode ? (
        <MapCommandPanel
          lastTelemetryTime={lastTelemetryTime}
          overlays={overlays}
          region={region}
          vehicleCount={vehicleCount}
          onToggleOverlay={handleToggleOverlay}
        />
      ) : (
        <MapPreviewPanel
          lastTelemetryTime={lastTelemetryTime}
          region={region}
          vehicleCount={vehicleCount}
          onOpen={() => navigate('/map')}
        />
      )}

      {isCommandMode && selectedVehicle && (
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            width: { xs: 'calc(100% - 24px)', md: 340 },
            border: '1px solid rgba(210, 222, 233, 0.94)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 16px 36px rgba(13, 39, 66, 0.16)',
            p: 1.6,
          }}
        >
          <SelectedAssetPanel
            vehicle={selectedVehicle}
            tick={tickRef.current}
            onClose={handleClearSelection}
          />
        </Box>
      )}

      {isCommandMode && <MapLegend />}
    </Box>
  );
}

function addMapSources(map: Map, region: RegionCode, tick: number) {
  map.addSource('vehicles', {
    type: 'geojson',
    data: getVehicleGeoJson(region, tick),
    cluster: true,
    clusterMaxZoom: 12,
    clusterRadius: 60,
  });
  map.addSource('selected-route', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });
  map.addSource('geofences', { type: 'geojson', data: getGeofenceGeoJson(region) });
  map.addSource('exception-heat', { type: 'geojson', data: getExceptionHeatGeoJson(region) });
  map.addSource('warehouse-capacity', {
    type: 'geojson',
    data: getWarehouseCapacityGeoJson(region),
  });
  map.addSource('weather-watch', { type: 'geojson', data: getWeatherGeoJson(region) });
  map.addSource('traffic-corridors', { type: 'geojson', data: getTrafficGeoJson(region) });
}

function addMapLayers(map: Map) {
  map.addLayer({
    id: 'weather-watch',
    type: 'fill',
    source: 'weather-watch',
    paint: { 'fill-color': '#60a5fa', 'fill-opacity': 0.16 },
  });
  map.addLayer({
    id: 'traffic-corridors',
    type: 'line',
    source: 'traffic-corridors',
    paint: {
      'line-color': ['match', ['get', 'congestion'], 'Heavy', '#ef4444', '#f59e0b'],
      'line-width': 3,
      'line-opacity': 0.55,
    },
  });
  map.addLayer({
    id: 'geofence-fill',
    type: 'fill',
    source: 'geofences',
    paint: {
      'fill-color': '#14b8a6',
      'fill-opacity': ['match', ['get', 'eventState'], 'Entry/exit event', 0.24, 0.1],
    },
  });
  map.addLayer({
    id: 'geofence-outline',
    type: 'line',
    source: 'geofences',
    paint: {
      'line-color': ['match', ['get', 'eventState'], 'Entry/exit event', '#f97316', '#0f766e'],
      'line-width': ['match', ['get', 'eventState'], 'Entry/exit event', 3, 1.5],
      'line-dasharray': [2, 2],
    },
  });
  map.addLayer({
    id: 'geofence-event',
    type: 'symbol',
    source: 'geofences',
    filter: ['==', ['get', 'eventState'], 'Entry/exit event'],
    layout: { 'text-field': 'Geofence event', 'text-size': 11, 'text-offset': [0, 1.1] },
    paint: { 'text-color': '#9a3412', 'text-halo-color': '#ffffff', 'text-halo-width': 1 },
  });
  map.addLayer({
    id: 'exception-heat',
    type: 'circle',
    source: 'exception-heat',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 10, 8, 30],
      'circle-color': '#ef4444',
      'circle-opacity': ['get', 'intensity'],
      'circle-blur': 0.85,
    },
  });
  map.addLayer({
    id: 'warehouse-capacity',
    type: 'circle',
    source: 'warehouse-capacity',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'capacity'], 55, 10, 98, 23],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'capacity'],
        55,
        '#22c55e',
        78,
        '#f59e0b',
        95,
        '#ef4444',
      ],
      'circle-opacity': 0.62,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });
  map.addLayer({
    id: 'warehouse-capacity-label',
    type: 'symbol',
    source: 'warehouse-capacity',
    layout: { 'text-field': ['concat', ['to-string', ['get', 'capacity']], '%'], 'text-size': 11 },
    paint: { 'text-color': '#13283d', 'text-halo-color': '#ffffff', 'text-halo-width': 1 },
  });
  map.addLayer({
    id: 'selected-route-planned',
    type: 'line',
    source: 'selected-route',
    filter: ['==', ['get', 'kind'], 'planned'],
    paint: { 'line-color': '#24a7ff', 'line-width': 4, 'line-dasharray': [1, 1.4] },
  });
  map.addLayer({
    id: 'selected-route-actual',
    type: 'line',
    source: 'selected-route',
    filter: ['==', ['get', 'kind'], 'actual'],
    paint: { 'line-color': '#16a34a', 'line-width': 4 },
  });
  map.addLayer({
    id: 'selected-route-deviation',
    type: 'line',
    source: 'selected-route',
    filter: ['==', ['get', 'kind'], 'deviation'],
    paint: { 'line-color': '#ef4444', 'line-width': 3, 'line-dasharray': [0.6, 1.2] },
  });
  map.addLayer({
    id: 'vehicle-clusters',
    type: 'circle',
    source: 'vehicles',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#1976d2',
      'circle-radius': ['step', ['get', 'point_count'], 18, 50, 24, 200, 30, 500, 38],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });
  map.addLayer({
    id: 'vehicle-cluster-count',
    type: 'symbol',
    source: 'vehicles',
    filter: ['has', 'point_count'],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },
    paint: { 'text-color': '#ffffff' },
  });
  map.addLayer({
    id: 'vehicles-unclustered',
    type: 'circle',
    source: 'vehicles',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 7,
      'circle-color': [
        'match',
        ['get', 'status'],
        'ACTIVE',
        '#2e7d32',
        'DELAYED',
        '#ed6c02',
        'WARNING',
        '#d32f2f',
        'IDLE',
        '#757575',
        '#1976d2',
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });
}

function refreshTelemetrySources(
  map: Map,
  region: RegionCode,
  tick: number,
  selectedVehicle: Vehicle | null,
) {
  setSourceData(map, 'vehicles', getVehicleGeoJson(region, tick));

  if (selectedVehicle) {
    setSourceData(map, 'selected-route', getSelectedShipmentRouteGeoJson(selectedVehicle, tick));
  }
}

function refreshAllSources(map: Map, region: RegionCode, tick: number, selectedVehicle: Vehicle | null) {
  refreshTelemetrySources(map, region, tick, selectedVehicle);
  setSourceData(map, 'geofences', getGeofenceGeoJson(region));
  setSourceData(map, 'exception-heat', getExceptionHeatGeoJson(region));
  setSourceData(map, 'warehouse-capacity', getWarehouseCapacityGeoJson(region));
  setSourceData(map, 'weather-watch', getWeatherGeoJson(region));
  setSourceData(map, 'traffic-corridors', getTrafficGeoJson(region));
}

function setSourceData(map: Map | null, sourceId: string, data: object) {
  const source = map?.getSource(sourceId) as GeoJSONSource | undefined;
  source?.setData(data);
}

function applyOverlayVisibility(map: Map, overlays: OverlayState) {
  (Object.keys(overlayLayers) as Array<keyof OverlayState>).forEach((key) => {
    overlayLayers[key].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', overlays[key] ? 'visible' : 'none');
      }
    });
  });
}

interface MapCommandPanelProps {
  lastTelemetryTime: Date;
  overlays: OverlayState;
  region: RegionCode;
  vehicleCount: number;
  onToggleOverlay: (key: keyof OverlayState) => void;
}

function MapCommandPanel({
  lastTelemetryTime,
  overlays,
  region,
  vehicleCount,
  onToggleOverlay,
}: MapCommandPanelProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        width: { xs: 'calc(100% - 24px)', md: 310 },
        maxHeight: 'calc(100% - 24px)',
        overflow: 'auto',
        border: '1px solid rgba(210, 222, 233, 0.92)',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        boxShadow: '0 16px 36px rgba(13, 39, 66, 0.14)',
        p: 1.5,
      }}
    >
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <SensorsRounded sx={{ color: '#0f8d81', fontSize: 18 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: '#13283d', fontSize: 13, fontWeight: 800 }}>
              Live Geospatial Operations
            </Typography>
            <Typography sx={{ color: '#65788d', fontSize: 11 }}>
              {vehicleCount.toLocaleString()} active vehicles and shipments
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap', rowGap: 0.8 }}>
          <Chip size="small" label={REGIONS[region].name} />
          <Chip
            size="small"
            color="success"
            label={`Updated ${lastTelemetryTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}`}
          />
        </Stack>

        <Divider />

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <LayersRounded sx={{ color: '#263f57', fontSize: 18 }} />
          <Typography sx={{ color: '#263f57', fontSize: 12, fontWeight: 800 }}>
            Overlay Layers
          </Typography>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.7 }}>
          {(Object.keys(overlays) as Array<keyof OverlayState>).map((key) => (
            <Stack
              key={key}
              direction="row"
              sx={{
                minHeight: 34,
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #e2ebf2',
                borderRadius: '8px',
                px: 0.8,
                backgroundColor: overlays[key] ? '#f1fbf8' : '#f8fafc',
              }}
            >
              <Typography sx={{ color: '#30465d', fontSize: 11, fontWeight: 700 }}>
                {overlayLabels[key]}
              </Typography>
              <Switch
                size="small"
                checked={overlays[key]}
                onChange={() => onToggleOverlay(key)}
                slotProps={{ input: { 'aria-label': `Toggle ${overlayLabels[key]}` } }}
              />
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}

interface MapPreviewPanelProps {
  lastTelemetryTime: Date;
  region: RegionCode;
  vehicleCount: number;
  onOpen: () => void;
}

function MapPreviewPanel({ lastTelemetryTime, region, vehicleCount, onOpen }: MapPreviewPanelProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        flexWrap: 'wrap',
        border: '1px solid rgba(210, 222, 233, 0.88)',
        borderRadius: '8px',
        backgroundColor: 'rgba(255,255,255,0.92)',
        boxShadow: '0 10px 24px rgba(13, 39, 66, 0.10)',
        px: 1.2,
        py: 1,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
        <SensorsRounded sx={{ color: '#0f8d81', fontSize: 18 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: '#13283d', fontSize: 12, fontWeight: 900 }}>
            Live Map Preview
          </Typography>
          <Typography sx={{ color: '#65788d', fontSize: 11 }}>
            {REGIONS[region].name} - {vehicleCount.toLocaleString()} assets -{' '}
            {lastTelemetryTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Typography>
        </Box>
      </Stack>

      <Button
        size="small"
        variant="contained"
        onClick={onOpen}
        sx={{
          flexShrink: 0,
          borderRadius: '8px',
          backgroundColor: '#0f8d81',
          fontSize: 12,
          fontWeight: 800,
          textTransform: 'none',
          '&:hover': { backgroundColor: '#0b6f66' },
        }}
      >
        Open Live Map
      </Button>
    </Box>
  );
}

function MapLegend() {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 12,
        bottom: 12,
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        border: '1px solid rgba(210, 222, 233, 0.86)',
        borderRadius: '8px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        px: 1,
        py: 0.8,
      }}
    >
      <LegendDot color="#2e7d32" label="Active" />
      <LegendDot color="#ed6c02" label="Delayed" />
      <LegendDot color="#d32f2f" label="Warning" />
      <LegendDot color="#7b8794" label="Idle" />
      <LegendLine color="#24a7ff" label="Planned" />
      <LegendLine color="#16a34a" label="Actual" />
      <LegendLine color="#ef4444" label="Deviation" />
    </Box>
  );
}

interface SelectedAssetPanelProps {
  vehicle: Vehicle;
  tick: number;
  onClose: () => void;
}

function SelectedAssetPanel({ vehicle, tick, onClose }: SelectedAssetPanelProps) {
  const position = getLiveVehiclePosition(vehicle, tick);

  return (
    <Stack spacing={1.4}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
          <RouteRounded sx={{ color: '#0f8d81', fontSize: 18 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: '#13283d', fontSize: 14, fontWeight: 900 }}>
              {vehicle.id}
            </Typography>
            <Typography sx={{ color: '#63758c', fontSize: 11 }}>
              {vehicle.shipmentId} - {vehicle.mode}
            </Typography>
          </Box>
        </Stack>
        <Button size="small" onClick={onClose} sx={{ minWidth: 0, color: '#52677f' }}>
          Close
        </Button>
      </Stack>

      <Divider />

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Chip size="small" label={vehicle.status} />
        <Chip size="small" label={`${vehicle.speed} km/h`} />
        <Chip size="small" label={`${vehicle.fuelLevel}% fuel`} />
        <Chip size="small" label={`${vehicle.temperature} C`} />
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
        <DetailMetric label="Driver" value={vehicle.driver} />
        <DetailMetric label="Asset type" value="Vehicle + shipment" />
        <DetailMetric label="Origin" value={vehicle.origin} />
        <DetailMetric label="Destination" value={vehicle.destination} />
        <DetailMetric label="Latitude" value={position.latitude.toFixed(4)} />
        <DetailMetric label="Longitude" value={position.longitude.toFixed(4)} />
      </Box>

      <Box sx={{ border: '1px solid #e2ebf2', borderRadius: '8px', backgroundColor: '#f8fbfd', p: 1 }}>
        <Typography sx={{ color: '#52677f', fontSize: 11, lineHeight: 1.5 }}>
          Planned route, actual path, and deviation are rendered on the map for this selected
          shipment without leaving the operations view.
        </Typography>
      </Box>
    </Stack>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ color: '#75869b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ color: '#18293d', fontSize: 12, fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: color }} />
      <Typography sx={{ color: '#30465d', fontSize: 11, fontWeight: 700 }}>{label}</Typography>
    </Stack>
  );
}

function LegendLine({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 18, height: 3, borderRadius: 999, backgroundColor: color }} />
      <Typography sx={{ color: '#30465d', fontSize: 11, fontWeight: 700 }}>{label}</Typography>
    </Stack>
  );
}
