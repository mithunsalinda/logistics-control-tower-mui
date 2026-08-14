import { useEffect, useRef } from 'react';
import { Map, NavigationControl, setWorkerUrl, type GeoJSONSource } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { REGIONS, type RegionCode } from '../../config/regions';
import { getVehicleGeoJson, getVehiclesByRegion } from '../../services/vehicleService';

setWorkerUrl(workerUrl);
interface OperationsMapProps {
  region: RegionCode;
}

export default function OperationsMap({ region }: OperationsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const regionRef = useRef<RegionCode>(region);
  regionRef.current = region;
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }
    if (mapRef.current) {
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
      console.log('✅ Map loaded successfully');
      const currentRegion = regionRef.current;
      const vehicleData = getVehicleGeoJson(currentRegion);
      const vehicleCount = getVehiclesByRegion(currentRegion).length;
      console.log(`🚚 ${vehicleCount} vehicles loaded for ${currentRegion}`);
      map.addSource('vehicles', {
        type: 'geojson',
        data: vehicleData,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 60,
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
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
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
    });
    map.on('error', (event) => {
      console.error('❌ MapLibre error:', event.error);
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
    const selectedRegion = REGIONS[region];
    map.flyTo({
      center: selectedRegion.center,
      zoom: selectedRegion.zoom,
      duration: 1500,
      essential: true,
    });
    const vehicleData = getVehicleGeoJson(region);
    const vehicleCount = getVehiclesByRegion(region).length;
    const source = map.getSource('vehicles') as GeoJSONSource | undefined;
    if (!source) {
      return;
    }
    source.setData(vehicleData);
    console.log(`🚚 ${vehicleCount} vehicles displayed for ${region}`);
  }, [region]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
      }}
    />
  );
}
