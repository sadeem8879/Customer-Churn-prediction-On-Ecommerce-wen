// useTimeTracking.js
import { useEffect } from "react";
import axios from "axios";

const useTimeTracking = (userId) => {
  useEffect(() => {
    if (!userId) return; // If no userId, don't track time

    let startTime = Date.now();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startTime = Date.now(); // Resume tracking
      } else {
        trackTime();
      }
    };

    const trackTime = async () => {
      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 1000); // Convert to seconds

      try {
        await axios.post("http://localhost:8080/api/activity/track-time", { userId, timeSpent });
      } catch (error) {
        console.error("Time tracking error:", error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", trackTime); // Fallback

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", trackTime);
      trackTime(); // Track time when component is unmounted (logout or navigation)
    };
  }, [userId]); // Re-run the effect when userId changes
};

export default useTimeTracking;
