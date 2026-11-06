/** Shared Supabase select for public product cards (meni, slider, istaknuto). */
export const PRODUCT_PUBLIC_SELECT = `
  id,
  name,
  description,
  price,
  image_url,
  product_category_id,
  order_no,
  product_type:product_type_id ( name ),
  taste_type:taste_type_id ( name ),
  product_category:product_category_id ( name, order_no ),
  product_addon_slot (
    id,
    sort_order,
    label,
    max_select,
    product_addon_slot_addon (
      addon_id,
      addon (
        id,
        name,
        price,
        is_active
      )
    )
  )
`;
