import { APIProductsResponse, Product } from './types';

const BASE_URL = 'https://dummyjson.com';

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Error HTTP! Status code: ${res.status}`);
  }
  
  return res.json() as Promise<T>;
}

//API get list of products
export async function getProducts(): Promise<APIProductsResponse> {
  return fetchJson<APIProductsResponse>(`${BASE_URL}/products`);
}

//API get product detail by ID
export async function getProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}