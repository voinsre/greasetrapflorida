'use client';

import dynamic from 'next/dynamic';

const BusinessMap = dynamic(
  () => import('@/components/directory/BusinessMap'),
  { ssr: false }
);

export default function MapWrapper({
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
  return <BusinessMap lat={lat} lng={lng} name={name} address={address} />;
}
