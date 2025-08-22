import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, MapPin, Eye, Edit, Trash2, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequireAdminAuth } from "@/hooks/useAdminAuth";

interface Address {
  id: string;
  userId: string;
  userName: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
}

export default function AdminAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  useRequireAdminAuth();

  // Mock addresses data
  const mockAddresses: Address[] = [
    {
      id: "addr_1",
      userId: "user_1",
      userName: "John Doe",
      label: "Home",
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400001",
      isDefault: true,
      createdAt: "2024-01-10T08:30:00Z"
    },
    {
      id: "addr_2",
      userId: "user_1",
      userName: "John Doe",
      label: "Office",
      line1: "456 Business Park",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400002",
      isDefault: false,
      createdAt: "2024-01-12T14:20:00Z"
    },
    {
      id: "addr_3",
      userId: "user_2",
      userName: "Jane Smith",
      label: "Home",
      line1: "789 Residential Lane",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110001",
      isDefault: true,
      createdAt: "2024-01-08T11:15:00Z"
    },
    {
      id: "addr_4",
      userId: "user_3",
      userName: "Mike Johnson",
      label: "Home",
      line1: "321 Garden Street",
      line2: "Floor 2",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zipCode: "560001",
      isDefault: true,
      createdAt: "2024-01-05T16:45:00Z"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAddresses(mockAddresses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAddresses = addresses.filter(address =>
    address.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      // Simulate API call
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast({
        title: "Success",
        description: "Address deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address.",
        variant: "destructive",
      });
    }
  };

  const totalAddresses = addresses.length;
  const uniqueUsers = new Set(addresses.map(addr => addr.userId)).size;
  const defaultAddresses = addresses.filter(addr => addr.isDefault).length;
  const recentAddresses = addresses.filter(addr => 
    new Date(addr.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MapPin className="w-8 h-8 mr-3 text-purple-600" />
                Address Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all user addresses and delivery locations
              </p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Addresses</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAddresses}</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Default Addresses</p>
                  <p className="text-2xl font-bold text-green-600">{defaultAddresses}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Added This Week</p>
                  <p className="text-2xl font-bold text-orange-600">{recentAddresses}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">📅</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search addresses by user, city, state, or label..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Addresses Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Addresses ({filteredAddresses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading addresses...</p>
              </div>
            ) : filteredAddresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No addresses found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAddresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>
                        <div className="font-medium">{address.userName}</div>
                        <div className="text-sm text-gray-500">ID: {address.userId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{address.label}</span>
                          {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{address.line1}</div>
                          {address.line2 && <div className="text-gray-500">{address.line2}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{address.city}, {address.state}</div>
                          <div className="text-gray-500">{address.country} {address.zipCode}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={address.isDefault ? "default" : "secondary"}>
                          {address.isDefault ? "Default" : "Additional"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(address.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
