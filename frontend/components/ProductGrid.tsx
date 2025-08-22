import { useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/allProducts";
import { useProductsWithPagination } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart.tsx";
import { useToast } from "@/hooks/use-toast";

interface ProductGridProps {
  category?: string;
  title?: string;
  showPagination?: boolean;
  productsPerPage?: number;
}

// Memoized ProductCard component for better performance
const ProductCard = memo(({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
    <CardContent className="p-0">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{product.discount}%
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({product.reviews || 0})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-purple-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
));

ProductCard.displayName = 'ProductCard';

const ProductGrid = memo(function ProductGrid({ 
  category, 
  title = "Products", 
  showPagination = true, 
  productsPerPage = 20 
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error, pagination } = useProductsWithPagination(
    category, 
    currentPage, 
    productsPerPage
  );
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="px-4 py-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        
        {pagination.totalProducts > 0 && (
          <p className="text-gray-600 mb-6">
            Showing {((pagination.currentPage - 1) * productsPerPage) + 1} to {Math.min(pagination.currentPage * productsPerPage, pagination.totalProducts)} of {pagination.totalProducts} products
          </p>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-3 md:p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-gray-900 mb-2 hover:text-purple-600 transition-colors line-clamp-2 text-sm md:text-base">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center mb-2 md:hidden">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating} ({product.reviews || 0})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm md:text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs md:text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                        toast({
                          title: "Added to cart",
                          description: `${product.name} has been added to your cart.`,
                        });
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span className="hidden md:inline">Add to Cart</span>
                      <span className="md:hidden">Add</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {showPagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default ProductGrid;
