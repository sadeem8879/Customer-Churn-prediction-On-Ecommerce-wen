import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [userTimeSpent, setUserTimeSpent] = useState(0);  // Store time spent in state

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data.user); // Set profile data
      } catch (error) {
        setError("Error fetching profile: " + (error.response?.data || error.message));
      }
    };

    const fetchTimeSpent = async () => {
      const userId = localStorage.getItem("userId"); // Get userId from localStorage (or from context if you're using that)
      if (!userId) return; // If there's no userId, don't proceed
  
      const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
  
      try {
        const response = await axios.get("http://localhost:8080/api/activity/time-spent", {
          params: { userId, date: currentDate },
        });
        console.log("Time spent data: ", response.data);
        setUserTimeSpent(response.data.timeSpent || 0); // Store the time spent value in the state
      } catch (error) {
        console.error("Error fetching time spent: ", error);
      }
    };

    fetchUserProfile();
    fetchTimeSpent();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.name}!</h1>
      <p>Email: {profile.email}</p>
      <p>User Time Spent Today: {userTimeSpent} seconds</p>
      {/* Add more profile details here */}
    </div>
  );
}

export default Profile;
