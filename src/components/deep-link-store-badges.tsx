'use client';

import { StoreBadges } from '@/components/store-badges';

/** Badges App Store / Google Play sous vidéo, plat ou resto. */
export default function DeepLinkStoreBadges({
  className = 'afp-store-row',
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <StoreBadges apps="client" />
    </div>
  );
}
