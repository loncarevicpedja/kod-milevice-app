export type RestaurantSettings = {
  id: number;
  delivery_fee_rsd: number;
  prep_time_minutes: number;
  delivery_extra_minutes: number;
  /** Početak intervala kada se na sajtu sme naručiti: pon–pet (Europe/Belgrade) */
  weekday_work_start: string;
  /** Kraj intervala naručivanja za pon–pet (može biti pre 23:00 prikazanog na sajtu) */
  weekday_work_end: string;
  /** Početak naručivanja: sub–ned */
  weekend_work_start: string;
  /** Kraj naručivanja za sub–ned */
  weekend_work_end: string;
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
  weekend_work_start: "14:00",
  weekend_work_end: "22:45",
  menu_cart_enabled: true,
  order_email_enabled: false,
  updated_at: null,
};
