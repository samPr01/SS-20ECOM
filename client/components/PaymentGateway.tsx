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
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentGatewayProps {
  amount: number;
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
  amount,
  currency = "INR",
  onPaymentSuccess,
  onPaymentError,
  orderId,
  customerEmail,
  customerName
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: customerName || ""
  });
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      description: "Pay securely with your card",
      icon: <CreditCard className="w-5 h-5" />,
      processingTime: "Instant",
      fees: 0,
      available: true
    },
    {
      id: "razorpay",
      name: "Razorpay",
      description: "UPI, Net Banking, Wallets",
      icon: <Wallet className="w-5 h-5" />,
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
      fees: 50,
      available: true
    }
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const totalAmount = selectedPaymentMethod ? amount + selectedPaymentMethod.fees : amount;

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
        case "razorpay":
          await handleRazorpayPayment();
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
    // Simulate Stripe payment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentData = {
      method: "stripe",
      transactionId: `txn_${Date.now()}`,
      amount: totalAmount,
      currency,
      status: "success",
      timestamp: new Date().toISOString()
    };

    onPaymentSuccess(paymentData);
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully.",
    });
  };

  const handleRazorpayPayment = async () => {
    // Simulate Razorpay payment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const paymentData = {
      method: "razorpay",
      transactionId: `rzp_${Date.now()}`,
      amount: totalAmount,
      currency,
      status: "success",
      timestamp: new Date().toISOString()
    };

    onPaymentSuccess(paymentData);
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully.",
    });
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
    return new Intl.NumberFormat('en-IN', {
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

      {/* Card Details (for Stripe) */}
      {selectedMethod === "stripe" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Card Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Order Amount</span>
              <span>{formatCurrency(amount)}</span>
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

          <div className="mt-6">
            <Button
              onClick={handlePayment}
              disabled={!selectedMethod || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Pay {formatCurrency(totalAmount)}</span>
                </div>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>Secure payment powered by industry-standard encryption</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
