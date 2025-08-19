import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/data/allProducts';

// Cart item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected: boolean;
}

// Cart state interface
interface CartState {
  items: CartItem[];
  discountCode: string;
  discountPercentage: number;
  shippingCost: number;
  isLoading: boolean;
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_ITEM_SELECTION'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string; percentage: number } }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'SET_SHIPPING_COST'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: CartState = {
  items: [],
  discountCode: '',
  discountPercentage: 0,
  shippingCost: 0,
  isLoading: false,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
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
          id: action.payload.id,
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

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Cart context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleItemSelection: (id: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  getSelectedItems: () => CartItem[];
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
} | null>(null);

// Cart provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items) {
          parsedCart.items.forEach((item: any) => {
            dispatch({ type: 'ADD_ITEM', payload: item.product });
            if (item.quantity > 1) {
              dispatch({ 
                type: 'UPDATE_QUANTITY', 
                payload: { id: item.id, quantity: item.quantity } 
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Helper functions
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const toggleItemSelection = (id: string) => {
    dispatch({ type: 'TOGGLE_ITEM_SELECTION', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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
