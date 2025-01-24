// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const token = localStorage.getItem("token");

//       try {
//         const response = await axios.get("http://localhost:8080/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(response.data.user); // Set user profile data
//       } catch (error) {
//         setError("Error fetching profile: " + (error.response?.data || error.message));
//         if (error.response?.status === 401) {
//           navigate("/login"); // Redirect to login if unauthorized
//         }
//       }
//     };

//     fetchUserProfile();
//   }, [navigate]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>User Profile</h1>
//       <p>Username: {user.Username}</p>
//       <p>Email: {user.email}</p>
//       {/* Add other user details here */}
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from 'react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await fetch('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.name}!</h1>
      <p>Email: {profile.email}</p>
      {/* Add more profile details here */}
    </div>
  );
}

export default Profile;
