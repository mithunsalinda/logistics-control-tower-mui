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

  /*
   * Keep the latest region available
   * when the map finishes loading.
   */
  const regionRef = useRef<RegionCode>(region);

  regionRef.current = region;

  /*
   * ======================================
   * CREATE MAP ONLY ONCE
   * ======================================
   */
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

    /*
     * ======================================
     * MAP LOADED
     * ======================================
     */
    map.on('load', () => {
      console.log('✅ Map loaded successfully');

      const currentRegion = regionRef.current;

      const vehicleData = getVehicleGeoJson(currentRegion);

      const vehicleCount = getVehiclesByRegion(currentRegion).length;

      console.log(`🚚 ${vehicleCount} vehicles loaded for ${currentRegion}`);

      /*
       * ======================================
       * VEHICLE SOURCE
       * ======================================
       */

      map.addSource('vehicles', {
        type: 'geojson',

        data: vehicleData,

        /*
         * FR-02 clustering
         */
        cluster: true,

        clusterMaxZoom: 12,

        clusterRadius: 60,
      });

      /*
       * ======================================
       * CLUSTERS
       * ======================================
       */

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

      /*
       * ======================================
       * CLUSTER NUMBER
       * ======================================
       */

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

      /*
       * ======================================
       * INDIVIDUAL VEHICLES
       * ======================================
       */

      map.addLayer({
        id: 'vehicles-unclustered',

        type: 'circle',

        source: 'vehicles',

        filter: ['!', ['has', 'point_count']],

        paint: {
          'circle-radius': 7,

          /*
           * Vehicle color based
           * on operational status.
           */
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

    /*
     * Cleanup
     */
    return () => {
      map.remove();

      mapRef.current = null;
    };
  }, []);

  /*
   * ======================================
   * REGION CHANGE
   * ======================================
   */

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const selectedRegion = REGIONS[region];

    /*
     * Move the map to
     * selected region.
     */
    map.flyTo({
      center: selectedRegion.center,

      zoom: selectedRegion.zoom,

      duration: 1500,

      essential: true,
    });

    /*
     * Get vehicles belonging
     * to selected region.
     */
    const vehicleData = getVehicleGeoJson(region);

    const vehicleCount = getVehiclesByRegion(region).length;

    /*
     * Get existing MapLibre source.
     */
    const source = map.getSource('vehicles') as GeoJSONSource | undefined;

    /*
     * The first render may happen
     * before map.on('load').
     */
    if (!source) {
      return;
    }

    /*
     * Replace vehicle data.
     */
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
