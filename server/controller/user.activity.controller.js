// import prisma from "../database/db.js";
// // Function to track time spent by a user
// export const trackTimeSpent = async (req, res) => {
//     try {
//       const { userId, timeSpent } = req.body;

//       if (!userId || !timeSpent) {
//         return res.status(400).json({ error: "User ID and time spent are required" });
//       }

//       const today = new Date();
//       today.setUTCHours(0, 0, 0, 0);

//       await prisma.userTimeSpent.upsert({
//         where: {
//           userId_date: {
//             userId: parseInt(userId),
//             date: today, // Ensure correct date format
//           },
//         },
//         update: {
//           timeSpent: {
//             increment: parseInt(timeSpent),
//           },
//         },
//         create: {
//           userId: parseInt(userId),
//           date: today,
//           timeSpent: parseInt(timeSpent),
//         },
//       });

//       res.status(200).json({ message: "Time spent tracked successfully" });
//     } catch (error) {
//       console.error("Error tracking time spent:", error);
//       res.status(500).json({ error: "Failed to track time spent" });
//     }
//   };


// // Function to get total time spent by a user
// export const getTotalTimeSpent = async (req, res) => {
//     try {
//         const userId = parseInt(req.params.userId, 10);

//         // Validate userId
//         if (isNaN(userId)) {
//             return res.status(400).json({ error: "Invalid user ID" });
//         }

//         // Fetch total time spent by the user
//         const result = await prisma.userTimeSpent.aggregate({
//             where: { userId: userId },
//             _sum: {
//                 timeSpent: true, // Get the sum of timeSpent for the user
//             },
//         });

//         // Return the total time spent
//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error getting total time spent:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// // Function to reset the time spent for a specific user and date
// export const resetTimeSpent = async (req, res) => {
//     try {
//         const userId = parseInt(req.params.userId, 10);
//         const date = req.body.date || new Date().toISOString().split('T')[0];  // Default to today's date if not provided

//         // Validate userId
//         if (isNaN(userId)) {
//             return res.status(400).json({ error: "Invalid user ID" });
//         }

//         // Reset timeSpent to 0 for the given user and date
//         const result = await prisma.userTimeSpent.upsert({
//             where: {
//                 userId_date: {
//                     userId: Number(userId),  // userId should be an integer
//                     date: date,
//                 },
//             },
//             update: {
//                 timeSpent:  { increment: Number(timeSpent)},  // Reset timeSpent to 0
//             },
//             create: {
//                 userId: userId,
//                 date: date,
//                 timeSpent: 0,  // Set initial timeSpent to 0 if no record exists
//             },
//         });

//         // Respond with the result
//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error resetting time spent:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
// export const getTimeSpent = async (req, res) => {
//     const { userId, date } = req.query;  // Assuming userId and date are sent as query params

//     try {
//         const timeSpentRecord = await prisma.userTimeSpent.findUnique({
//             where: {
//                 userId_date: {
//                     userId: parseInt(userId),  // Ensure userId is an integer
//                     date: date,
//                 },
//             },
//         });

//         if (timeSpentRecord) {
//             res.json({ timeSpent: timeSpentRecord.timeSpent });
//         } else {
//             res.status(404).json({ error: "Time spent record not found" });
//         }
//     } catch (error) {
//         console.error("Error fetching time spent:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };
// // Function to track user login
// // user.activity.controller.js
// export const trackLogin = async (req, res) => {
//     try {
//       const { userId } = req.body;

//       if (!userId) {
//         return res.status(400).json({ error: "User ID is required" });
//       }

//       const today = new Date();
//       today.setUTCHours(0, 0, 0, 0); // Ensure it's stored at midnight UTC

//       await prisma.userLogin.upsert({
//         where: {
//           userId_date: {
//             userId: parseInt(userId),
//             date: today, // Use a Date object instead of a string
//           },
//         },
//         update: {
//           loginCount: {
//             increment: 1,
//           },
//         },
//         create: {
//           userId: parseInt(userId),
//           date: today, // Store Date object
//           loginCount: 1,
//         },
//       });

//       res.status(200).json({ message: "Login tracked successfully" });
//     } catch (error) {
//       console.error("Error tracking login:", error);
//       res.status(500).json({ error: "Failed to track login" });
//     }
//   };


//   // Assuming user logs out
// async function handleUserLogout(userId) {
//   const date = new Date();  // Current date and time

//   // Logic to calculate time spent during the session (in minutes)
//   const timeSpentDuringSession = calculateTimeSpent(sessionStartTime, date);

//   await prisma.userTimeSpent.upsert({
//     where: {
//       userId_date: {
//         userId: userId,
//         date: date.toISOString(),  // Use ISO format
//       }
//     },
//     update: {
//       timeSpent: {
//         increment: timeSpentDuringSession
//       }
//     },
//     create: {
//       userId: userId,
//       date: date.toISOString(),  // Use ISO format
//       timeSpent: timeSpentDuringSession
//     }
//   });
// }

// // Example function to calculate time spent in minutes
// function calculateTimeSpent(startTime, endTime) {
//   const timeDiff = endTime - startTime;  // In milliseconds
//   return Math.floor(timeDiff / 60000);  // Convert milliseconds to minutes
// }


// // module.exports = { trackTimeSpent,getTimeSpent, getTotalTimeSpent, resetTimeSpent };
// // user.activity.controller.js
// // Ensure this is only present once
// // export { trackLogin, trackTimeSpent, getTotalTimeSpent, resetTimeSpent, getTimeSpent };
import prisma from "../database/db.js";

// Function to track time spent by a user

export const trackTimeSpent = async (req, res) => {
  try {
    const { userId, timeSpent } = req.body;

    if (!userId || isNaN(userId) || !timeSpent || isNaN(timeSpent)) {
      return res.status(400).json({ error: "Valid userId and timeSpent are required" });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.userTimeSpent.upsert({
      where: {
        userId_date: {
          userId: Number(userId), // Ensure `userId` is a number
          date: today, // Ensure date is in Date format
        },
      },
      update: {
        timeSpent: {
          increment: Number(timeSpent), // Ensure `timeSpent` is a number
        },
      },
      create: {
        id: undefined,  // Auto-increment ID, Prisma will handle it
        userId: Number(userId),
        date: today,
        timeSpent: Number(timeSpent),
      },
    });

    res.status(200).json({ message: "Time spent tracked successfully" });
  } catch (error) {
    console.error("Error tracking time spent:", error);
    res.status(500).json({ error: "Failed to track time spent" });
  }
};

// Function to get total time spent by a user
export const getTotalTimeSpent = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await prisma.userTimeSpent.aggregate({
      where: { userId },
      _sum: { timeSpent: true },
    });

    res.status(200).json({ totalTimeSpent: result._sum.timeSpent || 0 });
  } catch (error) {
    console.error("Error getting total time spent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to reset the time spent for a specific user and date
export const resetTimeSpent = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    await prisma.userTimeSpent.upsert({
      where: { userId_date: { userId, date: today } },
      update: { timeSpent: 0 },
      create: { userId, date: today, timeSpent: 0 },
    });

    res.status(200).json({ message: "Time spent reset successfully" });
  } catch (error) {
    console.error("Error resetting time spent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get time spent for a specific user and date
export const getTimeSpent = async (req, res) => {
  try {
    const { userId, date } = req.query;

    if (!userId || isNaN(userId) || !date) {
      return res.status(400).json({ error: "Valid userId and date are required" });
    }

    const timeSpentRecord = await prisma.userTimeSpent.findUnique({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: new Date(date),
        },
      },
    });

    if (timeSpentRecord) {
      res.status(200).json({ timeSpent: timeSpentRecord.timeSpent });
    } else {
      res.status(404).json({ error: "Time spent record not found" });
    }
  } catch (error) {
    console.error("Error fetching time spent:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Function to track user login
export const trackLogin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.userLogin.upsert({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: today,
        },
      },
      update: {
        loginCount: { increment: 1 },
      },
      create: {
        userId: parseInt(userId),
        date: today,
        loginCount: 1,
      },
    });

    res.status(200).json({ message: "Login tracked successfully" });
  } catch (error) {
    console.error("Error tracking login:", error);
    res.status(500).json({ error: "Failed to track login" });
  }
};

// Function to track user logout and update time spent
export const trackLogout = async (req, res) => {
  try {
    const { userId, sessionStartTime } = req.body;

    if (!userId || isNaN(userId) || !sessionStartTime) {
      return res.status(400).json({ error: "Valid userId and sessionStartTime are required" });
    }

    const endTime = new Date();
    const timeSpentDuringSession = calculateTimeSpent(new Date(sessionStartTime), endTime);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.userTimeSpent.upsert({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: today,
        },
      },
      update: {
        timeSpent: { increment: timeSpentDuringSession },
      },
      create: {
        userId: parseInt(userId),
        date: today,
        timeSpent: timeSpentDuringSession,
      },
    });

    res.status(200).json({ message: "Logout tracked successfully", timeSpentDuringSession });
  } catch (error) {
    console.error("Error tracking logout:", error);
    res.status(500).json({ error: "Failed to track logout" });
  }
};

// Function to calculate time spent in minutes
function calculateTimeSpent(startTime, endTime) {
  const timeDiff = endTime - startTime;
  return Math.floor(timeDiff / 1000); // Convert milliseconds to seconds
}

// Corrected Export Statement (No Duplicates)
// export { trackLogin, trackLogout, trackTimeSpent, getTotalTimeSpent, resetTimeSpent, getTimeSpent as fetchTimeSpent };
