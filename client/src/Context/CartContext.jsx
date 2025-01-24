import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create CartContext
const CartContext = createContext();

// CartProvider component to wrap around your app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Get userId from localStorage

  // Fetch cart items
  const fetchCart = async () => {
    if (!userId) return; // Avoid fetching cart if no userId
    try {
      const response = await axios.get(`http://localhost:8080/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  // Add item to cart
  const addToCart = async (product) => {
    if (!userId) {
      alert("Please login first!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/cart', {
        userId,
        productId: product.id,
        productType: product.type,
        quantity: 1,
      });
      setCart((prevCart) => [...prevCart, response.data]); // Add new item to cart
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8080/cart/${cartId}`);
      setCart((prevCart) => prevCart.filter(item => item.id !== cartId)); // Remove from cart state
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  useEffect(() => {
    if (userId) fetchCart(); // Fetch cart when component mounts if user is logged in
  }, [userId]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to access the CartContext
export const useCart = () => {
  return useContext(CartContext);
};
