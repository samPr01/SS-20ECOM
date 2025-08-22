import { useState, useEffect } from 'react';
import { Product } from '@/data/allProducts';
import { useAuthApi } from './useAuthApi';

// Backend Product interface (matches the backend schema)
interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Convert backend product to frontend product format
const convertBackendProduct = (backendProduct: BackendProduct): Product => ({
  id: parseInt(backendProduct._id.slice(-6), 16), // Convert ObjectId to number
  name: backendProduct.name,
  description: backendProduct.description,
  image: backendProduct.image,
  price: backendProduct.price,
  category: backendProduct.category,
  rating: 4.5, // Default rating
  discount: 0, // Default discount
  originalPrice: backendProduct.price,
  reviews: Math.floor(Math.random() * 5000) + 100, // Random reviews for demo
});

// API response interface
interface ProductsResponse {
  products: BackendProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useAuthApi();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (category) {
          params.append('category', category);
        }
        params.append('limit', '100'); // Get more products

        const data: ProductsResponse = await api.get(`/products?${params}`);
        const convertedProducts = data.products.map(convertBackendProduct);
        setProducts(convertedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, api]);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useAuthApi();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await api.get(`/products/${id}`);
        const convertedProduct = convertBackendProduct(data.product);
        setProduct(convertedProduct);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, api]);

  return { product, loading, error };
}

export function useProductsWithPagination(
  category?: string, 
  page: number = 1, 
  limit: number = 20
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: page,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const api = useAuthApi();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (category) {
          params.append('category', category);
        }
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const data: ProductsResponse = await api.get(`/products?${params}`);
        const convertedProducts = data.products.map(convertBackendProduct);
        
        setProducts(convertedProducts);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalProducts: data.pagination.totalProducts,
          hasNextPage: data.pagination.hasNextPage,
          hasPrevPage: data.pagination.hasPrevPage,
        });
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, limit, api]);

  const setPage = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return { 
    products, 
    loading, 
    error, 
    pagination,
    setPage
  };
}

// Hook for searching products
export function useProductSearch(searchTerm: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useAuthApi();

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('search', searchTerm);
        params.append('limit', '50');

        const data: ProductsResponse = await api.get(`/products?${params}`);
        const convertedProducts = data.products.map(convertBackendProduct);
        setProducts(convertedProducts);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, api]);

  return { products, loading, error };
}
