import { Router } from "express";
import userController from "../controller/user.controller.js";
// import { verifyJWT } from "../middleware/Jwt.token.js"
import { authenticateToken } from "../middleware/authenticate.js";
// import { authenticateUser } from "../middleware/authUser.js";
import * as userActivity from "../controller/user.activity.controller.js";


const userRoute = Router()

userRoute.post('/', userController.register)
// userRoute.post('/login', verifyJWT, userController.login)
// userRoute.post('/login',authenticateUser, userController.login)
userRoute.post('/login', userController.login)

userRoute.get("/profile", authenticateToken, userController.getUserProfile);
userRoute.get("/mens", userController.menproduct);
userRoute.get("/womens", userController.womenproduct);
userRoute.get("/kids", userController.kidsproduct);
userRoute.get("/accessories", userController.accessories);
userRoute.get("/cosmetics", userController.cosmetics);
userRoute.post("/cart", userController.cart);
userRoute.get("/cart/:userId", userController.cart_fetch);
userRoute.delete("/cart/:cartId", userController.cart_delete);
userRoute.put("/cart/:id", userController.cart_update);
userRoute.post("/buynow", userController.buynow); 

userRoute.post("/track-login", userActivity.trackLogin);
userRoute.post("/track-time", userActivity.trackTimeSpent);  // Changed to POST based on your method
userRoute.get("/get-total-time", userActivity.getTotalTimeSpent);  // Adjusted route for total time
userRoute.put("/reset-time", userActivity.resetTimeSpent);  // Adjusted to PUT for reset
userRoute.get("/get-time", userActivity.getTimeSpent);  // Route to fetch time spent

userRoute.post('/logout',userController.handleUserLogout)

// module.exports = { trackTimeSpent, getTotalTimeSpent, resetTimeSpent };

// userRoute.get("/profile", verifyJWT, userController.getUserProfile); // Protect this route
export default userRoute