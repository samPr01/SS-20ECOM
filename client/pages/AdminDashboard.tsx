import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Package, 
  MapPin, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Plus,
  ArrowRight,
  User,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  BarChart3,
  Activity,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequireAdminAuth } from "@/hooks/useAdminAuth";
import { authFetch } from "@/utils/mockAuth";

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AddressData {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  userId: string;
}

interface OrderData {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  userId: string;
}

export default function AdminDashboard() {
  const { isAdminAuthenticated, adminLoading } = useRequireAdminAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalAddresses: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated]);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersResponse = await authFetch('/api/auth/users');
      const usersData = await usersResponse.json();
      
      // Fetch orders
      const ordersResponse = await fetch('/api/orders');
      const ordersData = await ordersResponse.json();
      
      // Fetch addresses
      const addressesResponse = await fetch('/api/addresses');
      const addressesData = await addressesResponse.json();

      // Calculate stats
      const totalRevenue = ordersData.orders?.reduce((sum: number, order: OrderData) => sum + order.total, 0) || 0;
      
      setStats({
        totalUsers: usersData.users?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalAddresses: addressesData.addresses?.length || 0,
        totalRevenue: totalRevenue,
      });

      // Set recent data
      setRecentUsers(usersData.users?.slice(0, 5) || []);
      setRecentOrders(ordersData.orders?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adminOptions = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage all user accounts",
      path: "/admin/users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Package,
      title: "Order Management",
      description: "View and manage all orders",
      path: "/admin/orders",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: MapPin,
      title: "Address Management",
      description: "Manage user addresses",
      path: "/admin/addresses",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View detailed analytics",
      path: "/admin/analytics",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Configure system settings",
      path: "/admin/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      icon: Activity,
      title: "Activity Logs",
      description: "View system activity",
      path: "/admin/activity-logs",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Exit Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Addresses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAddresses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.path} to={option.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${option.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Recent Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent users</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Recent Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
