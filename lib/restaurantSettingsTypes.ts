export type RestaurantSettings = {
  id: number;
  delivery_fee_rsd: number;
  prep_time_minutes: number;
  delivery_extra_minutes: number;
  /** Početak intervala kada se na sajtu sme naručiti: pon–pet (Europe/Belgrade) */
  weekday_work_start: string;
  /** Kraj intervala naručivanja za pon–pet (može biti pre 23:00 prikazanog na sajtu) */
  weekday_work_end: string;
  /** Početak intervala kada je dostupna dostava: pon–pet */
  weekday_delivery_start: string;
  /** Kraj intervala dostave: pon–pet (van njega samo lično preuzimanje) */
  weekday_delivery_end: string;
  /** Početak naručivanja: subota */
  saturday_work_start: string;
  /** Kraj naručivanja: subota */
  saturday_work_end: string;
  /** Početak dostave: subota */
  saturday_delivery_start: string;
  /** Kraj dostave: subota */
  saturday_delivery_end: string;
  /** true = subota je neradan dan (naručivanje isključeno) */
  saturday_closed: boolean;
  /** Početak naručivanja: nedelja */
  sunday_work_start: string;
  /** Kraj naručivanja: nedelja */
  sunday_work_end: string;
  /** Početak dostave: nedelja */
  sunday_delivery_start: string;
  /** Kraj dostave: nedelja */
  sunday_delivery_end: string;
  /** true = nedelja je neradan dan (naručivanje isključeno) */
  sunday_closed: boolean;
  /** false = samo pregled menija, bez dodavanja u korpu */
  menu_cart_enabled: boolean;
  /**
   * true = šalji kopiju porudžbine na email restorana (rezerva ako POS ne radi).
   * false = podrazumevano – bez emaila; porudžbina ostaje u bazi (POS terminal štampa).
   */
  order_email_enabled: boolean;
  updated_at: string | null;
};

export const DEFAULT_RESTAURANT_SETTINGS: RestaurantSettings = {
  id: 1,
  delivery_fee_rsd: 200,
  prep_time_minutes: 25,
  delivery_extra_minutes: 25,
  weekday_work_start: "12:00",
  weekday_work_end: "22:45",
  weekday_delivery_start: "12:00",
  weekday_delivery_end: "22:45",
  saturday_work_start: "14:00",
  saturday_work_end: "22:45",
  saturday_delivery_start: "14:00",
  saturday_delivery_end: "22:45",
  saturday_closed: false,
  sunday_work_start: "14:00",
  sunday_work_end: "22:45",
  sunday_delivery_start: "14:00",
  sunday_delivery_end: "22:45",
  sunday_closed: false,
  menu_cart_enabled: true,
  order_email_enabled: false,
  updated_at: null,
};
