export type Product = {
  id?: number;
  name: string;
  description?: string;
  product_group_id?: number;
  active?: number;
  location_id?: number;
  shopping_location_id?: number;
  qu_id_purchase?: number;
  qu_id_stock?: number;
  min_stock_amount?: number;
  parent_product_id?: number;
  calories?: number;
  picture_file_name?: string;
  userfields?: Record<string, any> | null;
};