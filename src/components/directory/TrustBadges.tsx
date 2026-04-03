import { ShieldCheck, Clock, ClipboardCheck, Shield, BadgeCheck } from 'lucide-react';

interface TrustBadgesProps {
  depLicensed?: boolean;
  emergency24_7?: boolean;
  manifestProvided?: boolean;
  insured?: boolean;
  verified?: boolean;
}

const badges = [
  {
    key: 'verified' as const,
    label: 'Verified Provider',
    icon: BadgeCheck,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    key: 'depLicensed' as const,
    label: 'DEP Licensed',
    icon: ShieldCheck,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    key: 'emergency24_7' as const,
    label: '24/7 Emergency',
    icon: Clock,
    color: 'text-red-600 bg-red-50',
  },
  {
    key: 'manifestProvided' as const,
    label: 'Manifest Provided',
    icon: ClipboardCheck,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    key: 'insured' as const,
    label: 'Insured',
    icon: Shield,
    color: 'text-blue-600 bg-blue-50',
  },
] as const;

export default function TrustBadges(props: TrustBadgesProps) {
  const activeBadges = badges.filter((b) => props[b.key]);

  if (!activeBadges.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeBadges.map((b) => {
        const Icon = b.icon;
        return (
          <span
            key={b.key}
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${b.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {b.label}
          </span>
        );
      })}
    </div>
  );
}
