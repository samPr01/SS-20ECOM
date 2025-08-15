import { Search, ShoppingCart, Menu, X, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-purple-600">SamaySagar</span>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center space-x-3">
              <Link to="/wishlist" className="p-2">
                <Heart className="w-6 h-6 text-red-500" />
              </Link>
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="Search for Sarees, Kurtis, Cosmetics, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Delivery Location */}
          <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Add delivery location to check extra discount</span>
            <span className="ml-auto text-lg">⟩⟩⟩</span>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="bg-white border-t border-gray-200 absolute w-full">
            <div className="px-4 py-3 space-y-3">
              <Link
                to="/products"
                className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/deals"
                className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SamaySagar</span>
            </Link>

            {/* Search Bar */}
            <div className="flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link to="/products" className="text-gray-700 hover:text-purple-600 font-medium">
                Products
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-purple-600 font-medium">
                Categories
              </Link>
              <Link to="/deals" className="text-gray-700 hover:text-purple-600 font-medium">
                Deals
              </Link>
            </nav>

            {/* Cart Icon */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-purple-600">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
