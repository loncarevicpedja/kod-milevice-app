-- Pokreni ako si posle prve migracije tek dodelio addon_kind (tortilla_meat / tortilla_spread)
-- na dodatke – popunjava veze slot ↔ dodatak bez duplikata.

INSERT INTO public.product_addon_slot_addon (slot_id, addon_id)
SELECT pas.id, a.id
FROM public.product_addon_slot pas
INNER JOIN public.product p ON p.id = pas.product_id
INNER JOIN public.product_type pt ON pt.id = p.product_type_id
CROSS JOIN public.addon a
WHERE lower(pt.name) LIKE '%tort%'
  AND pas.sort_order = 0
  AND a.addon_kind = 'tortilla_meat'
  AND a.is_active = true
ON CONFLICT (slot_id, addon_id) DO NOTHING;

INSERT INTO public.product_addon_slot_addon (slot_id, addon_id)
SELECT pas.id, a.id
FROM public.product_addon_slot pas
INNER JOIN public.product p ON p.id = pas.product_id
INNER JOIN public.product_type pt ON pt.id = p.product_type_id
CROSS JOIN public.addon a
WHERE lower(pt.name) LIKE '%tort%'
  AND pas.sort_order = 1
  AND a.addon_kind = 'tortilla_spread'
  AND a.is_active = true
ON CONFLICT (slot_id, addon_id) DO NOTHING;
