"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_RESTAURANT_SETTINGS,
  type RestaurantSettings,
} from "@/lib/restaurantSettingsTypes";
import {
  getOrderingClosedReason,
  closedReasonMessage,
  type OrderingClosedReason,
} from "@/lib/restaurantHours";

type Ctx = {
  settings: RestaurantSettings;
  loading: boolean;
  /** null = otvoreno za naručivanje */
  orderingClosedReason: OrderingClosedReason | null;
  isOrderingOpen: boolean;
  closedMessage: string | null;
  refresh: () => Promise<void>;
};

const RestaurantSettingsContext = createContext<Ctx | undefined>(undefined);

export function RestaurantSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  /** Sa servera (layout) – bez keša u browseru, jedan upit po zahtevu. */
  initialSettings?: RestaurantSettings | null;
}) {
  const [settings, setSettings] = useState<RestaurantSettings | null>(
    initialSettings ?? null,
  );
  const [loading, setLoading] = useState(!initialSettings);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const data = (await res.json()) as RestaurantSettings;
      setSettings(data);
    } catch {
      setSettings(DEFAULT_RESTAURANT_SETTINGS);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialSettings) {
      void load(false);
    }
  }, [initialSettings, load]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") void load(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  const orderingClosedReason = useMemo(() => {
    if (!settings) return null;
    return getOrderingClosedReason(new Date(), settings);
  }, [settings]);

  const value = useMemo<Ctx>(() => {
    const s = settings ?? DEFAULT_RESTAURANT_SETTINGS;
    const msg =
      orderingClosedReason != null
        ? closedReasonMessage(orderingClosedReason, new Date(), s)
        : null;
    return {
      settings: s,
      loading,
      orderingClosedReason,
      isOrderingOpen: orderingClosedReason === null,
      closedMessage: msg,
      refresh: () => load(true),
    };
  }, [settings, loading, orderingClosedReason, load]);

  return (
    <RestaurantSettingsContext.Provider value={value}>
      {children}
    </RestaurantSettingsContext.Provider>
  );
}

export function useRestaurantSettings() {
  const ctx = useContext(RestaurantSettingsContext);
  if (!ctx) {
    throw new Error(
      "useRestaurantSettings must be used within RestaurantSettingsProvider",
    );
  }
  return ctx;
}
