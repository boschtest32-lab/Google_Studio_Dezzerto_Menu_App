export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  image: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subCategories?: SubCategory[];
  products?: Product[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  items: CartItem[];
  customerMobile: string;
  total: number;
}

export type ViewState = 'HOME' | 'CATEGORY' | 'SUBCATEGORY';

export interface Breadcrumb {
  id: string;
  name: string;
  type: ViewState;
}