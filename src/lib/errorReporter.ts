import { BUILD_VERSION } from "./buildInfo";

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  componentName?: string;
  route: string;
  language: string;
  buildVersion: string;
  userAgent: string;
  timestamp: string;
}

/**
 * Send a structured error report to a logging endpoint.
 * Endpoint is configurable via VITE_ERROR_REPORT_URL; if absent, the report
 * is logged to the console (still useful for debugging).
 */
export async function reportError(input: {
  error: Error;
  componentStack?: string;
  componentName?: string;
}): Promise<void> {
  const report: ErrorReport = {
    message: input.error.message,
    stack: input.error.stack,
    componentStack: input.componentStack,
    componentName: input.componentName,
    route: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
    language:
      typeof document !== "undefined" ? document.documentElement.lang || "en" : "en",
    buildVersion: BUILD_VERSION,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    timestamp: new Date().toISOString(),
  };

  // Always log locally for instant visibility
  // eslint-disable-next-line no-console
  console.groupCollapsed(`%c[ErrorReport] ${report.message}`, "color:#f87171;font-weight:bold");
  // eslint-disable-next-line no-console
  console.log(report);
  // eslint-disable-next-line no-console
  console.groupEnd();

  const endpoint = import.meta.env.VITE_ERROR_REPORT_URL;
  if (!endpoint) return;

  try {
    const body = JSON.stringify(report);
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    } else {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // Reporting must never throw
  }
}

export type { ErrorReport };
