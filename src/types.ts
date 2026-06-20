// Định hình cấu trúc một Sản phẩm từ DummyJSON API
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  thumbnail: string;
  images: string[];
}

// Định hình cấu trúc phản hồi khi lấy Danh sách Sản phẩm
export interface APIProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}