"use client";

import { useSyncExternalStore } from "react";

// replaceState/pushState don't emit "popstate", so setSearchParam dispatches
// this event to notify subscribers of in-app URL writes.
const SEARCH_PARAM_EVENT = "app:searchparamchange";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(SEARCH_PARAM_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(SEARCH_PARAM_EVENT, callback);
  };
}

/**
 * Read a query-string parameter as a reactive value. Re-renders on browser
 * navigation (back/forward) and on `setSearchParam` writes. Returns null during
 * SSR and the hydration render so URL-dependent UI never mismatches.
 */
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null
  );
}

/**
 * Set or clear a single query-string parameter in place (replaceState, so no
 * history spam), preserving the rest of the query string and the hash, then
 * notify `useSearchParam` subscribers. Pass null/empty to delete the param.
 */
export function setSearchParam(name: string, value: string | null): void {
  const params = new URLSearchParams(window.location.search);
  if (value) {
    params.set(name, value);
  } else {
    params.delete(name);
  }
  const query = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
  );
  window.dispatchEvent(new Event(SEARCH_PARAM_EVENT));
}
