//   import React, { createContext, useState, useEffect, useContext } from 'react';
//   import axios from 'axios';

//   const CartContext = createContext();

//   export const fetchCart = async () => {
//     const [cart, setCart] = useState([]);
//     const [userId, setUserId] = useState(parseInt(localStorage.getItem('userId')));

   
//     if (!userId) return;
//     try {
//         const response = await axios.get(`http://localhost:8080/cart/${userId}`);
//         setCart(response.data);
//     } catch (error) {
//         console.error("Error fetching cart items", error);
//     }
// };
//   export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState([]);
//     const [userId, setUserId] = useState(parseInt(localStorage.getItem('userId')));

   

//       const addToCart = async ({ product, productType }) => {
//           if (!userId) {
//               alert("Please login first!");
//               return;
//           }

//           let productIdField;
//           switch (productType) {
//               case "MenProduct": productIdField = "menProductId"; break;
//               case "WomenProduct": productIdField = "womenProductId"; break;
//               case "KidsProduct": productIdField = "kidsProductId"; break;
//               case "AccessoriesProduct": productIdField = "accessoriesProductId"; break;
//               case "CosmeticsProduct": productIdField = "cosmeticsProductId"; break;
//               default:
//                   console.error("Invalid product type:", productType);
//                   return;
//           }

//           const cartItem = {
//               userId: userId, // Use userId directly from the context
//               productType: productType,
//               quantity: 1,
//               [productIdField]: product.id,
//           };

//           console.log("Data being sent to backend:", JSON.stringify(cartItem, null, 2));

//           try {
//               const response = await axios.post("http://localhost:8080/cart", cartItem);
//               console.log("Response from adding to cart:", response.data);
//               fetchCart(); // Refetch the cart after adding an item
//               alert("Added to Cart!");
//           } catch (error) {
//               console.error("Error adding to cart:", error.response ? error.response.data : error);
//               if (error.response && error.response.status === 400) {
//                   alert(error.response.data.message);
//               }
//           }
//       };

//       const removeFromCart = async (cartId) => {
//           try {
//               await axios.delete(`http://localhost:8080/cart/${cartId}`);
//               setCart((prevCart) => prevCart.filter(item => item.id !== cartId));
//           } catch (error) {
//               console.error("Error removing item from cart", error);
//           }
//       };

//       useEffect(() => {
//           if (userId) fetchCart();
//       }, [userId]);

//       return (
//         <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
//         {children}
//       </CartContext.Provider>
//       );
//   };

//   export const useCart = () => {
//       return useContext(CartContext);
//   };
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const fetchCart = async (userId) => {
    if (!userId) {
        return [];
    }
    try {
        const response = await axios.get(`http://localhost:8080/cart/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart items", error);
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [userId, setUserId] = useState(parseInt(localStorage.getItem('userId')));

    useEffect(() => {
        const loadCart = async () => {
            if (userId) {
                const fetchedCart = await fetchCart(userId);
                setCart(fetchedCart);
            } else {
                setCart([]);
            }
        };
        loadCart();
    }, [userId]);

    const addToCart = async ({ product, productType }) => {
        if (!userId) {
            alert("Please login first!");
            return;
        }

        let productIdField;
        switch (productType) {
            case "MenProduct": productIdField = "menProductId"; break;
            case "WomenProduct": productIdField = "womenProductId"; break;
            case "KidsProduct": productIdField = "kidsProductId"; break;
            case "AccessoriesProduct": productIdField = "accessoriesProductId"; break;
            case "CosmeticsProduct": productIdField = "cosmeticsProductId"; break;
            default:
                console.error("Invalid product type:", productType);
                return;
        }

        const cartItem = {
            userId: userId,
            productType: productType,
            quantity: 1,
            [productIdField]: product.id,
        };

        try {
            await axios.post("http://localhost:8080/cart", cartItem);
            if (userId) {
                const fetchedCart = await fetchCart(userId);
                setCart(fetchedCart);
            }
            alert("Added to Cart!");
        } catch (error) {
            console.error("Error adding to cart:", error.response ? error.response.data : error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            }
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8080/cart/${cartId}`);
            if (userId) {
                const fetchedCart = await fetchCart(userId);
                setCart(fetchedCart);
            }
        } catch (error) {
            console.error("Error removing item from cart", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};