// import express from "express"
// import router from "./routes/index.js"
// import cors from 'cors';
// import cookieParser from 'cookie-parser';  // Import cookie-parser

// const app=express()

// const PORT=8080

// // app.post('/',userRoute)
// app.use(express.json())
// app.use(cors({
//     origin: "http://localhost:5173", // Frontend URL
//     credentials: true, // Allow cookies to be sent with requests
// }));
// app.use(cookieParser());
// app.use(cors())
// app.use(router)

// app.listen(PORT,()=>{
//     console.log("server is running on",PORT)
// })
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import path from 'path';

const app = express();
const PORT = 8080;

// app.use(cors({
//   origin: "http://localhost:5173", // React frontend URL
//   credentials: true, // Allow cookies
// }));
// app.use(cors())

app.use(cors({
  origin: "http://localhost:5173", // Your frontend's origin
  credentials: true, // Allow credentials
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

// app.use(cors())
app.use(express.json());
app.use(cookieParser());  // To parse cookies
// app.use('/images', express.static('images'));
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(router);  // Attach your routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
