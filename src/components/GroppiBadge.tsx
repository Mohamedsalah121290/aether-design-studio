interface GroppiBadgeProps {
  compact?: boolean;
  className?: string;
}

/** "Website by Groppi" credit badge shown in the sticky header. */
const GroppiBadge = ({ compact = false, className = '' }: GroppiBadgeProps) => (
  <a
    href="https://groppi.be"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Website developed by Groppi Marketing Bureau"
    className={`group inline-flex shrink-0 flex-col items-center justify-center rounded-full border border-white/10 bg-white/5 leading-none text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
      compact ? 'h-9 px-2.5' : 'h-9 px-3'
    } ${className}`}
  >
    <span className="text-[8px] font-semibold uppercase tracking-[0.18em] opacity-70">
      {compact ? 'By' : 'Website by'}
    </span>
    <span className="mt-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-foreground/90 transition-colors group-hover:text-primary">
      Groppi
    </span>
  </a>
);

export default GroppiBadge;
