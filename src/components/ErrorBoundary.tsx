import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches runtime errors anywhere below in the tree (e.g. ReferenceError from
 * a stale Vite HMR cache or a missing component import) and shows a friendly
 * fallback with a hard-reload button instead of a blank screen.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log details so the issue is debuggable in the console.
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Caught render error:", error, info);

    // Heuristic: stale HMR caches typically surface as ReferenceError
    // ("X is not defined"). Auto-clear caches and hard-reload once.
    const isStale =
      error instanceof ReferenceError ||
      /is not defined|Failed to fetch dynamically imported module/i.test(
        error.message
      );

    if (isStale && typeof window !== "undefined") {
      const key = "__lovable_reload_attempt__";
      const attempted = sessionStorage.getItem(key);
      if (!attempted) {
        sessionStorage.setItem(key, "1");
        // Clear caches before hard reload
        if ("caches" in window) {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
        // Bust query string to force fresh modules
        const url = new URL(window.location.href);
        url.searchParams.set("_v", Date.now().toString());
        window.location.replace(url.toString());
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem("__lovable_reload_attempt__");
    const url = new URL(window.location.href);
    url.searchParams.set("_v", Date.now().toString());
    window.location.replace(url.toString());
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
            <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground">
                A part of the page failed to load. This is usually fixed by a
                fresh reload.
              </p>
              {this.state.error?.message && (
                <p className="text-xs text-muted-foreground/70 font-mono mt-3 break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <Button onClick={this.handleReload} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
