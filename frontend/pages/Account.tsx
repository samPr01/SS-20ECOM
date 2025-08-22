import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Plus,
  ArrowRight,
  Package,
  CreditCard,
  Heart,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth, useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders.tsx";

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Account() {
  const { user, loading } = useRequireAuth();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { getUserOrders } = useOrders();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  const userOrders = getUserOrders(user.id);
  const orderCount = userOrders.length;

  const accountOptions = [
    {
      icon: MapPin,
      title: "My Addresses",
      description: "Manage your delivery addresses",
      path: "/account/addresses",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: ShoppingBag,
      title: "My Orders",
      description: "View your order history",
      path: "/orders",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Heart,
      title: "Wishlist",
      description: "Your saved items",
      path: "/account/wishlist",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: CreditCard,
      title: "Payment Methods",
      description: "Manage your payment options",
      path: "/account/payments",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Update your profile information",
      path: "/account/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help with your orders",
      path: "/account/support",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">My Account</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-xl font-semibold">{orderCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saved Addresses</p>
                  <p className="text-xl font-semibold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wishlist Items</p>
                  <p className="text-xl font-semibold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.path} to={option.path}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${option.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Orders Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/account/orders">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No orders yet</p>
                <p className="text-sm">Start shopping to see your orders here</p>
                <Button className="mt-4" asChild>
                  <Link to="/products">Start Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
