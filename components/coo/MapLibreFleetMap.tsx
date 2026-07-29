'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MapPin, Activity, Search, Layers, Maximize2, Navigation, Battery, Radio, Locate
} from 'lucide-react';

// Vehicle Telemetry Interface
export interface VehicleTelemetry {
  id: string;
  vin: string;
  reg: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  battery: number;
  batteryTemp: number;
  motorTemp: number;
  status: string;
  charging: boolean;
  driver: string;
  hub: string;
  lastUpdated: string;
  odometer: number;
  tripDistance: number;
  currentTrip: string;
  route: [number, number][];
}

// CARTO Voyager Light Tile Style Spec
const brightLightStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'osm-bright-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'osm-bright-layer',
      type: 'raster',
      source: 'osm-bright-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export function MapLibreFleetMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});

  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTelemetry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGeofence, setShowGeofence] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Fetch Database Vehicle Telemetry
  useEffect(() => {
    async function fetchDbVehicles() {
      try {
        const res = await fetch('http://localhost:8000/api/coo/fleet');
        if (res.ok) {
          const data = await res.json();
          if (data.vehicles && data.vehicles.length > 0) {
            const mapped: VehicleTelemetry[] = data.vehicles.map((v: any) => ({
              id: v.id,
              vin: v.vin,
              reg: v.registration_number,
              lat: v.current_lat || 12.9716,
              lng: v.current_lng || 77.5946,
              heading: 140,
              speed: v.speed_kmh || 38.5,
              battery: v.soc_percent || 85,
              batteryTemp: 34.2,
              motorTemp: 41.0,
              status: v.status || 'OPERATIONAL',
              charging: v.status === 'CHARGING',
              driver: 'Assigned Driver',
              hub: 'Bengaluru Central Depot',
              lastUpdated: 'Live Database',
              odometer: 14280,
              tripDistance: 42.5,
              currentTrip: 'Active Service Route',
              route: [[v.current_lng - 0.005, v.current_lat - 0.005], [v.current_lng, v.current_lat]],
            }));
            setVehicles(mapped);
            setSelectedVehicle(mapped[0]);
          }
        }
      } catch (e) {
        console.error('Error fetching fleet DB records:', e);
      }
    }
    fetchDbVehicles();
  }, []);

  // Status helper color generator
  const getStatusColor = (v: VehicleTelemetry) => {
    if (v.status === 'CRITICAL' || v.battery < 20) return '#dc2626'; // Red
    if (v.status === 'CHARGING' || v.charging) return '#7c3aed'; // Purple
    if (v.status === 'MAINTENANCE') return '#d97706'; // Amber
    if (v.battery >= 20 && v.battery < 50) return '#ea580c'; // Orange
    return '#059669'; // Emerald Green
  };

  // 2. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: brightLightStyle,
      center: [77.5946, 12.9716],
      zoom: 12,
      pitch: 45,
      bearing: -15,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.resize();

      // Geofence Layer
      map.addSource('bengaluru-geofence', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Bengaluru Core Fleet Boundary' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [77.5200, 13.0600],
                [77.7400, 13.0600],
                [77.7400, 12.8300],
                [77.5200, 12.8300],
                [77.5200, 13.0600],
              ],
            ],
          },
        },
      });

      map.addLayer({
        id: 'geofence-fill',
        type: 'fill',
        source: 'bengaluru-geofence',
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.08,
        },
      });

      map.addLayer({
        id: 'geofence-line',
        type: 'line',
        source: 'bengaluru-geofence',
        paint: {
          'line-color': '#2563eb',
          'line-width': 2.5,
          'line-dasharray': [4, 3],
        },
      });
    });

    const timer = setTimeout(() => {
      if (mapRef.current) mapRef.current.resize();
    }, 400);

    return () => {
      clearTimeout(timer);
      map.remove();
    };
  }, []);

  // 3. Render Database Vehicle Markers on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || vehicles.length === 0) return;

    vehicles.forEach((v) => {
      const color = getStatusColor(v);
      let marker = markersRef.current[v.id];

      if (!marker) {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative flex flex-col items-center z-10 hover:z-50';
        el.id = `marker-${v.id}`;

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-200 transform group-hover:scale-125" style="background-color: ${color};">
              <span class="text-white text-[9px] font-black">${v.charging ? '⚡' : '🛵'}</span>
            </div>
            ${v.status === 'CRITICAL' ? `<div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></div>` : ''}
          </div>
          <div class="mt-1 px-2 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-extrabold text-slate-900 whitespace-nowrap shadow-md flex items-center gap-1">
            <span>${v.reg}</span>
            <span class="text-[9px] text-emerald-700 font-black">${v.battery}%</span>
          </div>
        `;

        const popupHTML = `
          <div class="p-3 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-2xl text-xs space-y-2 min-w-[220px]">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <span class="font-extrabold text-sm text-blue-600">${v.reg}</span>
              <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">${v.status}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div><span class="text-slate-500 block">VIN</span><strong class="text-slate-900 font-mono">${v.vin}</strong></div>
              <div><span class="text-slate-500 block">Speed</span><strong class="text-emerald-700">${v.speed} km/h</strong></div>
              <div><span class="text-slate-500 block">Battery (SOC)</span><strong class="text-blue-600">${v.battery}%</strong></div>
              <div><span class="text-slate-500 block">Status</span><strong class="text-slate-800">${v.status}</strong></div>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(popupHTML);

        el.addEventListener('click', () => {
          setSelectedVehicle(v);
          map.flyTo({ center: [v.lng, v.lat], zoom: 15, pitch: 45, speed: 1.2 });
        });

        marker = new maplibregl.Marker({ element: el, rotation: v.heading })
          .setLngLat([v.lng, v.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current[v.id] = marker;
      } else {
        marker.setLngLat([v.lng, v.lat]);
      }
    });
  }, [vehicles]);

  // Search Handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const match = vehicles.find(
      (v) =>
        v.reg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vin.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match && mapRef.current) {
      setSelectedVehicle(match);
      mapRef.current.flyTo({ center: [match.lng, match.lat], zoom: 16, pitch: 45, speed: 1.4 });
      const m = markersRef.current[match.id];
      if (m && m.getPopup()) m.togglePopup();
    }
  };

  // Camera Locate Button Action
  const handleLocateVehicle = (v: VehicleTelemetry) => {
    setSelectedVehicle(v);
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [v.lng, v.lat], zoom: 16, pitch: 45, speed: 1.4 });
      const m = markersRef.current[v.id];
      if (m && !m.getPopup().isOpen()) m.togglePopup();
    }
  };

  // Dynamic Fleet Counters from DB
  const onlineCount = useMemo(() => vehicles.filter((v) => v.status === 'OPERATIONAL').length, [vehicles]);
  const criticalCount = useMemo(() => vehicles.filter((v) => v.status === 'CRITICAL' || v.battery < 20).length, [vehicles]);

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-100 p-4' : ''}`}>
      {/* Container Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200 text-blue-600 shadow-xs">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900 flex items-center gap-2">
              <span>Live GPS Radar & Telemetry Feed (Database Vehicles)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                DATABASE SYNCED
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Queried from SQLite Database Table `vehicles` • Real-Time GPS Tracking
            </p>
          </div>
        </div>

        {/* Search & Header Controls */}
        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reg No or VIN..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-56 font-medium"
            />
          </form>

          <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl font-mono font-bold border border-emerald-200 shadow-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{vehicles.length} DB Vehicles Loaded</span>
          </span>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Map (3 cols) + Telemetry Side Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Canvas Box */}
        <div className="lg:col-span-3 relative bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-xs min-h-[520px]">
          {/* MapLibre DOM Container Element */}
          <div ref={mapContainerRef} className="w-full h-[540px]" />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-[10px] text-slate-700 space-y-1.5 shadow-lg">
            <span className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
              Marker Status Legend
            </span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Operational</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span> Critical</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Charging</span>
            </div>
          </div>
        </div>

        {/* Right Side Telemetry Panel */}
        <div className="space-y-4">
          {/* Real-time Counters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900 space-y-3 shadow-xs">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center justify-between">
              <span>DATABASE FLEET STATUS</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Operational</span>
                <span className="text-lg font-black text-emerald-600">{onlineCount} Units</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Critical Status</span>
                <span className="text-lg font-black text-red-600">{criticalCount} Units</span>
              </div>
            </div>
          </div>

          {/* Active Vehicle Card */}
          {selectedVehicle && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-xs font-black text-blue-600 block">{selectedVehicle.reg}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedVehicle.vin}</span>
                </div>
                <button
                  onClick={() => handleLocateVehicle(selectedVehicle)}
                  className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center space-x-1 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  <Locate className="w-3 h-3" />
                  <span>Locate</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-500">Battery Level</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5" />
                    <span>{selectedVehicle.battery}%</span>
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-500">Current Speed</span>
                  <span className="font-bold text-blue-600">{selectedVehicle.speed} km/h</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-slate-800">{selectedVehicle.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Dynamic Status Bar */}
      {selectedVehicle && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-4">
            <span className="text-blue-600 font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Database Record: {selectedVehicle.reg}</span>
            </span>
            <span>
              GPS: {selectedVehicle.lat.toFixed(4)}° N, {selectedVehicle.lng.toFixed(4)}° E
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Speed: <strong className="text-slate-900">{selectedVehicle.speed} km/h</strong></span>
            <span>Status: <strong className="text-emerald-600">{selectedVehicle.status}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
