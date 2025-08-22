import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/data/allProducts';
import { useAuthApi } from './useAuthApi';

// Cart item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected: boolean;
}

// Backend cart item interface
interface BackendCartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

// Backend cart response interface
interface BackendCartResponse {
  cart: {
    _id: string;
    userId: string;
    items: BackendCartItem[];
    total: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Cart state interface
interface CartState {
  items: CartItem[];
  discountCode: string;
  discountPercentage: number;
  shippingCost: number;
  isLoading: boolean;
  error: string | null;
}

// Cart actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_ITEM_SELECTION'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string; percentage: number } }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'SET_SHIPPING_COST'; payload: number };

// Initial state
const initialState: CartState = {
  items: [],
  discountCode: '',
  discountPercentage: 0,
  shippingCost: 0,
  isLoading: false,
  error: null,
};

// Convert backend cart item to frontend format
const convertBackendCartItem = (backendItem: BackendCartItem): CartItem => ({
  id: backendItem.productId._id,
  product: {
    id: parseInt(backendItem.productId._id.slice(-6), 16),
    name: backendItem.productId.name,
    description: '', // Backend doesn't provide description in cart
    image: backendItem.productId.image,
    price: backendItem.productId.price,
    category: '', // Backend doesn't provide category in cart
    rating: 4.5,
    discount: 0,
    originalPrice: backendItem.productId.price,
    reviews: 0,
  },
  quantity: backendItem.quantity,
  selected: true,
});

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CART_ITEMS':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, {
          id: action.payload.id.toString(),
          product: action.payload,
          quantity: 1,
          selected: true,
        }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case 'TOGGLE_ITEM_SELECTION':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, selected: !item.selected }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        discountCode: '',
        discountPercentage: 0,
      };

    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discountCode: action.payload.code,
        discountPercentage: action.payload.percentage,
      };

    case 'REMOVE_DISCOUNT':
      return {
        ...state,
        discountCode: '',
        discountPercentage: 0,
      };

    case 'SET_SHIPPING_COST':
      return {
        ...state,
        shippingCost: action.payload,
      };

    default:
      return state;
  }
}

// Cart context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (id: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  toggleItemSelection: (id: string) => void;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  getSelectedItems: () => CartItem[];
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  refreshCart: () => Promise<void>;
} | null>(null);

// Cart provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const api = useAuthApi();

  // Fetch cart from API
  const fetchCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const data: BackendCartResponse = await api.get('/cart');
      const convertedItems = data.cart.items.map(convertBackendCartItem);
      dispatch({ type: 'SET_CART_ITEMS', payload: convertedItems });
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If 401, user is not authenticated, clear cart
      dispatch({ type: 'SET_CART_ITEMS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // API helper functions
  const addToCart = async (product: Product): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.post('/cart', {
        productId: product.id, // Use the actual product ID
        quantity: 1,
      });
      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Failed to add item to cart' };
    }
  };

  const removeFromCart = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: 'Failed to remove item from cart' };
    }
  };

  const updateQuantity = async (id: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  const clearCart = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.delete('/cart');
      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: 'Failed to clear cart' };
    }
  };

  // Local state functions (no API calls needed)
  const toggleItemSelection = (id: string) => {
    dispatch({ type: 'TOGGLE_ITEM_SELECTION', payload: id });
  };

  const applyDiscount = (code: string): boolean => {
    // Mock discount codes
    const discountCodes: Record<string, number> = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'FLAT50': 50,
    };

    const percentage = discountCodes[code.toUpperCase()];
    if (percentage) {
      dispatch({ 
        type: 'APPLY_DISCOUNT', 
        payload: { code: code.toUpperCase(), percentage } 
      });
      return true;
    }
    return false;
  };

  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };

  const getSelectedItems = () => {
    return state.items.filter(item => item.selected);
  };

  const getSubtotal = () => {
    return getSelectedItems().reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    return (subtotal * state.discountPercentage) / 100;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    return subtotal - discount + state.shippingCost;
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const value = {
    state,
    dispatch,
    addToCart,
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
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
