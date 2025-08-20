import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { getAuthHeaders } from './useAuth';

// API base URL - adjust this to match your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discountCode?: string;
  discountAmount?: number;
  createdAt: string;
  updatedAt: string;
}

// Backend order interfaces
interface BackendOrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  name: string;
}

interface BackendOrder {
  _id: string;
  userId: string;
  items: BackendOrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

type OrdersAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: { id: string; updates: Partial<Order> } }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "CLEAR_ORDERS" };

const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : order
        )
      };
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "CLEAR_ORDERS":
      return { ...state, orders: [] };
    default:
      return state;
  }
};

// Convert backend order to frontend format
const convertBackendOrder = (backendOrder: BackendOrder): Order => ({
  id: backendOrder._id,
  userId: backendOrder.userId,
  items: backendOrder.items.map(item => ({
    id: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.productId.image,
  })),
  shippingAddress: {
    fullName: '', // Backend doesn't store full name separately
    phone: '', // Backend doesn't store phone
    email: '', // Backend doesn't store email
    address: backendOrder.shippingAddress.street,
    city: backendOrder.shippingAddress.city,
    state: backendOrder.shippingAddress.state,
    zipCode: backendOrder.shippingAddress.zipCode,
    country: backendOrder.shippingAddress.country,
  },
  paymentMethod: backendOrder.paymentMethod,
  paymentStatus: backendOrder.paymentStatus,
  orderStatus: backendOrder.status,
  subtotal: backendOrder.total, // Backend doesn't separate subtotal
  shipping: 0, // Backend doesn't store shipping separately
  tax: 0, // Backend doesn't store tax separately
  total: backendOrder.total,
  discountCode: undefined,
  discountAmount: 0,
  createdAt: backendOrder.createdAt,
  updatedAt: backendOrder.updatedAt,
});

interface OrdersContextType {
  state: OrdersState;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => Promise<{ success: boolean; error?: string }>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<{ success: boolean; error?: string }>;
  getOrder: (id: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  clearOrders: () => void;
  fetchOrders: () => Promise<void>;
  placeOrderFromCart: (shippingAddress: Order['shippingAddress'], paymentMethod: string) => Promise<{ success: boolean; error?: string; orderId?: string }>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const [state, dispatch] = useReducer(ordersReducer, {
    orders: [],
    loading: false,
    error: null,
  });

  // Fetch orders from API
  const fetchOrders = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      dispatch({ type: "SET_ORDERS", payload: [] });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const convertedOrders = data.orders.map(convertBackendOrder);
        dispatch({ type: "SET_ORDERS", payload: convertedOrders });
      } else if (response.status === 401) {
        // User not authenticated, clear orders
        dispatch({ type: "SET_ORDERS", payload: [] });
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load orders" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return { success: false, error: 'Please login to place an order' };
    }

    try {
      // Convert frontend order format to backend format
      const backendOrderData = {
        items: orderData.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: orderData.shippingAddress.address,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          zipCode: orderData.shippingAddress.zipCode,
          country: orderData.shippingAddress.country,
        },
        paymentMethod: orderData.paymentMethod,
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(backendOrderData),
      });

      if (response.ok) {
        const data = await response.json();
        const newOrder = convertBackendOrder(data.order);
        dispatch({ type: "ADD_ORDER", payload: newOrder });
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.message || 'Failed to place order' };
      }
    } catch (error) {
      console.error("Error placing order:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const placeOrderFromCart = async (shippingAddress: Order['shippingAddress'], paymentMethod: string): Promise<{ success: boolean; error?: string; orderId?: string }> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return { success: false, error: 'Please login to place an order' };
    }

    try {
      const backendOrderData = {
        shippingAddress: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
        paymentMethod: paymentMethod,
      };

      const response = await fetch(`${API_BASE_URL}/orders/from-cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(backendOrderData),
      });

      if (response.ok) {
        const data = await response.json();
        const newOrder = convertBackendOrder(data.order);
        dispatch({ type: "ADD_ORDER", payload: newOrder });
        return { success: true, orderId: newOrder.id };
      } else {
        const data = await response.json();
        return { success: false, error: data.message || 'Failed to place order from cart' };
      }
    } catch (error) {
      console.error("Error placing order from cart:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return { success: false, error: 'Please login to update order' };
    }

    try {
      // For now, we'll just update local state
      // Backend doesn't have an update order endpoint in the current implementation
      dispatch({ type: "UPDATE_ORDER", payload: { id, updates } });
      return { success: true };
    } catch (error) {
      console.error("Error updating order:", error);
      return { success: false, error: 'Failed to update order' };
    }
  };

  const getOrder = (id: string): Order | undefined => {
    return state.orders.find(order => order.id === id);
  };

  const getUserOrders = (userId: string): Order[] => {
    return state.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const clearOrders = () => {
    dispatch({ type: "CLEAR_ORDERS" });
  };

  const value: OrdersContextType = {
    state,
    addOrder,
    updateOrder,
    getOrder,
    getUserOrders,
    clearOrders,
    fetchOrders,
    placeOrderFromCart,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
