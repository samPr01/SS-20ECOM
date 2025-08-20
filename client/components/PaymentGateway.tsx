import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Lock,
  Shield,
  Clock,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthApi } from "@/hooks/useAuthApi";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

interface PaymentGatewayProps {
  cartItems: CartItem[];
  currency?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  orderId?: string;
  customerEmail?: string;
  customerName?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  processingTime: string;
  fees: number;
  available: boolean;
}

export default function PaymentGateway({
  cartItems,
  currency = "USD",
  onPaymentSuccess,
  onPaymentError,
  orderId,
  customerEmail,
  customerName
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("stripe");
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const { toast } = useToast();
  const api = useAuthApi();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      description: "Pay securely with Stripe",
      icon: <CreditCard className="w-5 h-5" />,
      processingTime: "Instant",
      fees: 0,
      available: true
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: <Truck className="w-5 h-5" />,
      processingTime: "On Delivery",
      fees: 5,
      available: true
    }
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = selectedPaymentMethod ? subtotal + selectedPaymentMethod.fees : subtotal;

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      switch (selectedMethod) {
        case "stripe":
          await handleStripePayment();
          break;
        case "cod":
          await handleCODPayment();
          break;
        default:
          throw new Error("Invalid payment method");
      }
    } catch (error) {
      console.error("Payment error:", error);
      onPaymentError(error instanceof Error ? error.message : "Payment failed");
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setStripeLoading(true);
    
    try {
      // Prepare items for Stripe
      const stripeItems = cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description
      }));

      // Create checkout session using authenticated API
      const response = await api.post('/api/payment/create-checkout-session', {
        items: stripeItems,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/cart`,
      });

      const { sessionId, url } = response;

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Stripe payment error:', error);
      throw error;
    } finally {
      setStripeLoading(false);
    }
  };

  const handleCODPayment = async () => {
    // Simulate COD order confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentData = {
      method: "cod",
      orderId: orderId || `order_${Date.now()}`,
      amount: totalAmount,
      currency,
      status: "pending",
      timestamp: new Date().toISOString()
    };

    onPaymentSuccess(paymentData);
    toast({
      title: "Order Confirmed!",
      description: "Your order has been placed successfully. Pay on delivery.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Choose Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value={method.id} 
                    id={method.id}
                    disabled={!method.available}
                  />
                  <Label 
                    htmlFor={method.id} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          {method.icon}
                        </div>
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {method.processingTime}
                        </div>
                        {method.fees > 0 && (
                          <div className="text-sm text-gray-500">
                            +{formatCurrency(method.fees)} fees
                          </div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                  <div className="text-sm text-gray-500">{formatCurrency(item.price)} each</div>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {selectedPaymentMethod && selectedPaymentMethod.fees > 0 && (
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>{formatCurrency(selectedPaymentMethod.fees)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || loading || stripeLoading}
            className="w-full"
            size="lg"
          >
            {loading || stripeLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {stripeLoading ? "Redirecting to Stripe..." : "Processing Payment..."}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Pay {formatCurrency(totalAmount)}</span>
              </div>
            )}
          </Button>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>

          {/* Test Mode Notice */}
          <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-yellow-700">
              <AlertCircle className="w-4 h-4" />
              <span>Test Mode: Use test card 4242 4242 4242 4242</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
