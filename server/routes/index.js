import { Router } from "express";
import userRoute from "./user.route.js";
import "dotenv/config"
const router=Router()

router.use('/',userRoute)

export default router