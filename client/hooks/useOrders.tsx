import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

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

interface OrdersContextType {
  state: OrdersState;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  getOrder: (id: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  clearOrders: () => void;
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

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        dispatch({ type: "SET_ORDERS", payload: orders });
      }
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load orders" });
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(state.orders));
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
  }, [state.orders]);

  const addOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ORDER", payload: newOrder });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    dispatch({ type: "UPDATE_ORDER", payload: { id, updates } });
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
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
