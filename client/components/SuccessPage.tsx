import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { useAuth } from '../hooks/useAuth';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getSelectedItems, getTotal, clearCart } = useCart();
  const { createOrder } = useCheckout();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const razorpayOrderId = searchParams.get('razorpay_order_id');
  const razorpayPaymentId = searchParams.get('razorpay_payment_id');
  const razorpaySignature = searchParams.get('razorpay_signature');

  useEffect(() => {
    const processOrder = async () => {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        setError('No payment details found');
        setIsProcessing(false);
        return;
      }

      try {
        // First verify the payment
        const verificationResult = await verifyPayment({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        });

        if (!verificationResult.success) {
          setError('Payment verification failed');
          setIsProcessing(false);
          return;
        }

        const selectedItems = getSelectedItems();
        const total = getTotal();

        // Create order with shipping address (you might want to collect this from user)
        const orderData = {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          items: selectedItems,
          total,
          shippingAddress: {
            name: user?.name || 'Customer',
            email: user?.email || '',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
        };

        const result = await createOrder(orderData);

        if (result.success) {
          setOrder(result.order);
          // Clear cart after successful order
          await clearCart();
        } else {
          setError(result.error || 'Failed to create order');
        }
      } catch (err) {
        console.error('Order processing error:', err);
        setError('Failed to process order');
      } finally {
        setIsProcessing(false);
      }
    };

    processOrder();
  }, [razorpayOrderId, razorpayPaymentId, razorpaySignature, getSelectedItems, getTotal, createOrder, clearCart, user, verifyPayment]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your order...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment and create your order.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Processing Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/cart')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          {order && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Order ID:</span>
                    <p className="text-gray-900">{order._id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total:</span>
                    <p className="text-gray-900">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-green-600 font-medium">{order.status}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
