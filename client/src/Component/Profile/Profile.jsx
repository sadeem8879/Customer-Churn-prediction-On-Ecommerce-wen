import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`/api/user/profile/${userId}`)
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
      });
  }, [userId]);

  if (!profile) return <h2>Loading Profile...</h2>;

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  );
};

export default Profile;
