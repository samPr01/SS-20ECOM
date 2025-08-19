import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  ArrowRight,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";
import { homePageProducts } from "@/data/allProducts";

// Mobile categories (circular) - matching all desktop categories
const mobileCategories = [
  {
    id: 1,
    name: "Women Ethnic",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop",
    url: "/women-ethnic",
  },
  {
    id: 2,
    name: "Women Western",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
    url: "/women-western",
  },
  {
    id: 3,
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    url: "/men",
  },
  {
    id: 4,
    name: "Kids",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    url: "/kids",
  },
  {
    id: 5,
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
    url: "/home-kitchen",
  },
  {
    id: 6,
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    url: "/beauty-health",
  },
  {
    id: 7,
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop",
    url: "/electronics",
  },
  {
    id: 8,
    name: "Jewellery",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop",
    url: "/jewellery",
  },
  {
    id: 9,
    name: "Bags & Footwear",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
    url: "/bags",
  },
  {
    id: 10,
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    url: "/sports",
  },
];

// Desktop category tiles (horizontal layout like Meesho) - matching all category pages
const desktopCategories = [
  {
    id: 1,
    name: "Women Ethnic",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=150&h=150&fit=crop",
    url: "/women-ethnic",
  },
  {
    id: 2,
    name: "Women Western",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop",
    url: "/women-western",
  },
  {
    id: 3,
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    url: "/men",
  },
  {
    id: 4,
    name: "Kids",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop",
    url: "/kids",
  },
  {
    id: 5,
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
    url: "/home-kitchen",
  },
  {
    id: 6,
    name: "Beauty & Health",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop",
    url: "/beauty-health",
  },
  {
    id: 7,
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&h=150&fit=crop",
    url: "/electronics",
  },
  {
    id: 8,
    name: "Jewellery",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
    url: "/jewellery",
  },
];

// Use imported products for home page
const trendingProducts = homePageProducts;

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />

      <main>
        {/* Mobile Categories - Circular icons like Meesho */}
        <section className="py-4 bg-white md:hidden">
          <div className="px-4">
            <div className="grid grid-cols-5 gap-4">
              {mobileCategories.map((category) => (
                <Link
                  key={category.id}
                  to={category.url}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200">
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

        {/* Desktop Category Tiles - Horizontal Layout like Meesho */}
        <section className="py-6 bg-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-8 gap-4">
              {desktopCategories.map((category) => (
                <Link
                  key={category.id}
                  to={category.url}
                  className="flex flex-col items-center group"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden mb-2 group-hover:shadow-lg transition-shadow">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-sm text-gray-700 text-center font-medium">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop Large Banner Section - Like Meesho */}
        <section className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-r from-amber-50 to-rose-50">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=1200&h=400&fit=crop"
                  alt="Traditional Fashion Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex items-center">
                <div className="w-1/2 p-12">
                  <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    Traditional Elegance
                  </h2>
                  <p className="text-xl text-white mb-6 drop-shadow">
                    Discover the finest collection of ethnic wear for every
                    occasion
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    Shop Now
                  </Button>
                </div>

                {/* Right Side Category Cards */}
                <div className="w-1/2 flex justify-end p-12">
                  <div className="space-y-4">
                    <div className="bg-white bg-opacity-90 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop"
                            alt="Lehengas"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-gray-800">
                          Lehengas
                        </span>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-90 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                            alt="Menwear"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-gray-800">
                          Menwear
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products For You Section - Mobile First */}
        <section className="bg-white mt-6 md:mt-8">
          <div className="px-4 py-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
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
            <div className="hidden md:flex flex-col md:flex-row justify-between items-center mb-8">
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
              {homePageProducts.map((product) => (
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
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100,
                      )}
                      % OFF
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
