-- Novi addon_kind za osnovne slane palačinke (grupe Meso / Namaz kao kod tortilje)
ALTER TABLE public.addon
  DROP CONSTRAINT IF EXISTS addon_addon_kind_check;

ALTER TABLE public.addon
  ADD CONSTRAINT addon_addon_kind_check CHECK (
    addon_kind IS NULL
    OR addon_kind IN (
      'pancake_sweet',
      'pancake_savory',
      'pancake_savory_meat',
      'pancake_savory_spread',
      'tortilla_meat',
      'tortilla_spread',
      'none'
    )
  );

-- Proizvodi: slane palačinke u „classic“ kategoriji (isto pravilo kao isClassicPancakeCategory u app-u).
-- Slotovi Meso / Namaz na tim proizvodima
WITH classic_savory_pancake AS (
  SELECT p.id AS product_id
  FROM public.product p
  INNER JOIN public.product_type pt ON pt.id = p.product_type_id
  INNER JOIN public.taste_type tt ON tt.id = p.taste_type_id
  INNER JOIN public.product_category pc ON pc.id = p.product_category_id
  WHERE lower(pt.name) LIKE '%pala%'
    AND lower(pt.name) NOT LIKE '%tort%'
    AND lower(pc.name) NOT LIKE '%tort%'
    AND lower(tt.name) LIKE '%slan%'
    AND (
      (
        lower(pc.name) LIKE '%osnovn%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%classic%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%osnovn%'
        AND lower(pc.name) LIKE '%slan%'
      )
    )
)
INSERT INTO public.product_addon_slot (product_id, sort_order, label, max_select)
SELECT c.product_id, 0, 'Meso', 3
FROM classic_savory_pancake c
ON CONFLICT (product_id, sort_order) DO NOTHING;

WITH classic_savory_pancake AS (
  SELECT p.id AS product_id
  FROM public.product p
  INNER JOIN public.product_type pt ON pt.id = p.product_type_id
  INNER JOIN public.taste_type tt ON tt.id = p.taste_type_id
  INNER JOIN public.product_category pc ON pc.id = p.product_category_id
  WHERE lower(pt.name) LIKE '%pala%'
    AND lower(pt.name) NOT LIKE '%tort%'
    AND lower(pc.name) NOT LIKE '%tort%'
    AND lower(tt.name) LIKE '%slan%'
    AND (
      (
        lower(pc.name) LIKE '%osnovn%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%classic%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%osnovn%'
        AND lower(pc.name) LIKE '%slan%'
      )
    )
)
INSERT INTO public.product_addon_slot (product_id, sort_order, label, max_select)
SELECT c.product_id, 1, 'Namaz', 3
FROM classic_savory_pancake c
ON CONFLICT (product_id, sort_order) DO NOTHING;

-- Za osnovne slane palačinke: redovi u product_addon_slot_addon (slot_id + addon_id).
-- Meso = slot sort_order 0, Namaz = 1. Dodatak mora imati addon_kind pancake_savory_meat / pancake_savory_spread.
WITH classic_savory_pancake AS (
  SELECT p.id AS product_id
  FROM public.product p
  INNER JOIN public.product_type pt ON pt.id = p.product_type_id
  INNER JOIN public.taste_type tt ON tt.id = p.taste_type_id
  INNER JOIN public.product_category pc ON pc.id = p.product_category_id
  WHERE lower(pt.name) LIKE '%pala%'
    AND lower(pt.name) NOT LIKE '%tort%'
    AND lower(pc.name) NOT LIKE '%tort%'
    AND lower(tt.name) LIKE '%slan%'
    AND (
      (
        lower(pc.name) LIKE '%osnovn%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%classic%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%osnovn%'
        AND lower(pc.name) LIKE '%slan%'
      )
    )
)
INSERT INTO public.product_addon_slot_addon (slot_id, addon_id)
SELECT pas.id, a.id
FROM public.product_addon_slot pas
INNER JOIN classic_savory_pancake c ON c.product_id = pas.product_id
CROSS JOIN public.addon a
WHERE pas.sort_order = 0
  AND a.addon_kind = 'pancake_savory_meat'
  AND a.is_active = true
ON CONFLICT (slot_id, addon_id) DO NOTHING;

WITH classic_savory_pancake AS (
  SELECT p.id AS product_id
  FROM public.product p
  INNER JOIN public.product_type pt ON pt.id = p.product_type_id
  INNER JOIN public.taste_type tt ON tt.id = p.taste_type_id
  INNER JOIN public.product_category pc ON pc.id = p.product_category_id
  WHERE lower(pt.name) LIKE '%pala%'
    AND lower(pt.name) NOT LIKE '%tort%'
    AND lower(pc.name) NOT LIKE '%tort%'
    AND lower(tt.name) LIKE '%slan%'
    AND (
      (
        lower(pc.name) LIKE '%osnovn%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%classic%'
        AND (
          lower(pc.name) LIKE '%palač%'
          OR lower(pc.name) LIKE '%palacin%'
          OR lower(pc.name) LIKE '%palačin%'
        )
      )
      OR (
        lower(pc.name) LIKE '%osnovn%'
        AND lower(pc.name) LIKE '%slan%'
      )
    )
)
INSERT INTO public.product_addon_slot_addon (slot_id, addon_id)
SELECT pas.id, a.id
FROM public.product_addon_slot pas
INNER JOIN classic_savory_pancake c ON c.product_id = pas.product_id
CROSS JOIN public.addon a
WHERE pas.sort_order = 1
  AND a.addon_kind = 'pancake_savory_spread'
  AND a.is_active = true
ON CONFLICT (slot_id, addon_id) DO NOTHING;
