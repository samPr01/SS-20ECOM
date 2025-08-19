import { useState, useEffect } from 'react';
import { Product, loadProducts, getProductsByCategory, getProductsWithPagination, getProductById } from '@/data/allProducts';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allProducts = await loadProducts();
        let filteredProducts = allProducts;
        
        if (category) {
          filteredProducts = getProductsByCategory(allProducts, category);
        }
        
        setProducts(filteredProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
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
        const foundProduct = await getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
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
    totalProducts: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
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
          totalProducts: paginationResult.totalProducts
        });
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, limit]);

  return { 
    products, 
    loading, 
    error, 
    pagination,
    setPage: (newPage: number) => setPagination(prev => ({ ...prev, currentPage: newPage }))
  };
}
