import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

/**
 * `self.__SW_MANIFEST` is Serwist's injection point.
 *
 * The build replaces it with the precache manifest.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
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

interface IFetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
  preloadResponse: Promise<Response | undefined>;
}

// @ts-expect-error - This is a workaround for a bug in the `serwist` package.
self.addEventListener("fetch", (event: IFetchEvent) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          return await fetch(event.request);
        } catch (error) {
          console.error("Navigation preload error:", error);
          return fetch(event.request);
        }
      })(),
    );
  }
});

serwist.addEventListeners();

self.addEventListener("error", event => {
  console.error("Service Worker error:", event.error);
});

self.addEventListener("unhandledrejection", event => {
  console.error("Service Worker unhandled rejection:", event.reason);
});
