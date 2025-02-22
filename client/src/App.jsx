import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this line at the top of your App.jsx file
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
import OrderSuccess from "./Component/OrderSuccess/OrderSuccess";
import useTimeTracking from "./Component/UserTrack/UserTrack";  // Importing your custom hook
import AdminDashboard from './Component/Admin/Admin';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [startTime, setStartTime] = useState(null);

  // Login function to set userId and track login time
  const handleLogin = async (userId) => {
    console.log('Login function triggered with userId:', userId);
    localStorage.setItem('userId', userId);
    setUserId(userId);

    try {
      await axios.post("http://localhost:8080/api/activity/track-login", { userId });
    } catch (error) {
      console.error("Login tracking error:", error);
    }
  };

  // Logout function to remove userId from localStorage
  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
  };

  // Effect to handle user login state persistence
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Time tracking logic
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return; // Do nothing if user is not logged in
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setStartTime(Date.now()); // Resume tracking
      } else {
        trackTime(); // Track time when user is away
      }
    };
  
    const trackTime = async () => {
      if (startTime) {
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime) / 1000); // Convert ms to seconds
  
        try {
          await axios.post("http://localhost:8080/api/activity/track-time", { userId, timeSpent });
        } catch (error) {
          console.error("Time tracking error:", error);
        }
        setStartTime(null); // Reset startTime
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", trackTime); // Fallback
  
    setStartTime(Date.now()); // Initial start time
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", trackTime);
      trackTime(); // Track time on unmount (logout or navigation)
    };
  }, []); // Empty dependency array
  
  useTimeTracking(userId); // Using your custom hook for time tracking

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
          <Route path="/cart" element={<Cart />} />
          <Route path="/product" element={<View />} />
          <Route path="/buynow" element={<Buy_now />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
