import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  CheckCircle,
  X,
  Heart,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart.tsx";
import { useAuth } from "@/hooks/useAuth";

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    state,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    clearCart,
    applyDiscount,
    removeDiscount,
    getSelectedItems,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    getItemCount,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string, productName: string) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast({
        title: "Invalid code",
        description: "Please enter a discount code.",
        variant: "destructive",
      });
      return;
    }

    const success = applyDiscount(discountCode);
    if (success) {
      toast({
        title: "Discount applied!",
        description: `${state.discountPercentage}% discount has been applied.`,
      });
      setDiscountCode("");
      setShowDiscountInput(false);
    } else {
      toast({
        title: "Invalid code",
        description: "The discount code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    toast({
      title: "Discount removed",
      description: "Discount code has been removed.",
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to proceed to checkout.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with checkout.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    toast({
      title: "Proceeding to checkout",
      description: "Redirecting to checkout page...",
    });
    navigate("/checkout");
  };

  const selectedItems = getSelectedItems();
  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const total = getTotal();
  const itemCount = getItemCount();

  // Calculate shipping cost based on subtotal
  const shippingCost = subtotal > 1000 ? 0 : subtotal > 0 ? 100 : 0;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="space-x-4">
              <Link to="/products">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart Items ({selectedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      loading="lazy"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{item.product.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{item.product.reviews || 0} reviews</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-bold text-purple-600">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.product.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Discount Code */}
                <div className="space-y-2">
                  {state.discountCode ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {state.discountCode} applied
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveDiscount}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {!showDiscountInput ? (
                        <Button
                          variant="outline"
                          onClick={() => setShowDiscountInput(true)}
                          className="w-full"
                        >
                          Have a discount code?
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter code"
                              value={discountCode}
                              onChange={(e) => setDiscountCode(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={handleApplyDiscount}
                              disabled={!discountCode.trim()}
                            >
                              Apply
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDiscountInput(false)}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({selectedItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({state.discountPercentage}%)</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Additional Options */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Save for Later
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Truck className="w-4 h-4 mr-2" />
                    Calculate Shipping
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="text-xs text-gray-500 text-center">
                  <p>🔒 Secure checkout powered by SSL encryption</p>
                  <p>Your payment information is protected</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
