import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, ArrowRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";

// Mock data for categories
const categories = [
  {
    id: 1,
    name: "Categories",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
    icon: "🏷️"
  },
  {
    id: 2,
    name: "Kurti & Dresses",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop",
    icon: "👗"
  },
  {
    id: 3,
    name: "Kids & Toys",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    icon: "🧸"
  },
  {
    id: 4,
    name: "Westernwear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
    icon: "👔"
  },
  {
    id: 5,
    name: "Home",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
    icon: "🏠"
  },
];

// Mock data for trending products
const trendingProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 2999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: "Cotton Casual T-Shirt",
    price: 599,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 89
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 8999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 245
  },
  {
    id: 4,
    name: "Ceramic Coffee Mug Set",
    price: 1299,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 67
  },
  {
    id: 5,
    name: "Premium Leather Wallet",
    price: 1999,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 156
  },
  {
    id: 6,
    name: "Organic Face Cream",
    price: 899,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 203
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      
      <main>
        {/* Mobile Categories - Circular icons like Meesho */}
        <section className="py-4 bg-white md:hidden">
          <div className="px-4">
            <div className="flex justify-between items-center">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-700 text-center leading-tight">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Shop the Best Deals on SamaySagar
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Discover millions of products at unbeatable prices. Quality guaranteed, satisfaction delivered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-purple-600">
                  Explore Categories
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Featured Categories */}
        <section className="py-16 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find exactly what you're looking for in our carefully curated categories
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-600">Trending styles</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products For You Section - Mobile First */}
        <section className="bg-white">
          <div className="px-4 py-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Products For You
            </h2>

            {/* Filter/Sort Bar - Mobile */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm">Sort</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                <span className="text-sm">Category</span>
                <span className="text-gray-400">⌄</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                <span className="text-sm">Gender</span>
                <span className="text-gray-400">⌄</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">Filters</span>
              </button>
            </div>

            {/* Desktop Filter Bar */}
            <div className="hidden md:flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <p className="text-lg text-gray-600">
                  Popular picks loved by our customers
                </p>
              </div>
              <Link to="/products">
                <Button variant="outline" className="mt-4 md:mt-0">
                  View All Products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {trendingProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
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
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm md:text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full" size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span className="hidden md:inline">Add to Cart</span>
                      <span className="md:hidden">Add</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action - Desktop Only */}
        <section className="py-16 bg-gray-900 text-white hidden md:block">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join millions of satisfied customers and discover amazing deals every day.
            </p>
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Start Shopping Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer - Desktop Only */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation />
    </div>
  );
}
