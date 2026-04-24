import { cn } from '@/lib/utils';

interface FlagIconProps {
  country: string;
  className?: string;
  size?: number;
}

/**
 * High-quality SVG flag icon from flagcdn.com.
 * Falls back gracefully if the image fails to load.
 */
const FlagIcon = ({ country, className, size = 20 }: FlagIconProps) => {
  const code = country.toLowerCase();
  return (
    <span
      className={cn(
        'inline-flex shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/10 shadow-sm bg-muted',
        className
      )}
      style={{ width: size * 1.4, height: size }}
      aria-hidden="true"
    >
      <img
        src={`https://flagcdn.com/${code}.svg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
};

export default FlagIcon;
