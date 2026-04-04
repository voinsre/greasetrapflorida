'use client';

/**
 * AdUnit — renders an ad slot when a publisher ID is configured.
 * Returns null until NEXT_PUBLIC_ADSENSE_PUB_ID is set in .env.local,
 * so it's safe to embed anywhere without breaking the UI.
 */
export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
}: {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  if (!pubId) return null;

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={pubId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
