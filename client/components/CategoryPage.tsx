import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  Grid3X3,
  List,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  brand?: string;
}

interface CategoryPageProps {
  title: string;
  description: string;
  bannerImage?: string;
  products: Product[];
  subcategories?: string[];
}

export default function CategoryPage({
  title,
  description,
  bannerImage,
  products,
  subcategories,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />

      <main>
        {/* Category Banner */}
        {bannerImage && (
          <section className="hidden md:block relative h-48 bg-gradient-to-r from-purple-100 to-pink-100">
            <div className="absolute inset-0">
              <img
                src={bannerImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
                <p className="text-xl text-white opacity-90">{description}</p>
              </div>
            </div>
          </section>
        )}

        {/* Mobile Header */}
        <section className="md:hidden bg-white py-4 border-b">
          <div className="px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
        </section>

        {/* Subcategories - Desktop */}
        {subcategories && (
          <section className="hidden md:block bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center space-x-6">
                <span className="text-sm font-medium text-gray-700">
                  Categories:
                </span>
                {subcategories.map((subcat, index) => (
                  <Link
                    key={index}
                    to={`/products?subcategory=${subcat.toLowerCase()}`}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {subcat}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        <section className="bg-white">
          <div className="px-4 py-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
            {/* Filter/Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900">
                  {products.length} Products
                </span>
              </div>

              {/* Mobile Filter Bar */}
              <div className="flex items-center space-x-3 md:hidden">
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm">Sort</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
              </div>

              {/* Desktop Filter Bar */}
              <div className="hidden md:flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Customer Rating</option>
                  <option>Newest First</option>
                </select>
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
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

                    {product.brand && (
                      <p className="text-xs text-gray-500 mb-1">
                        {product.brand}
                      </p>
                    )}

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs md:text-sm text-gray-600 ml-1">
                          {product.rating}{" "}
                          <span className="hidden md:inline">
                            ({product.reviews})
                          </span>
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
