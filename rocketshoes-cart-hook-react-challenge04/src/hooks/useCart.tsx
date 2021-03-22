import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  async function validateStock(productId: number, amount: number): Promise<boolean> {
    const response = await api.get<Stock>(`/stock/${productId}`);
    return response.data.amount >= amount;
  }

  const addProduct = async (productId: number) => {
    try {
      const existingItemInCart = cart.find(item => item.id === productId);
      let newCart: Product[];
      
      if (!existingItemInCart) {
        const response = await api.get<Product>(`products/${productId}`);
        newCart = [...cart, { ...response.data, amount: 1 }];
      } else {
        newCart = cart.map(item => item.id === existingItemInCart.id ? { ...item, amount: item.amount + 1 } : item);
      }

      const stockIsValid = await validateStock(productId, existingItemInCart ? existingItemInCart.amount + 1 : 1);

      if (!stockIsValid) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      setCart(newCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      if (!cart.some(item => item.id === productId)) {
        throw new Error();
      }

      const newCart = cart.filter(item => item.id !== productId);

      setCart(newCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) return;

      if (!await validateStock(productId, amount)) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const newCart = cart.map(item => item.id === productId ? { ...item, amount } : item);
      setCart(newCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
