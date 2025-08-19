import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Package,
  CheckCircle,
  Truck,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart.tsx";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders.tsx";
import PaymentGateway from "@/components/PaymentGateway";

interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to proceed with checkout.</p>
          <div className="space-y-3">
            <Button onClick={() => navigate("/signin")} className="w-full">
              Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate("/cart")} className="w-full">
              Back to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });
  const [orderId, setOrderId] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);

  // Calculate order summary
  const subtotal = getSubtotal();
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including city, state, and ZIP code.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number starting with 6-9.",
        variant: "destructive",
      });
      return;
    }

    // Validate ZIP code (6 digits)
    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(shippingAddress.zipCode)) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 6-digit ZIP code.",
        variant: "destructive",
      });
      return;
    }

    // Validate email if provided
    if (shippingAddress.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(shippingAddress.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
    }

    // Generate order ID
    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);
    setStep("payment");
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentData(paymentData);
    setStep("confirmation");
    
    // Clear cart after successful payment
    clearCart();
    
    // Save order to local storage
    const orderItems = state.items.map(item => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    addOrder({
      userId: user?.id || "guest",
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentData.method,
      paymentStatus: paymentData.status === "success" ? "completed" : "pending",
      orderStatus: "pending",
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      discountCode: undefined,
      discountAmount: 0
    });
    
    toast({
      title: "Payment Successful!",
      description: "Your order has been placed successfully.",
    });
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment failed:", error);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (state.items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
          <Button onClick={() => navigate("/cart")}>
            Go to Cart
          </Button>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">Order ID</div>
                <div className="font-mono font-semibold text-lg">{orderId}</div>
              </div>

              {paymentData && (
                <div className="space-y-3 text-left mb-6">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">{paymentData?.method?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-medium">{formatCurrency(paymentData?.amount || total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={paymentData?.status === "success" ? "default" : "secondary"}>
                      {paymentData?.status === "success" ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={() => navigate("/")} className="w-full">
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={() => navigate("/orders")} className="w-full">
                  View Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/cart")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === "shipping" ? "text-blue-600" : "text-green-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>
                {step === "payment" ? "✓" : "1"}
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </div>
            <div className={`w-8 h-1 rounded ${step === "payment" ? "bg-green-600" : "bg-gray-200"}`}></div>
            <div className={`flex items-center space-x-2 ${step === "payment" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                                             <div>
                         <Label htmlFor="phone">Phone Number *</Label>
                         <Input
                           id="phone"
                           type="tel"
                           value={shippingAddress.phone}
                           onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                           placeholder="Enter 10-digit mobile number"
                           maxLength={10}
                           pattern="[6-9][0-9]{9}"
                           required
                         />
                         <p className="text-xs text-gray-500 mt-1">Must be 10 digits starting with 6-9</p>
                       </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                                                 <select
                           id="state"
                           value={shippingAddress.state}
                           onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           required
                         >
                           <option value="">Select State</option>
                           <option value="Andhra Pradesh">Andhra Pradesh</option>
                           <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                           <option value="Assam">Assam</option>
                           <option value="Bihar">Bihar</option>
                           <option value="Chhattisgarh">Chhattisgarh</option>
                           <option value="Goa">Goa</option>
                           <option value="Gujarat">Gujarat</option>
                           <option value="Haryana">Haryana</option>
                           <option value="Himachal Pradesh">Himachal Pradesh</option>
                           <option value="Jharkhand">Jharkhand</option>
                           <option value="Karnataka">Karnataka</option>
                           <option value="Kerala">Kerala</option>
                           <option value="Madhya Pradesh">Madhya Pradesh</option>
                           <option value="Maharashtra">Maharashtra</option>
                           <option value="Manipur">Manipur</option>
                           <option value="Meghalaya">Meghalaya</option>
                           <option value="Mizoram">Mizoram</option>
                           <option value="Nagaland">Nagaland</option>
                           <option value="Odisha">Odisha</option>
                           <option value="Punjab">Punjab</option>
                           <option value="Rajasthan">Rajasthan</option>
                           <option value="Sikkim">Sikkim</option>
                           <option value="Tamil Nadu">Tamil Nadu</option>
                           <option value="Telangana">Telangana</option>
                           <option value="Tripura">Tripura</option>
                           <option value="Uttar Pradesh">Uttar Pradesh</option>
                           <option value="Uttarakhand">Uttarakhand</option>
                           <option value="West Bengal">West Bengal</option>
                           <option value="Delhi">Delhi</option>
                           <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                           <option value="Ladakh">Ladakh</option>
                           <option value="Chandigarh">Chandigarh</option>
                           <option value="Puducherry">Puducherry</option>
                         </select>
                      </div>
                                             <div>
                         <Label htmlFor="zipCode">ZIP Code *</Label>
                         <Input
                           id="zipCode"
                           value={shippingAddress.zipCode}
                           onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                           placeholder="Enter 6-digit PIN"
                           maxLength={6}
                           pattern="[0-9]{6}"
                           required
                         />
                         <p className="text-xs text-gray-500 mt-1">Must be exactly 6 digits</p>
                       </div>
                    </div>

                                         <div className="space-y-4">
                       <Button type="submit" className="w-full">
                         Continue to Payment
                       </Button>
                       
                       <div className="text-center">
                         <p className="text-sm text-gray-600">
                           By continuing, you agree to our{" "}
                           <a href="#" className="text-purple-600 hover:underline">
                             Terms of Service
                           </a>{" "}
                           and{" "}
                           <a href="#" className="text-purple-600 hover:underline">
                             Privacy Policy
                           </a>
                         </p>
                       </div>
                     </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <PaymentGateway
                amount={total}
                currency="INR"
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                orderId={orderId}
                customerEmail={shippingAddress.email}
                customerName={shippingAddress.fullName}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Cart Items */}
                <div className="space-y-3 mb-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.product.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium text-sm">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({state.items.length} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (18% GST)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  
                  {/* Shipping Info */}
                  {shipping === 0 ? (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      🎉 Free shipping on orders above ₹1000
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      Add ₹{1000 - subtotal} more for free shipping
                    </div>
                  )}
                </div>

                {/* Shipping Info */}
                {step === "payment" && (
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-700 mb-2">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">Shipping to:</span>
                    </div>
                    <div className="text-sm text-blue-600">
                      <div>{shippingAddress.fullName}</div>
                      <div>{shippingAddress.address}</div>
                      <div>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
