export type ProductType = {
  id: number;
  name: string;
  is_active: boolean;
};

export type TasteType = {
  id: number;
  name: string;
  is_active: boolean;
};

export type ProductCategory = {
  id: number;
  name: string;
  is_active: boolean;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  product_type_id: number;
  taste_type_id: number | null;
  product_category_id: number;
  price: number;
  is_active: boolean;
  order_status: string;
};

export type Addon = {
  id: number;
  name: string;
  taste_type_id: number | null;
  price: number;
  is_active: boolean;
};

export type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string | null;
  delivery_type: string;
  note: string | null;
  total_price: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_per_unit: number;
  note: string | null;
};

export type OrderItemAddon = {
  id: number;
  order_item_id: number;
  addon_id: number;
  price: number;
};

