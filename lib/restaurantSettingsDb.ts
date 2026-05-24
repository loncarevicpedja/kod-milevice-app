import { supabase } from "@/lib/supabaseClient";
import { getSupabaseService } from "@/lib/supabaseService";
import {
  DEFAULT_RESTAURANT_SETTINGS,
  type RestaurantSettings,
} from "@/lib/restaurantSettingsTypes";
import {
  RESTAURANT_SETTING_KEYS,
  type RestaurantSettingKey,
} from "@/lib/restaurantSettingsKeys";

type Row = { key: string; value: string; updated_at?: string | null };

function parseSettingBoolean(raw: string, defaultValue: boolean): boolean {
  const v = raw.trim().toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return defaultValue;
}

export function rowsToRestaurantSettings(rows: Row[] | null): RestaurantSettings {
  if (!rows?.length) return DEFAULT_RESTAURANT_SETTINGS;

  const m = new Map(rows.map((r) => [r.key, r.value]));
  const get = (k: string, def: string) => (m.get(k) ?? def).trim();

  let latestTs = 0;
  for (const r of rows) {
    if (r.updated_at) {
      const t = new Date(r.updated_at).getTime();
      if (!Number.isNaN(t) && t > latestTs) latestTs = t;
    }
  }

  const def = DEFAULT_RESTAURANT_SETTINGS;

  /** Stari ključevi work_start_time / work_end_time – ako novi još nisu u bazi */
  const legacyStart = (m.get("work_start_time") ?? "").trim();
  const legacyEnd = (m.get("work_end_time") ?? "").trim();
  const fallbackWeekdayStart = legacyStart || def.weekday_work_start;
  const fallbackWeekdayEnd = legacyEnd || def.weekday_work_end;
  /** Stari weekend_* ključevi — fallback za sub/ned ako novi još nisu u bazi */
  const legacyWeekendStart =
    (m.get("weekend_work_start") ?? "").trim() ||
    legacyStart ||
    def.saturday_work_start;
  const legacyWeekendEnd =
    (m.get("weekend_work_end") ?? "").trim() ||
    legacyEnd ||
    def.saturday_work_end;

  return {
    id: 1,
    delivery_fee_rsd: Math.max(
      0,
      parseInt(get("delivery_fee_rsd", String(def.delivery_fee_rsd)), 10) ||
        def.delivery_fee_rsd,
    ),
    prep_time_minutes: Math.max(
      0,
      parseInt(get("prep_time_minutes", String(def.prep_time_minutes)), 10) ||
        def.prep_time_minutes,
    ),
    delivery_extra_minutes: Math.max(
      0,
      parseInt(
        get("delivery_extra_minutes", String(def.delivery_extra_minutes)),
        10,
      ) || def.delivery_extra_minutes,
    ),
    weekday_work_start: get("weekday_work_start", fallbackWeekdayStart),
    weekday_work_end: get("weekday_work_end", fallbackWeekdayEnd),
    saturday_work_start: get("saturday_work_start", legacyWeekendStart),
    saturday_work_end: get("saturday_work_end", legacyWeekendEnd),
    saturday_closed: parseSettingBoolean(
      get("saturday_closed", "false"),
      def.saturday_closed,
    ),
    sunday_work_start: get("sunday_work_start", legacyWeekendStart),
    sunday_work_end: get("sunday_work_end", legacyWeekendEnd),
    sunday_closed: parseSettingBoolean(
      get("sunday_closed", "false"),
      def.sunday_closed,
    ),
    menu_cart_enabled: (() => {
      const raw = (m.get("menu_cart_enabled") ?? "true").toString().trim().toLowerCase();
      return raw !== "false" && raw !== "0";
    })(),
    order_email_enabled: (() => {
      const raw = (m.get("order_email_enabled") ?? "false").toString().trim().toLowerCase();
      return raw === "true" || raw === "1";
    })(),
    updated_at: latestTs > 0 ? new Date(latestTs).toISOString() : null,
  };
}

/** Mapiranje za PATCH – samo skalari */
export function mergeRestaurantSettings(
  base: RestaurantSettings,
  body: Partial<RestaurantSettings>,
): RestaurantSettings {
  return {
    ...base,
    delivery_fee_rsd:
      body.delivery_fee_rsd != null
        ? Math.max(0, Number(body.delivery_fee_rsd))
        : base.delivery_fee_rsd,
    prep_time_minutes:
      body.prep_time_minutes != null
        ? Math.max(0, Number(body.prep_time_minutes))
        : base.prep_time_minutes,
    delivery_extra_minutes:
      body.delivery_extra_minutes != null
        ? Math.max(0, Number(body.delivery_extra_minutes))
        : base.delivery_extra_minutes,
    weekday_work_start:
      typeof body.weekday_work_start === "string"
        ? body.weekday_work_start.trim()
        : base.weekday_work_start,
    weekday_work_end:
      typeof body.weekday_work_end === "string"
        ? body.weekday_work_end.trim()
        : base.weekday_work_end,
    saturday_work_start:
      typeof body.saturday_work_start === "string"
        ? body.saturday_work_start.trim()
        : base.saturday_work_start,
    saturday_work_end:
      typeof body.saturday_work_end === "string"
        ? body.saturday_work_end.trim()
        : base.saturday_work_end,
    saturday_closed:
      typeof body.saturday_closed === "boolean"
        ? body.saturday_closed
        : base.saturday_closed,
    sunday_work_start:
      typeof body.sunday_work_start === "string"
        ? body.sunday_work_start.trim()
        : base.sunday_work_start,
    sunday_work_end:
      typeof body.sunday_work_end === "string"
        ? body.sunday_work_end.trim()
        : base.sunday_work_end,
    sunday_closed:
      typeof body.sunday_closed === "boolean"
        ? body.sunday_closed
        : base.sunday_closed,
    menu_cart_enabled:
      typeof body.menu_cart_enabled === "boolean"
        ? body.menu_cart_enabled
        : base.menu_cart_enabled,
    order_email_enabled:
      typeof body.order_email_enabled === "boolean"
        ? body.order_email_enabled
        : base.order_email_enabled,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Čita `restaurant_settings`. Koristi **service role** ako postoji u env (zaobilazi RLS).
 * Samo **anon** često nema SELECT na ovoj tabeli – tada bi vraćao prazno i izgledalo kao
 * „stara” podrazumevana vremena iako je upis u bazi ispravan.
 */
export async function getRestaurantSettingsFromDb(): Promise<RestaurantSettings> {
  const client = getSupabaseService() ?? supabase;

  const { data, error } = await client
    .from("restaurant_settings")
    .select("key, value, updated_at");

  if (error) {
    console.error("restaurant_settings:", error);
    return DEFAULT_RESTAURANT_SETTINGS;
  }

  return rowsToRestaurantSettings((data ?? []) as Row[]);
}

export function settingsToKeyValueRows(
  s: RestaurantSettings,
  updatedAt: string,
): { key: string; value: string; updated_at: string }[] {
  const pick = (k: RestaurantSettingKey): string => {
    switch (k) {
      case "delivery_fee_rsd":
        return String(s.delivery_fee_rsd);
      case "prep_time_minutes":
        return String(s.prep_time_minutes);
      case "delivery_extra_minutes":
        return String(s.delivery_extra_minutes);
      case "weekday_work_start":
        return s.weekday_work_start;
      case "weekday_work_end":
        return s.weekday_work_end;
      case "saturday_work_start":
        return s.saturday_work_start;
      case "saturday_work_end":
        return s.saturday_work_end;
      case "saturday_closed":
        return s.saturday_closed ? "true" : "false";
      case "sunday_work_start":
        return s.sunday_work_start;
      case "sunday_work_end":
        return s.sunday_work_end;
      case "sunday_closed":
        return s.sunday_closed ? "true" : "false";
      case "menu_cart_enabled":
        return s.menu_cart_enabled ? "true" : "false";
      case "order_email_enabled":
        return s.order_email_enabled ? "true" : "false";
      default:
        return "";
    }
  };
  return RESTAURANT_SETTING_KEYS.map((key) => ({
    key,
    value: pick(key),
    updated_at: updatedAt,
  }));
}
