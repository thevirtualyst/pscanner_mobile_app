export type Branch = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type Store = {
  name: string;
  slug: string;
  logo_url: string | null;
  branches: Branch[];
};

export type Product = {
  name: string;
  brand: string | null;
  category: string | null;
  barcode: string;
  image_url: string | null;
  images: { url: string }[];
  mrp: number;
  selling_price: number;
  offer_price: number | null;
  availability: 'AVAILABLE' | 'LIMITED' | 'OUT_OF_STOCK';
  sku: string | null;
  weight_volume: string | null;
  ingredients: string | null;
  allergens: string | null;
  nutrition_json: string | null;
  serving_size: string | null;
  usage_instructions: string | null;
  storage_instructions: string | null;
  shelf_life: string | null;
  disclaimer: string | null;
};

export type ScanResult = {
  success: true;
  product: Product;
  branch: string;
  store: string;
};

export type RootStackParamList = {
  StoreList: undefined;
  BranchList: { store: Store };
  Scanner: { branchId: string; branchName: string; storeName: string };
  ProductDetail: { result: ScanResult };
};
