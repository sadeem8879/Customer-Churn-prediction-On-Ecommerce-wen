// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Home from './Pages/Home/Home';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Login from './Component/Login/Login';
// import Mens from "./Component/Mens/Mens";
// import Womens from "./Component/Womens/Womens";
// import Kids from "./Component/Kids/Kids";
// import Accessories from "./Component/Accessories/Accessories";
// import Cosmetics from "./Component/Cosmetics/Cosmetics";
// import Register from './Component/Register/Register';
// import MyNavbar from './Component/Navbar/myNavbar';
// import Profile from "./Component/Profile/Profile";
// import Cart from "./Component/Cart/Cart";
// import { CartProvider } from './Context/CartContext';  // Import CartProvider

// function App() {
//   const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

//   // Handle login, store userId in localStorage and update state
//   const handleLogin = (userId) => {
//     console.log('Login function triggered with userId:', userId);
//     localStorage.setItem('userId', userId); // Store userId in localStorage
//     setUserId(userId); // Update state with the userId
//   };
  

//   // Handle logout, remove userId from localStorage and update state
//   const handleLogout = () => {
//     localStorage.removeItem('userId');
//     setUserId(null);
//   };

//   // Check for userId on page load and update state accordingly
//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   return (
    
//     <CartProvider>
//       <BrowserRouter>
//         <MyNavbar handleLogout={handleLogout} userId={userId} />
//         <Routes>
//           <Route path="/" element={<Register />} />
//           <Route path="/login"  element={<Login handleLogin={handleLogin} />}  />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/mens" element={<Mens />} />
//           <Route path="/womens" element={<Womens />} />
//           <Route path="/kids" element={<Kids />} />
//           <Route path="/accessories" element={<Accessories />} />
//           <Route path="/cosmetics" element={<Cosmetics />} />
//           <Route path="/cart" element={<Cart userId={userId} />} />
//         </Routes>
//       </BrowserRouter>
//     </CartProvider>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './Component/Login/Login';
import Mens from "./Component/Mens/Mens";
import Womens from "./Component/Womens/Womens";
import Kids from "./Component/Kids/Kids";
import Accessories from "./Component/Accessories/Accessories";
import Cosmetics from "./Component/Cosmetics/Cosmetics";
import Register from './Component/Register/Register';
import MyNavbar from './Component/Navbar/myNavbar';
import View from './Component/Checkout/View';
import Profile from "./Component/Profile/Profile";
import Cart from "./Component/Cart/Cart";
import Buy_now from "./Component/Buy_now/Buy_now"
import { CartProvider } from './Context/CartContext';  // Import CartProvider
import OrderSuccess from "./Component/OrderSuccess/OrderSuccess"

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const handleLogin = (userId) => {
    console.log('Login function triggered with userId:', userId);  // Check if the function is triggered and the userId is correct
    localStorage.setItem('userId', userId);  // Store userId in localStorage
    setUserId(userId);  // Update state with userId
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <CartProvider userId={userId}>  {/* Pass userId to CartProvider */}
      <BrowserRouter>
        <MyNavbar handleLogout={handleLogout} userId={userId} />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mens" element={<Mens />} />
          <Route path="/womens" element={<Womens />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/cosmetics" element={<Cosmetics />} />
          <Route path="/cart" element={<Cart />} />  {/* Cart route */}
          <Route path="/product" element={<View />} />  {/* Cart route */}
          <Route path="/buynow" element={<Buy_now />} />
          <Route path="/order-success" element={<OrderSuccess />} />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
