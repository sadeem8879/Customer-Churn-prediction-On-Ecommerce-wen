// import jwt from "jsonwebtoken"
// // import {SECRET_KEY} from ""//secret key through which the data was encoded
// import "dotenv/config"
// export const verifyJWT = (req, res, next) => {
//     try {
//         const SECRET_KEY = process.env.SECRET_KEY;
//         const authHeader = req.header('Authorization');
//         const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

//         if (!token) {
//             return res.status(401).json({ msg: "Unauthorized request, token not received" });
//         }

//         const decodedToken = jwt.verify(token, SECRET_KEY);

//         if (!decodedToken) {
//             return res.status(401).json({ msg: "Invalid token" });
//         }

//         console.log('Decoded token:', decodedToken);
//         req.decodedToken = decodedToken; // Attach the decoded token to the request
//         next();
//     } catch (error) {
//         console.error('JWT verification error:', error.message);
//         return res.status(500).json({ msg: "Token verification failed", error: error.message });
//     }
// // };
// import jwt from "jsonwebtoken";
// import "dotenv/config";
// // import jwt from "jsonwebtoken";

// export const verifyJWT = (req, res, next) => {
//     const token = req.cookies.authToken;

//     if (!token) {
//         return res.status(401).json({ msg: "No token, authorization denied" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         req.user = decoded; // Attach user data to the request
//         next();
//     } catch (err) {
//         return res.status(401).json({ msg: "Token is not valid" });
//     }
// };

// // export default verifyJWT;
// import jwt from "jsonwebtoken";
// import "dotenv/config";

// export const verifyJWT = (req, res, next) => {
//     const token = req.cookies.authToken; // Get the token from the cookies
//     console.log("Received Token:", token);  // Debugging check

//     if (!token) {
//         return res.status(401).json({ msg: "No token, authorization denied" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         req.user = decoded;  // Attach user data to request
//         next();
//     } catch (err) {
//         console.error("JWT Verification Error:", err);  // Debugging check
//         return res.status(401).json({ msg: "Token is not valid" });
//     }
// };// File: middleware/Jwt.token.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid" });
    }
    req.user = user;  // Attach user to the request object
    next();  // Proceed to the next middleware or route handler
  });
};
