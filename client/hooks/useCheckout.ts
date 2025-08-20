import { useAuthApi } from './useAuthApi';
import { CartItem } from './useCart';
import { RAZORPAY_KEY_ID } from '../src/config/api';

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  key: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  message: string;
}

interface OrderData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function useCheckout() {
  const api = useAuthApi();

  const createRazorpayOrder = async (amount: number, currency: string = 'INR'): Promise<{ success: boolean; order?: RazorpayOrderResponse; error?: string }> => {
    try {
      const response: RazorpayOrderResponse = await api.post('/payment/create-order', {
        amount,
        currency,
      });

      return { success: true, order: response };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      return { success: false, error: 'Failed to create Razorpay order' };
    }
  };

  const verifyPayment = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response: PaymentVerificationResponse = await api.post('/payment/verify-payment', paymentData);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Payment verification failed:', error);
      return { success: false, error: 'Failed to verify payment' };
    }
  };

  const createOrder = async (orderData: OrderData): Promise<{ success: boolean; order?: any; error?: string }> => {
    try {
      const response = await api.post('/orders', orderData);
      return { success: true, order: response.order };
    } catch (error) {
      console.error('Order creation failed:', error);
      return { success: false, error: 'Failed to create order' };
    }
  };

  const openRazorpayCheckout = (order: RazorpayOrderResponse, onSuccess: (paymentData: any) => void, onFailure: (error: any) => void) => {
    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: 'Your Store Name',
      description: 'Purchase Description',
      order_id: order.id,
      handler: function (response: any) {
        onSuccess(response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Customer Address'
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function() {
          onFailure(new Error('Payment cancelled'));
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return {
    createRazorpayOrder,
    verifyPayment,
    createOrder,
    openRazorpayCheckout,
  };
}
