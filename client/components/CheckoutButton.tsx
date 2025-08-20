import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { useAuth } from '../hooks/useAuth';

interface CheckoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ className = '', children }: CheckoutButtonProps) {
  const { getSelectedItems, getTotal } = useCart();
  const { createRazorpayOrder, verifyPayment, openRazorpayCheckout } = useCheckout();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Please login to checkout');
      return;
    }

    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      alert('Please select items to checkout');
      return;
    }

    setIsLoading(true);

    try {
      const total = getTotal();
      const result = await createRazorpayOrder(total, 'INR');
      
      if (result.success && result.order) {
        openRazorpayCheckout(
          result.order,
          async (paymentData) => {
            // Payment successful, verify it
            const verificationResult = await verifyPayment({
              razorpay_order_id: paymentData.razorpay_order_id,
              razorpay_payment_id: paymentData.razorpay_payment_id,
              razorpay_signature: paymentData.razorpay_signature,
            });

            if (verificationResult.success) {
              alert('Payment successful!');
              // You can redirect to success page or update order status here
            } else {
              alert('Payment verification failed.');
            }
            setIsLoading(false);
          },
          (error) => {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
            setIsLoading(false);
          }
        );
      } else {
        alert(result.error || 'Checkout failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || !isAuthenticated}
      className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        children || `Checkout - ₹${getTotal().toFixed(2)}`
      )}
    </button>
  );
}
