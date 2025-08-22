import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import PaymentGateway from "@/components/PaymentGateway";

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getSelectedItems, getSubtotal, getTotal } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });
  
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');

  const selectedItems = getSelectedItems();
  const subtotal = getSubtotal();
  const total = getTotal();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with checkout.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    // Redirect if no items selected
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add items to your cart to proceed.",
        variant: "destructive",
      });
      navigate("/cart");
      return;
    }
  }, [user, selectedItems, navigate, toast]);

  // Validate shipping address
  useEffect(() => {
    const isValid = Object.values(shippingAddress).every(value => value.trim() !== '');
    setIsAddressValid(isValid);
  }, [shippingAddress]);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSubmit = () => {
    if (!isAddressValid) {
      toast({
        title: "Invalid Address",
        description: "Please fill in all address fields.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    toast({
      title: "Payment Successful!",
      description: "Your order has been placed successfully.",
    });
    // Navigate to success page or orders page
    navigate("/orders");
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  // Prepare cart items for PaymentGateway
  const cartItemsForPayment = selectedItems.map(item => ({
    id: item.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.image,
    description: item.product.description
  }));

  if (!user || selectedItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/cart")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">Complete your purchase</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'address' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'address' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Shipping Address</span>
            </div>
            <div className="w-8 h-1 bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'address' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      placeholder="123 Main St"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      placeholder="United States"
                    />
                  </div>

                  <Button
                    onClick={handleAddressSubmit}
                    disabled={!isAddressValid}
                    className="w-full"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <PaymentGateway
                cartItems={cartItemsForPayment}
                currency="USD"
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                customerEmail={user.email}
                customerName={user.name}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Selected Items */}
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ${item.product.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({selectedItems.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Shipping Address Preview */}
                  {currentStep === 'payment' && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{shippingAddress.fullName}</p>
                          <p>{shippingAddress.street}</p>
                          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                          <p>{shippingAddress.country}</p>
                          <p>{shippingAddress.phone}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
