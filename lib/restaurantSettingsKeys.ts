/** Ključevi u tabeli restaurant_settings (key / value po redu) */
export const RESTAURANT_SETTING_KEYS = [
  "delivery_fee_rsd",
  "prep_time_minutes",
  "delivery_extra_minutes",
  "weekday_work_start",
  "weekday_work_end",
  "weekday_delivery_start",
  "weekday_delivery_end",
  "saturday_work_start",
  "saturday_work_end",
  "saturday_delivery_start",
  "saturday_delivery_end",
  "saturday_closed",
  "sunday_work_start",
  "sunday_work_end",
  "sunday_delivery_start",
  "sunday_delivery_end",
  "sunday_closed",
  "menu_cart_enabled",
  "order_email_enabled",
] as const;

export type RestaurantSettingKey = (typeof RESTAURANT_SETTING_KEYS)[number];
