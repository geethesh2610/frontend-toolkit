/**
 * WEB VITALS DEBUGGER
 *
 * PURPOSE
 * -------
 * Reports Google's Core Web Vitals (LCP, CLS, INP) plus FCP/TTFB, using the
 * official `web-vitals` library. Correctly measuring these is full of edge
 * cases (CLS session windows, LCP finalizing on visibility change/
 * navigation, ...) that aren't worth reimplementing by hand — this is a
 * thin wrapper: one function to call with a reporter, instead of five
 * separate imports scattered through the app.
 *
 * Sibling to performance.ts in this folder, which wraps the raw
 * Performance/PerformanceObserver APIs for ad-hoc timing (custom marks/
 * measures, resource timing, long tasks). Reach for THIS file specifically
 * for the five named Core Web Vitals metrics.
 *
 * WHEN TO USE
 * -----------
 * Sending real-user-monitoring (RUM) data to an analytics/observability
 * backend so you know actual field performance, not just local Lighthouse
 * runs.
 *
 * BEHAVIOR
 * --------
 * `reportWebVitals` subscribes to all five metrics immediately; each fires
 * independently whenever the browser has a value for it. LCP/CLS/INP can
 * report more than once as they refine toward a final value — this wrapper
 * uses `web-vitals`'s default (report only the settled/final value per
 * page lifecycle event) rather than every intermediate change; pass
 * `{ reportAllChanges: true }` if you want every update instead.
 *
 * USAGE
 * -----
 * import { reportWebVitals } from "./debugger/webVitals";
 * import { logger } from "./debugger";
 *
 * reportWebVitals((metric) => {
 *     logger.info(`[web-vitals] ${metric.name}`, metric);
 *     navigator.sendBeacon("/analytics", JSON.stringify(metric));
 * });
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric, type ReportOpts } from "web-vitals";

export type { Metric as WebVitalMetric };

export function reportWebVitals(onReport: (metric: Metric) => void, options?: ReportOpts): void {
    onCLS(onReport, options);
    onFCP(onReport, options);
    onINP(onReport, options);
    onLCP(onReport, options);
    onTTFB(onReport, options);
}
