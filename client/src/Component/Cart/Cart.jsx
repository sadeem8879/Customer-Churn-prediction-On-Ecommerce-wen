// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Cart = ({ userId }) => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);

//   // If user is not logged in, redirect to login page
//   useEffect(() => {
//     if (!userId) {
//       navigate('/login');  // Redirect to login page if not logged in
//     } else {
//       // Fetch cart items if user is logged in
//       axios.get(`http://localhost:8080/cart/${userId}`)
//         .then(response => {
//           setCartItems(response.data);
//         })
//         .catch(error => console.error('Error fetching cart items:', error));
//     }
//   }, [userId, navigate]);

//   return (
//     <div>
//       <h1>Your Cart</h1>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty!</p>
//       ) : (
//         cartItems.map(item => (
//           <div key={item.id}>
//             <p>{item.product.name} - Quantity: {item.quantity}</p>
//             <p>Price: ${item.product.price}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Cart;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');

  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const userId = parseInt(localStorage.getItem("userId"), 10); 
    if (!userId) {
      navigate("/login"); 
      return;
    }
  
    axios.get(`http://localhost:8080/cart/${userId}`)
    .then((response) => {
      if (response.data.message) {
        setMessage(response.data.message);  // This will show 'No items found in the cart'
      } else {
        setCartItems(response.data);  // Populate the cart
      }})
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setLoading(false); // Stop loading even if there's an error
        if (error.response && error.response.status === 404) {
          setMessage("Your cart is empty!");
        }
      });
  }, [navigate]);

  return (
    <div>
      <h1>Your Cart</h1>
      {message && <p className="text-danger">{message}</p>}
      {cartItems.length === 0 ? (
    <p>Your cart is empty!</p>
) : (
    cartItems.map((item) => (
      <div key={item.id}>
      <h3>{item.productDetails.name}</h3>
      <p>Type: {item.productType}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${item.productDetails.price}</p>
  </div>    ))
)}

    </div>
  );
};

export default Cart;
