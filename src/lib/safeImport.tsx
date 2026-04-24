import { lazy, ComponentType, Suspense, ReactNode } from "react";

/**
 * Safely lazy-load an optional component (e.g. a heavy 3D Globe / Spline
 * widget). If the dynamic import fails — missing dependency, network error,
 * stale chunk — render a placeholder instead of crashing the page.
 */
export function safeLazy<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  Placeholder: ComponentType<P> = (() => null) as ComponentType<P>
) {
  const Lazy = lazy(() =>
    loader().catch((err) => {
      // eslint-disable-next-line no-console
      console.warn("[safeLazy] Optional component failed to load:", err);
      return { default: Placeholder };
    })
  );
  return Lazy;
}

interface SafeMountProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrap optional/3D widgets so a load delay shows a fallback instead of
 * blocking the page.
 */
export const SafeMount = ({ children, fallback = null }: SafeMountProps) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);
