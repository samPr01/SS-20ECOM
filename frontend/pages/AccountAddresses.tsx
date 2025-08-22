import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, MapPin } from "lucide-react";

export default function AccountAddresses() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/account">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">My Addresses</h1>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No addresses yet</p>
              <p className="text-sm">Add your first delivery address to get started</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
