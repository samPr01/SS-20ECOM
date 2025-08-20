import { useState, useEffect } from 'react';
import { Product, loadProducts, getProductsByCategory, getProductsWithPagination, getProductById } from '@/data/allProducts';

// API base URL - adjust this to match your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API first
        const params = new URLSearchParams();
        if (category) {
          params.append('category', category);
        }
        params.append('limit', '100'); // Get more products

        const response = await fetch(`${API_BASE_URL}/products?${params}`);
        
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          const convertedProducts = data.products.map(convertBackendProduct);
          setProducts(convertedProducts);
        } else {
          throw new Error('API request failed');
        }
      } catch (err) {
        console.warn('API failed, falling back to local data:', err);
        
        // Fallback to local data
        try {
          const allProducts = await loadProducts();
          let filteredProducts = allProducts;
          
          if (category) {
            filteredProducts = getProductsByCategory(allProducts, category);
          }
          
          setProducts(filteredProducts);
        } catch (fallbackErr) {
          setError('Failed to load products');
          console.error('Error loading products:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API first
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          const convertedProduct = convertBackendProduct(data.product);
          setProduct(convertedProduct);
        } else if (response.status === 404) {
          throw new Error('Product not found');
        } else {
          throw new Error('API request failed');
        }
      } catch (err) {
        console.warn('API failed, falling back to local data:', err);
        
        // Fallback to local data
        try {
          const foundProduct = await getProductById(id);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Product not found');
          }
        } catch (fallbackErr) {
          setError('Failed to load product');
          console.error('Error loading product:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API first
        const params = new URLSearchParams();
        if (category) {
          params.append('category', category);
        }
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const response = await fetch(`${API_BASE_URL}/products?${params}`);
        
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          const convertedProducts = data.products.map(convertBackendProduct);
          
          setProducts(convertedProducts);
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalProducts: data.pagination.totalProducts,
            hasNextPage: data.pagination.hasNextPage,
            hasPrevPage: data.pagination.hasPrevPage,
          });
        } else {
          throw new Error('API request failed');
        }
      } catch (err) {
        console.warn('API failed, falling back to local data:', err);
        
        // Fallback to local data
        try {
          const allProducts = await loadProducts();
          let filteredProducts = allProducts;
          
          if (category) {
            filteredProducts = getProductsByCategory(allProducts, category);
          }
          
          const paginationResult = getProductsWithPagination(
            filteredProducts, 
            page, 
            limit
          );
          
          setProducts(paginationResult.products);
          setPagination({
            currentPage: paginationResult.currentPage,
            totalPages: paginationResult.totalPages,
            totalProducts: paginationResult.totalProducts,
            hasNextPage: page < paginationResult.totalPages,
            hasPrevPage: page > 1,
          });
        } catch (fallbackErr) {
          setError('Failed to load products');
          console.error('Error loading products:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, limit]);

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

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API first
        const params = new URLSearchParams();
        params.append('search', searchTerm);
        params.append('limit', '50');

        const response = await fetch(`${API_BASE_URL}/products?${params}`);
        
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          const convertedProducts = data.products.map(convertBackendProduct);
          setProducts(convertedProducts);
        } else {
          throw new Error('API request failed');
        }
      } catch (err) {
        console.warn('API failed, falling back to local data:', err);
        
        // Fallback to local data with simple search
        try {
          const allProducts = await loadProducts();
          const searchLower = searchTerm.toLowerCase();
          const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
          );
          setProducts(filteredProducts);
        } catch (fallbackErr) {
          setError('Failed to search products');
          console.error('Error searching products:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return { products, loading, error };
}
