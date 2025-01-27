import { Router } from "express";
import userController from "../controller/user.controller.js";
// import { verifyJWT } from "../middleware/Jwt.token.js"
import { authenticateToken } from "../middleware/authenticate.js";


const userRoute = Router()

userRoute.post('/', userController.register)
// userRoute.post('/login', verifyJWT, userController.login)
userRoute.post('/login',  userController.login)

userRoute.get("/profile", authenticateToken, userController.getUserProfile);
userRoute.get("/mens",  userController.menproduct);
userRoute.get("/womens",  userController.womenproduct);
userRoute.get("/kids",  userController.kidsproduct);
userRoute.get("/accessories",  userController.accessories);
userRoute.get("/cosmetics",  userController.cosmetics);
userRoute.post("/cart",  userController.cart);
userRoute.get("/cart/:userId",  userController.cart_fetch);
userRoute.delete("/cart/:cartId",  userController.cart_delete);
userRoute.put("/cart/:id",  userController.cart_update);
userRoute.post("/buynow", userController.buynow);



// userRoute.get("/profile", verifyJWT, userController.getUserProfile); // Protect this route
export default userRoute