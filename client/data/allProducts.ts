// Product interface
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  discount: number;
  originalPrice?: number;
  reviews?: number;
}

// Function to load products from JSON file
export async function loadProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/products.json');
    const products: Product[] = await response.json();
    
    // Calculate original price and add reviews for compatibility
    return products.map(product => ({
      ...product,
      originalPrice: product.discount > 0 ? product.price / (1 - product.discount / 100) : product.price,
      reviews: Math.floor(Math.random() * 5000) + 100 // Random reviews for demo
    }));
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Function to get products by category
export function getProductsByCategory(products: Product[], category: string): Product[] {
  return products.filter(product => product.category === category);
}

// Function to get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await loadProducts();
    const product = products.find(p => p.id.toString() === id);
    return product || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
}

// Function to get featured products for homepage
export function getHomePageProducts(products: Product[]): Product[] {
  // Return first 20 products for homepage
  return products.slice(0, 20);
}

// Function to get products with pagination
export function getProductsWithPagination(
  products: Product[], 
  page: number = 1, 
  limit: number = 20
): { products: Product[]; totalPages: number; currentPage: number; totalProducts: number } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / limit);
  
  return {
    products: paginatedProducts,
    totalPages,
    currentPage: page,
    totalProducts: products.length
  };
}

// Default export for backward compatibility
export const allProducts = {
  womenEthnic: [] as Product[],
  womenWestern: [] as Product[],
  men: [] as Product[],
  kids: [] as Product[],
  homeKitchen: [] as Product[],
  beauty: [] as Product[],
  electronics: [] as Product[],
  jewellery: [] as Product[],
  bags: [] as Product[],
  sports: [] as Product[],
  automotive: [] as Product[],
  office: [] as Product[]
};

export const homePageProducts: Product[] = [];

// Initialize products when the module loads
let isInitialized = false;

export async function initializeProducts() {
  if (isInitialized) return;
  
  const products = await loadProducts();
  
  // Categorize products
  allProducts.womenEthnic = getProductsByCategory(products, 'clothing');
  allProducts.womenWestern = getProductsByCategory(products, 'clothing');
  allProducts.men = getProductsByCategory(products, 'clothing');
  allProducts.kids = getProductsByCategory(products, 'clothing');
  allProducts.homeKitchen = getProductsByCategory(products, 'home');
  allProducts.beauty = getProductsByCategory(products, 'beauty');
  allProducts.electronics = getProductsByCategory(products, 'electronics');
  allProducts.jewellery = getProductsByCategory(products, 'accessories');
  allProducts.bags = getProductsByCategory(products, 'accessories');
  allProducts.sports = getProductsByCategory(products, 'fitness');
  allProducts.automotive = getProductsByCategory(products, 'electronics');
  allProducts.office = getProductsByCategory(products, 'electronics');
  
  // Set homepage products
  homePageProducts.length = 0;
  homePageProducts.push(...getHomePageProducts(products));
  
  isInitialized = true;
}

// Auto-initialize when module is imported
initializeProducts();
