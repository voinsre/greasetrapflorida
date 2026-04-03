'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MARKER_SVG = `<svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter>
  <g filter="url(#shadow)">
    <path d="M20 48C20 48 36 28 36 18C36 9.163 28.837 2 20 2C11.163 2 4 9.163 4 18C4 28 20 48 20 48Z" fill="#F59E0B"/>
    <circle cx="20" cy="18" r="11" fill="white"/>
    <circle cx="20" cy="18" r="9" stroke="#F59E0B" stroke-width="1.5" fill="none"/>
    <path d="M20 10C20 10 14 18 14 22C14 25.314 16.686 28 20 28C23.314 28 26 25.314 26 22C26 18 20 10 20 10Z" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.5 22C17.5 20.9 18.5 19 20 17C21.5 19 22.5 20.9 22.5 22C22.5 23.38 21.38 24.5 20 24.5C18.62 24.5 17.5 23.38 17.5 22Z" fill="#F59E0B" fill-opacity="0.4"/>
  </g>
</svg>`;

export default function BusinessMap({
  lat,
  lng,
  name,
  address,
}: {
  lat: number;
  lng: number;
  name: string;
  address?: string | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    }).setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: MARKER_SVG,
      className: '',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50],
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    marker.bindPopup(
      `<strong>${name}</strong>${address ? `<br/>${address}` : ''}`
    );

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [lat, lng, name, address]);

  return (
    <div
      ref={mapRef}
      className="relative z-0 w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden border border-gray-200"
    />
  );
}
