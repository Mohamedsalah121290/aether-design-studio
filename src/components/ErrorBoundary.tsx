import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Copy, Check, Bug } from "lucide-react";
import { reportError } from "@/lib/errorReporter";
import { BUILD_VERSION } from "@/lib/buildInfo";

interface Props {
  children: ReactNode;
  /** Human-friendly name for this section, e.g. "Navbar", "StorePage". */
  name?: string;
  /** Custom fallback. If provided, replaces the built-in overlay. */
  fallback?: ReactNode;
  /** When true, render only an inline section error instead of full-screen. */
  inline?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  componentStack: string;
  copied: boolean;
}

const STALE_REGEX =
  /is not defined|Failed to fetch dynamically imported module|Loading chunk \d+ failed|Importing a module script failed/i;

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, componentStack: "", copied: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const componentStack = info.componentStack || "";
    this.setState({ componentStack });

    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary:${this.props.name ?? "root"}]`, error, info);

    reportError({
      error,
      componentStack,
      componentName: this.props.name,
    });

    const isStale = error instanceof ReferenceError || STALE_REGEX.test(error.message);

    if (isStale && typeof window !== "undefined" && !this.props.inline) {
      const key = "__lovable_reload_attempt__";
      const attempted = sessionStorage.getItem(key);
      if (!attempted) {
        sessionStorage.setItem(key, "1");
        if ("caches" in window) {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
        const url = new URL(window.location.href);
        url.searchParams.set("_v", `${BUILD_VERSION}-${Date.now()}`);
        window.location.replace(url.toString());
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem("__lovable_reload_attempt__");
    const url = new URL(window.location.href);
    url.searchParams.set("_v", `${BUILD_VERSION}-${Date.now()}`);
    window.location.replace(url.toString());
  };

  buildDetails = (): string => {
    const { error, componentStack } = this.state;
    return [
      `Component: ${this.props.name ?? "(root)"}`,
      `Build: ${BUILD_VERSION}`,
      `Route: ${typeof window !== "undefined" ? window.location.pathname + window.location.search : ""}`,
      `Time: ${new Date().toISOString()}`,
      `Message: ${error?.message ?? ""}`,
      "",
      "Stack:",
      error?.stack ?? "",
      "",
      "Component stack:",
      componentStack,
    ].join("\n");
  };

  handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(this.buildDetails());
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 1500);
    } catch {
      // ignore
    }
  };

  renderOverlay(inline: boolean) {
    const { error, componentStack, copied } = this.state;
    const wrapperClass = inline
      ? "w-full p-6 rounded-2xl border border-destructive/30 bg-destructive/5 backdrop-blur"
      : "min-h-screen bg-background flex items-center justify-center p-6";
    const cardClass = inline
      ? "w-full"
      : "max-w-xl w-full p-8 rounded-2xl border border-border/50 bg-card/60 backdrop-blur shadow-2xl";

    return (
      <div className={wrapperClass}>
        <div className={`${cardClass} space-y-5`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground">
                  {inline ? "Section failed to load" : "Something went wrong"}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono text-muted-foreground border border-border/50">
                  <Bug className="w-3 h-3" />
                  {this.props.name ?? "root"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 break-words">
                {error?.message || "An unexpected error occurred."}
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                build {BUILD_VERSION}
              </p>
            </div>
          </div>

          <details className="rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
            <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground select-none">
              Error details
            </summary>
            <pre className="px-3 py-2 text-[11px] leading-relaxed text-muted-foreground/90 max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono">
              {error?.stack || error?.message}
              {componentStack ? `\n\nComponent stack:${componentStack}` : ""}
            </pre>
          </details>

          <div className="flex flex-wrap gap-2">
            <Button onClick={this.handleReload} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reload
            </Button>
            <Button onClick={this.handleCopy} variant="outline" className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy details"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return this.renderOverlay(!!this.props.inline);
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
