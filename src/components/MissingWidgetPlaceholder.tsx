import { Globe2 } from "lucide-react";

interface MissingWidgetPlaceholderProps {
  /** What kind of widget was supposed to render (e.g. "3D Globe"). */
  label?: string;
  /** Optional helper text shown under the title. */
  hint?: string;
  /** Approximate height of the slot so layout doesn't jump. */
  height?: string | number;
  className?: string;
}

/**
 * Branded glass/bento placeholder used when an optional 3D widget (Globe,
 * Spline, etc.) fails to load. Preserves layout and matches the site's
 * Cyberpunk-Apple aesthetic.
 */
const MissingWidgetPlaceholder = ({
  label = "3D Widget",
  hint = "Visual unavailable — content continues below.",
  height = 320,
  className = "",
}: MissingWidgetPlaceholderProps) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 ${className}`}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        background:
          "linear-gradient(135deg, hsl(222 47% 12% / 0.55) 0%, hsl(260 47% 14% / 0.55) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 40px -10px rgba(99, 102, 241, 0.15)",
      }}
      aria-label={`${label} placeholder`}
      role="img"
    >
      {/* Animated mesh glow */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at 30% 20%, hsl(220 100% 60% / 0.18), transparent 50%), radial-gradient(500px circle at 70% 80%, hsl(280 100% 65% / 0.18), transparent 50%)",
        }}
      />

      {/* Bento grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative h-full w-full flex flex-col items-center justify-center text-center px-6 gap-3">
        <div
          className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 0 40px hsl(220 100% 60% / 0.25)",
          }}
        >
          <Globe2 className="w-8 h-8 text-primary/80 animate-pulse" strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-wide text-foreground/90 uppercase">
            {label}
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">{hint}</p>
        </div>
      </div>
    </div>
  );
};

export default MissingWidgetPlaceholder;
