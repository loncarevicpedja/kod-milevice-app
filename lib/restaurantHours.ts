import type { RestaurantSettings } from "./restaurantSettingsTypes";

/** Minuti od ponoći u Europe/Belgrade za dati Date */
export function getBelgradeMinutesFromMidnight(d: Date): number {
  const s = d.toLocaleString("en-GB", {
    timeZone: "Europe/Belgrade",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [h, m] = s.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}

/** "HH:MM" ili "H:MM" → minuti od ponoći */
export function parseTimeToMinutes(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

/**
 * Dan u kalendaru za Europe/Belgrade.
 * 0 = nedelja, 1 = ponedeljak, … 6 = subota (isto kao Date.getDay()).
 */
export function getBelgradeDayOfWeek(d: Date): number {
  const wd =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Belgrade",
      weekday: "long",
    })
      .formatToParts(d)
      .find((p) => p.type === "weekday")?.value ?? "Sunday";

  const map: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return map[wd] ?? 0;
}

/** Subota ili nedelja u Belgrade zoni */
export function isWeekendBelgrade(now: Date): boolean {
  const dow = getBelgradeDayOfWeek(now);
  return dow === 0 || dow === 6;
}

export type OrderingClosedReason = "before" | "after" | "closed";

type DayWorkWindow = {
  closed: boolean;
  start: string;
  end: string;
};

function getDayWorkWindow(
  settings: RestaurantSettings,
  dayOfWeek: number,
): DayWorkWindow | null {
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return {
      closed: false,
      start: settings.weekday_work_start,
      end: settings.weekday_work_end,
    };
  }
  if (dayOfWeek === 6) {
    return {
      closed: settings.saturday_closed,
      start: settings.saturday_work_start,
      end: settings.saturday_work_end,
    };
  }
  if (dayOfWeek === 0) {
    return {
      closed: settings.sunday_closed,
      start: settings.sunday_work_start,
      end: settings.sunday_work_end,
    };
  }
  return null;
}

/**
 * Ako je zatvoreno za naručivanje, zašto (pre otvaranja, posle zatvaranja ili neradan dan).
 * Koristi radno vreme po danu u nedelji (Belgrade).
 */
export function getOrderingClosedReason(
  now: Date,
  settings: RestaurantSettings,
): OrderingClosedReason | null {
  const window = getDayWorkWindow(settings, getBelgradeDayOfWeek(now));
  if (!window) return null;
  if (window.closed) return "closed";

  const start = parseTimeToMinutes(window.start);
  const end = parseTimeToMinutes(window.end);
  if (start == null || end == null) return null;

  const cur = getBelgradeMinutesFromMidnight(now);
  if (cur < start) return "before";
  if (cur >= end) return "after";
  return null;
}

export function isOrderingOpen(now: Date, settings: RestaurantSettings): boolean {
  return getOrderingClosedReason(now, settings) === null;
}

export function closedReasonMessage(
  reason: OrderingClosedReason,
  now: Date,
  settings: RestaurantSettings,
): string {
  const dow = getBelgradeDayOfWeek(now);
  const window = getDayWorkWindow(settings, dow);
  if (!window) {
    return "Poručivanje trenutno nije moguće.";
  }

  if (reason === "closed") {
    if (dow === 6) {
      return "Subotom ne radimo. Poručivanje nije moguće.";
    }
    if (dow === 0) {
      return "Nedeljom ne radimo. Poručivanje nije moguće.";
    }
    return "Danas je neradan dan. Poručivanje nije moguće.";
  }

  const dayLabel =
    dow === 6 ? "subotom" : dow === 0 ? "nedeljom" : "radnim danima";

  if (reason === "before") {
    return `Radno vreme još nije počelo (otvaramo u ${window.start} ${dayLabel}). Pokušaj ponovo kasnije tokom dana.`;
  }
  return `Nažalost, radno vreme je završeno. Poručivanje je moguće od sutra. Vidimo se!`;
}
