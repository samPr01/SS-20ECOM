import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Heart,
  MapPin,
  User,
  LogOut,
  Settings,
  Package,
  MapPin as MapPinIcon,
  CreditCard,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart.tsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const { getItemCount } = useCart();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const profileOptions = [
    {
      icon: User,
      title: "My Profile",
      description: "View and edit your profile",
      path: "/account",
    },
    {
      icon: Package,
      title: "My Orders",
      description: "Track your orders",
      path: "/account/orders",
    },
    {
      icon: MapPinIcon,
      title: "My Addresses",
      description: "Manage delivery addresses",
      path: "/account/addresses",
    },
    {
      icon: CreditCard,
      title: "Payment Methods",
      description: "Manage payment options",
      path: "/account/payments",
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Update your preferences",
      path: "/account/settings",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help with your orders",
      path: "/account/support",
    },
  ];

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
              <span className="text-xl font-bold text-purple-600">
                SS Stores
              </span>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center space-x-3">
              <Link to="/wishlist" className="p-2">
                <Heart className="w-6 h-6 text-red-500" />
              </Link>
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
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
              
              {/* Mobile Profile Section */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/account"
                      className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/account/addresses"
                      className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Addresses
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="block bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">
                SS Stores
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Try Sarees, Kurti or Search by Product Code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Right Side Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/supplier"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Become a Supplier
              </Link>
              <Link
                to="/investor"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Investor Relations
              </Link>

              <div className="flex items-center space-x-4 ml-6">
                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                    <span className="text-xs flex items-center">
                      {isAuthenticated ? user?.name?.split(' ')[0] || 'Profile' : 'Profile'}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4">
                        {isAuthenticated ? (
                          <>
                            {/* User Info */}
                            <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 mb-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user?.name}</p>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                              </div>
                            </div>

                            {/* Profile Options */}
                            <div className="space-y-1">
                              {profileOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <Link
                                    key={option.path}
                                    to={option.path}
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <Icon className="w-4 h-4 text-gray-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{option.title}</p>
                                      <p className="text-xs text-gray-600">{option.description}</p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>

                            {/* Logout Button */}
                            <div className="pt-3 border-t border-gray-200">
                              <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                              >
                                <LogOut className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">Logout</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">Sign in to access your account</p>
                            <Link
                              to="/signin"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Sign In
                </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/cart"
                  className="flex flex-col items-center text-gray-700 hover:text-purple-600 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-xs">Cart</span>
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Category Navigation */}
      <nav className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-8">
              <Link
                to="/women-ethnic"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Women Ethnic
              </Link>
              <Link
                to="/women-western"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Women Western
              </Link>
              <Link
                to="/men"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Men
              </Link>
              <Link
                to="/kids"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Kids
              </Link>
              <Link
                to="/home-kitchen"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Home & Kitchen
              </Link>
              <Link
                to="/beauty-health"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Beauty & Health
              </Link>
              <Link
                to="/jewellery"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Jewellery & Accessories
              </Link>
              <Link
                to="/bags"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Bags & Footwear
              </Link>
              <Link
                to="/electronics"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Electronics
              </Link>
              <Link
                to="/sports"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Sports & Fitness
              </Link>
              <Link
                to="/automotive"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Car & Motorbike
              </Link>
              <Link
                to="/office"
                className="text-gray-700 hover:text-purple-600 text-sm"
              >
                Office
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
