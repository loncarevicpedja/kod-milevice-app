/** Ključevi u tabeli restaurant_settings (key / value po redu) */
export const RESTAURANT_SETTING_KEYS = [
  "delivery_fee_rsd",
  "prep_time_minutes",
  "delivery_extra_minutes",
  "weekday_work_start",
  "weekday_work_end",
  "weekend_work_start",
  "weekend_work_end",
  "menu_cart_enabled",
  "order_email_enabled",
] as const;

export type RestaurantSettingKey = (typeof RESTAURANT_SETTING_KEYS)[number];
