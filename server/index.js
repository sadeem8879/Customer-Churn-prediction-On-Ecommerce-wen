// // import express from "express"
// // import router from "./routes/index.js"
// // import cors from 'cors';
// // import cookieParser from 'cookie-parser';  // Import cookie-parser

// // const app=express()

// // const PORT=8080

// // // app.post('/',userRoute)
// // app.use(express.json())
// // app.use(cors({
// //     origin: "http://localhost:5173", // Frontend URL
// //     credentials: true, // Allow cookies to be sent with requests
// // }));
// // app.use(cookieParser());
// // app.use(cors())
// // app.use(router)

// // app.listen(PORT,()=>{
// //     console.log("server is running on",PORT)
// // })
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import router from "./routes/index.js";
// import path from 'path';

// const app = express();
// const PORT = 8080;

// // app.use(cors({
// //   origin: "http://localhost:5173", // React frontend URL
// //   credentials: true, // Allow cookies
// // }));
// // app.use(cors())

// app.use(cors({
//   origin: "http://localhost:5173", // Your frontend's origin
//   credentials: true, // Allow credentials
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
// }));

// // app.use(cors())
// app.use(express.json());
// app.use(cookieParser());  // To parse cookies
// // app.use('/images', express.static('images'));
// const __dirname = path.resolve();
// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(router);  // Attach your routes

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js"; // Import your main routes (which includes userRoute)
import path from 'path';
import userRoute from './routes/user.route.js'; // Correct import is here
import "./middleware/cron.js";  // This will run the cron job automatically
// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config"
const app = express();
const PORT = 8080;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization, admin-id" // Allow admin-id header
}));

// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body); // Log the request body
//     next();
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Fixes form data issues
app.use(cookieParser());

const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/activity', userRoute); // Mount userRoute under /api/activity

app.use(router); // Use the combined routes
console.log(process.env.SECRET_KEY)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});