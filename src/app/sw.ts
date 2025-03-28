import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    // Add explicit error event handling types
    addEventListener(
      type: "error",
      listener: (event: ErrorEvent) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: "unhandledrejection",
      listener: (event: PromiseRejectionEvent) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  disableDevLogs: true,
});

serwist.addEventListeners();

// Optional: Add error handling for debugging
self.addEventListener("error", event => {
  console.error("Service Worker error:", event.error);
});

self.addEventListener("unhandledrejection", event => {
  console.error("Service Worker unhandled rejection:", event.reason);
});
