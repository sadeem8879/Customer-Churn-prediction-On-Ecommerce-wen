// import { Router } from "express";
// import userController from "../controller/user.controller.js";
// // import { verifyJWT } from "../middleware/Jwt.token.js"
// import { authenticateToken } from "../middleware/authenticate.js";
// // import { authenticateUser } from "../middleware/authUser.js";
// import * as userActivity from "../controller/user.activity.controller.js";
// // import { authenticateToken } from "../middleware/authenticate.js";
// import adminAuth from "../middleware/adminAuth.js";


// const userRoute = Router()

// userRoute.post('/', userController.register)
// // userRoute.post('/login', verifyJWT, userController.login)
// // userRoute.post('/login',authenticateUser, userController.login)
// userRoute.post('/login', userController.login)

// // userRoute.get("/profile", authenticateToken, userController.getUserProfile);
// userRoute.get("/mens", userController.menproduct);
// userRoute.get("/womens", userController.womenproduct);
// userRoute.get("/kids", userController.kidsproduct);
// userRoute.get("/accessories", userController.accessories);
// userRoute.get("/cosmetics", userController.cosmetics);
// userRoute.post("/cart", userController.cart);
// userRoute.get("/cart/:userId", userController.cart_fetch);
// userRoute.delete("/cart/:cartId", userController.cart_delete);
// userRoute.put("/cart/:id", userController.cart_update);
// userRoute.post("/buynow", userController.buynow); 
// // userRoute.put("/cart/:id", userController.getChurnedCustomers);
// // userRoute.get("/churn-data", authenticateToken, adminAuth, userController.getChurnedCustomers);
// userRoute.get("/churned-customers",  userController.getChurnedCustomers);
// userRoute.get("/churn-state", userController.getChurnByState);
// userRoute.get("/churn-age", userController.getChurnByAge);
// userRoute.get("/churn-gender", userController.getChurnByGender);
// userRoute.post("/predict-churn",  userController.predictChurn);
// userRoute.get("/total-customers",  userController.getTotalCustomers);
// userRoute.get("/churn-stats",  userController.getStats);
// userRoute.get("/churn-trends",  userController.getChurnTrends);
// userRoute.get("/customer/:id",  userController.getCustomerDetails);
// userRoute.get("/high-risk-customers",  userController.getHighRiskCustomers);
// userRoute.get("/customer-segments",  userController.getCustomerSegments);
// userRoute.get("/retention-rate",  userController.getRetentionRate);
// userRoute.get("/export",  userController.exportData);
// userRoute.get("/profile/:type/:id",  userController.Profile);
// userRoute.get("/churn-explanation/:id",  userController.getChurnedUser);

// userRoute.post("/contact", userController.sendContactForm);

// // Add route to fetch real-time churn predictions
// // userRoute.post("/predict-churn", userController.predictChurn);

// userRoute.get("/admin-dashboard", userController.adminDashboard);
// userRoute.post('/admin-login', userController.adminLogin); // Add this route
// // userRoute.post('/admin-create', userController.createAdmin); // Add this route

// userRoute.post("/track-login", userActivity.trackLogin);
// userRoute.post("/track-time", userActivity.trackTimeSpent);  // Changed to POST based on your method
// userRoute.get("/get-total-time", userActivity.getTotalTimeSpent);  // Adjusted route for total time
// userRoute.put("/reset-time", userActivity.resetTimeSpent);  // Adjusted to PUT for reset
// userRoute.get("/get-time", userActivity.getTimeSpent);  // Route to fetch time spent

// userRoute.post('/logout',userController.handleUserLogout)

// // module.exports = { trackTimeSpent, getTotalTimeSpent, resetTimeSpent };

// // userRoute.get("/profile", verifyJWT, userController.getUserProfile); // Protect this route
// export default userRoute

import { Router } from "express";
import userController from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/authenticate.js";
import * as userActivity from "../controller/user.activity.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const userRoute = Router();

// Auth & Profile
userRoute.post("/", userController.register);
userRoute.post("/login", userController.login);
userRoute.post("/logout", userController.handleUserLogout);
userRoute.get("/profile/:type/:id", userController.Profile);

// Shop/Product Routes
userRoute.get("/mens", userController.menproduct);
userRoute.get("/womens", userController.womenproduct);
userRoute.get("/kids", userController.kidsproduct);
userRoute.get("/accessories", userController.accessories);
userRoute.get("/cosmetics", userController.cosmetics);

// Cart & Purchase
userRoute.post("/cart", userController.cart);
userRoute.get("/cart/:userId", userController.cart_fetch);
userRoute.delete("/cart/:cartId", userController.cart_delete);
userRoute.put("/cart/:id", userController.cart_update);
userRoute.post("/buynow", userController.buynow);

// Churn & Analytics
userRoute.get("/churned-customers", userController.getChurnedCustomers);
userRoute.get("/high-risk-customers", userController.getHighRiskCustomers);
userRoute.get("/churn-state", userController.getChurnByState);
userRoute.get("/churn-gender", userController.getChurnByGender);
userRoute.get("/churn-age", userController.getChurnByAge);
userRoute.get("/churn-trends", userController.getChurnTrends);
userRoute.get("/churn-stats", userController.getStats);
userRoute.get("/retention-rate", userController.getRetentionRate);
userRoute.get("/customer-segments", userController.getCustomerSegments);
userRoute.get("/total-customers", userController.getTotalCustomers);
userRoute.get("/customer/:id", userController.getCustomerDetails);
userRoute.get("/churn-explanation/:id", userController.getChurnedUser);

// ML Prediction & Export
userRoute.post("/predict-churn", userController.predictChurn);
userRoute.get("/export", userController.exportData);

// Admin
userRoute.get("/admin-dashboard", userController.adminDashboard);
userRoute.post("/admin-login", userController.adminLogin);

// User Activity
userRoute.post("/track-login", userActivity.trackLogin);
userRoute.post("/track-time", userActivity.trackTimeSpent);
userRoute.get("/get-total-time", userActivity.getTotalTimeSpent);
userRoute.get("/get-time", userActivity.getTimeSpent);
userRoute.put("/reset-time", userActivity.resetTimeSpent);

// Contact
userRoute.post("/contact", userController.sendContactForm);

export default userRoute;
