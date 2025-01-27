// import prisma from "../database/db.js"
// import bcrypt from "bcrypt"
// import { userschema, loginschema } from "../schema/user.schema.js"
// // import cors from "cors"
// import jwt from "jsonwebtoken"//jsonwebtoken required for encoding 
// import "dotenv/config"

// class userController {
//     static async register(req, res) {
//         const SECRET_KEY = process.env.SECRET_KEY;
//         try {
//             const { Username, email, password } = req.body

//             //zod
//             const parsed_data = userschema.parse(req.body)// it is used to parse /pass a data to userschemato validate it
//             console.log('the parsed data is:', parsed_data)

//             //bcrypt
//             const hashpassword = bcrypt.hashSync(password, 10)
//             const Register = await prisma.user.create({
//                 data: {
//                     Username,
//                     email,
//                     password: hashpassword
//                 }
//             })

//             const options = {// expiry date if not provided its stays foreer

//                 expiresIn: "1h"

//             }


//             // const token = jwt.sign(Register, SECRET_KEY, options)//it is a jwt method to encodeda data 
//             const token = jwt.sign(
//                 { id: Register.id, email: Register.email },
//                 SECRET_KEY,
//                 { expiresIn: "1h" }
//             );


//             //creating a cookie on browser/postman
//             res.cookie('authToken', token, {
//                 httpOnly: true,
//                 secure: false, // Set to true for HTTPS
//                 maxAge: 3600 * 1000,
//             })
//             return res.status(201).json({
//                 success: true,
//                 msg: "Login successfully", data: Register
//             })

//         } catch (error) {
//             return res.status(500).json({ msg: error.message })

//         }
//     }
//     // static async registerVerify(req, res) {
//     //     try {
//     //         const token = req.decodedToken; // Decoded token from middleware
//     //         return res.status(200).json({ msg: "Successful", token });
//     //     } catch (error) {
//     //         return res.status(500).json({ msg: error.message });
//     //     }
//     // }


//     static async login(req, res) {
//     try {
//         const { Username, password } = req.body

//         //zod
//         const parsed_data = loginschema.parse(req.body)// it is used to parse /pass a data to userschemato validate it
//         console.log('the parsed data is:', parsed_data)

//         //bcrypt
//         // const hashpassword = bcrypt.hashSync(password, 10)
//         const login = await prisma.user.findUnique({
//             where: {
//                 Username,
//             }
//         })

//         const compare_pass = bcrypt.compareSync(password, login.password)

//         if (!compare_pass) {
//             return res.status(401).json({ msg: "Invalid password" });
//         }

//         const token = req.decodedToken; // Decoded token from middleware
//         // return res.status(200).json({ msg: "Successful", token });
//         return res.status(201).json({
//             success: true,
//             msg: "Login successfully", data: login,token
//         })

//     } catch (error) {
//         return res.status(500).json({ msg: error.message })

//     }
// }

// // static async login(req, res) {
// //     try {
// //         const { Username, password } = req.body;

// //         // Check for existing token in the cookies (auto-login if token exists)
// //         const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];

// //         if (token) {
// //             try {
// //                 const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
// //                 console.log("Token is valid", decodedToken);

// //                 const user = await prisma.user.findUnique({
// //                     where: { id: decodedToken.id },
// //                 });

// //                 if (!user) {
// //                     return res.status(404).json({ msg: "User not found" });
// //                 }

// //                 // If the token is valid, return user data
// //                 return res.status(200).json({ msg: "User already logged in", user });
// //             } catch (error) {
// //                 return res.status(401).json({ msg: "Invalid or expired token" });
// //             }
// //         }

// //         // Proceed with login if no token is found
// //         const login = await prisma.user.findUnique({
// //             where: { Username },
// //         });

// //         if (!login) {
// //             return res.status(404).json({ msg: "User not found" });
// //         }

// //         const compare_pass = bcrypt.compareSync(password, login.password);
// //         if (!compare_pass) {
// //             return res.status(401).json({ msg: "Invalid password" });
// //         }

// //         // Generate a new token and store it in a cookie
// //         const newToken = jwt.sign(
// //             { id: login.id, email: login.email },
// //             process.env.SECRET_KEY,
// //             { expiresIn: "1h" }
// //         );

// //         res.cookie('authToken', newToken, {
// //             httpOnly: true,
// //             maxAge: 3600 * 1000 // 1 hour
// //         });

// //         return res.status(200).json({
// //             success: true,
// //             msg: "Login successfully",
// //             data: login,
// //             token: newToken
// //         });

// //     } catch (error) {
// //         return res.status(500).json({ msg: error.message });
// //     }
// // }

// static async getUserProfile(req, res) {
//     try {
//         // The user is automatically authenticated by the verifyJWT middleware
//         const user = req.user;  // The user object was attached by the middleware
//         return res.status(200).json({ msg: "User profile", user });
//     } catch (error) {
//         return res.status(500).json({ msg: error.message });
//     }
// }

// }

// export default userController

// // import prisma from "../database/db.js";
// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";
// // import "dotenv/config";
// // import { userschema, loginschema } from "../schema/user.schema.js";

// // class userController {
// //     static async register(req, res) {
// //         const SECRET_KEY = process.env.SECRET_KEY;
// //         try {
// //             const { Username, email, password } = req.body;

// //             // Validate data with Zod
// //             const parsed_data = userschema.parse(req.body);
// //             console.log("Parsed data:", parsed_data);

// //             // Hash the password
// //             const hashpassword = bcrypt.hashSync(password, 10);

// //             const Register = await prisma.user.create({
// //                 data: {
// //                     Username,
// //                     email,
// //                     password: hashpassword,
// //                 },
// //             });

// //             // Generate a token
// //             const token = jwt.sign({ id: Register.id, email: Register.email }, SECRET_KEY, { expiresIn: "1h" });
// //             console.log("Generated Token:", token);

// //             // Set token in cookies
// //             res.cookie("authToken", token, { httpOnly: true, maxAge: 3600 * 1000 });

// //             return res.status(201).json({ success: true, msg: "Registration successful", data: Register });
// //         } catch (error) {
// //             return res.status(500).json({ msg: error.message });
// //         }
// //     }

// //     // static async login(req, res) {
// //     //     try {
// //     //         const { Username, password } = req.body;

// //     //         // Step 1: Validate Input
// //     //         if (!Username || !password) {
// //     //             return res.status(400).json({ msg: "Please provide both Username and password" });
// //     //         }

// //     //         // Step 2: Check if User Exists
// //     //         const user = await prisma.user.findUnique({
// //     //             where: { Username },
// //     //         });

// //     //         if (!user) {
// //     //             return res.status(404).json({ msg: "User not found" });
// //     //         }

// //     //         // Step 3: Compare Password
// //     //         const isPasswordValid = bcrypt.compareSync(password, user.password);
// //     //         if (!isPasswordValid) {
// //     //             return res.status(401).json({ msg: "Invalid password" });
// //     //         }

// //     //         // Step 4: Generate JWT Token
// //     //         const SECRET_KEY = process.env.SECRET_KEY;
// //     //         if (!SECRET_KEY) {
// //     //             return res.status(500).json({ msg: "Server configuration error: Missing SECRET_KEY" });
// //     //         }

// //     //         const token = jwt.sign(
// //     //             { id: user.id, email: user.email },
// //     //             SECRET_KEY,
// //     //             { expiresIn: "1h" }
// //     //         );

// //     //         // Step 5: Set Cookie and Respond
// //     //         res.cookie("authToken", token, {
// //     //             httpOnly: true, // Prevent access from JavaScript in the browser
// //     //             maxAge: 3600 * 1000, // 1 hour
// //     //         });

// //     //         return res.status(200).json({
// //     //             success: true,
// //     //             msg: "Login successful",
// //     //             data: {
// //     //                 id: user.id,
// //     //                 Username: user.Username,
// //     //                 email: user.email,
// //     //             },
// //     //             token,
// //     //         });
// //     //     } catch (error) {
// //     //         console.error("Login Error:", error.message);
// //     //         return res.status(500).json({ msg: "An error occurred during login", error: error.message });
// //     //     }
// //     // }

// // static async login(req, res) {
// //     try {
// //         const { Username, password } = req.body;

// //         // Check for existing token in the cookies (auto-login if token exists)
// //         const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];

// //         if (token) {
// //             try {
// //                 const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
// //                 console.log("Token is valid", decodedToken);

// //                 const user = await prisma.user.findUnique({
// //                     where: { id: decodedToken.id },
// //                 });

// //                 if (!user) {
// //                     return res.status(404).json({ msg: "User not found" });
// //                 }

// //                 // If the token is valid, return user data
// //                 return res.status(200).json({ msg: "User already logged in", user });
// //             } catch (error) {
// //                 return res.status(401).json({ msg: "Invalid or expired token" });
// //             }
// //         }

// //         // Proceed with login if no token is found
// //         const login = await prisma.user.findUnique({
// //             where: { Username },
// //         });

// //         if (!login) {
// //             return res.status(404).json({ msg: "User not found" });
// //         }

// //         const compare_pass = bcrypt.compareSync(password, login.password);
// //         if (!compare_pass) {
// //             return res.status(401).json({ msg: "Invalid password" });
// //         }

// //         // Generate a new token and store it in a cookie
// //         const newToken = jwt.sign(
// //             { id: login.id, email: login.email },
// //             process.env.SECRET_KEY,
// //             { expiresIn: "1h" }
// //         );

// //         res.cookie('authToken', newToken, {
// //             httpOnly: true,
// //             maxAge: 3600 * 1000 // 1 hour
// //         });

// //         return res.status(200).json({
// //             success: true,
// //             msg: "Login successfully",
// //             data: login,
// //             token: newToken
// //         });

// //     } catch (error) {
// //         return res.status(500).json({ msg: error.message });
// //     }
// // }


// //     static async getUserProfile(req, res) {
// //         try {
// //             const user = req.user; // Retrieved from verifyJWT middleware
// //             return res.status(200).json({ msg: "User profile", user });
// //         } catch (error) {
// //             return res.status(500).json({ msg: error.message });
// //         }
// //     }
// // }

// // export default userController;






// import prisma from "../database/db.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { userschema, loginschema } from "../schema/user.schema.js";
// import "dotenv/config";

// class UserController {
//   static async register(req, res) {
//     const SECRET_KEY = process.env.SECRET_KEY;
//     try {
//       const { Username, email, password } = req.body;

//       // Validate input using Zod schema
//       userschema.parse(req.body);

//       // Hash the password
//       const hashedPassword = bcrypt.hashSync(password, 10);

//       // Create a new user
//       const newUser = await prisma.user.create({
//         data: { Username, email, password: hashedPassword },
//       });

//       // Generate a JWT token
//       const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

//       // Set the token in a cookie
//       res.cookie('authToken', token, {
//         httpOnly: true,
//         maxAge: 3600 * 1000, // 1 hour
//         secure: false, // Set to true in production
//         sameSite: 'lax', // Helps with CSRF protection
//       });

//       return res.status(201).json({
//         success: true,
//         message: 'Registration successful',
//         data: newUser,
//       });
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   }

//   static async login(req, res) {
//     const SECRET_KEY = process.env.SECRET_KEY;
//     try {
//         const { Username, password } = req.body;

//         // Validate input using Zod schema
//         loginschema.parse(req.body);

//         const parsed_data = loginschema.parse(req.body)// it is used to parse /pass a data to userschemato validate it
//                 console.log('the parsed data is:', parsed_data)

//                 //bcrypt
//                 // const hashpassword = bcrypt.hashSync(password, 10)


//                 const compare_pass = bcrypt.compareSync(password, login.password)

//                 if (!compare_pass) {
//                     return res.status(401).json({ msg: "Invalid password" });
//                 }

//                 // const token = req.decodedToken; // Decoded token from middleware
//                 const login = await prisma.user.findUnique({
//                   where: {
//                       Username,
//                       password:compare_pass,
//                   }
//               })
//                 // return res.status(200).json({ msg: "Successful", token });
//                 return res.status(201).json({
//                     success: true,
//                     msg: "Login successfully", data: login,token
//                 })

//         // Check if the user exists
//         const user = await prisma.user.findUnique({
//             where: { Username },
//         });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Compare passwords
//         const isPasswordValid = bcrypt.compareSync(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid password" });
//         }
//         const options={// expiry date if not provided its stays foreer

//           expiresIn:"1h"

//       }
//         // Generate a JWT token
//         const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY,options);
//         // const token=jwt.sign(user,SECRET_KEY,options)//it is a jwt method to encodeda data 


//         //creating a cookie on browser/postman
//         res.cookie('authToken',token,{
//             httpOnly:true,//means frontend dev also cant access it
//             maxAge:3600*1000// 1 hr
//         })

//         // Set the token in a cookie
//         // res.cookie("authToken", token, {
//         //     httpOnly: true,  // Makes the cookie inaccessible to JavaScript
//         //     secure: process.env.NODE_ENV === "production",  // Use 'secure' cookie in production
//         //     maxAge: 3600 * 1000, // 1 hour expiration
//         //     sameSite: "lax",  // Prevents CSRF attacks
//         // });

//         // Send response with user data and token
//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             data: {
//                 id: user.id,
//                 Username: user.Username,
//                 email: user.email,
//             },
//             token,  // Send the generated token
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }

//   // static async getUserProfile(req, res) {
//   //   try {
//   //     const token = req.cookies.authToken; // Access the token directly

//   //     if (!token) {
//   //       return res.status(401).json({ msg: "Token missing or invalid" });
//   //     }

//   //     // Optionally verify the token here or trust the middleware if already used
//   //     const decoded = jwt.verify(token, process.env.SECRET_KEY);

//   //     // Proceed with your logic, such as fetching user data from the database
//   //     const user = decoded;  // This is the decoded user information

//   //     return res.status(200).json({ message: "User profile retrieved", user });
//   //   } catch (error) {
//   //     return res.status(500).json({ message: error.message });
//   //   }
//   // }
// }

// export default UserController;

import prisma from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userschema, loginschema } from "../schema/user.schema.js";
import "dotenv/config";

class UserController {
  static async register(req, res) {

    try {
      // Check if user already exists
      const { username, email, password } = req.body;

      const Data = userschema.parse(req.body)

      const hashpass = bcrypt.hashSync(password, 10)
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      const Register = await prisma.user.create({
        data: {
          username,
          email,
          password: hashpass
        }
      })

      // if (Register) {
      //   return res.status(400).json({ error: "Username already exists" });
      // }

      res.status(201).json({ msg: "Login Successfully", data: Register })

      // Hash password
      // const hashedPassword = await bcrypt.hashSync(password, 10);

      // Create user
      // const newUser = await prisma.user.create({
      //   data: {
      //     username,
      //     email,
      //     password: hashedPassword,
      //   },
      // });

      // Generate JWT token
      // const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      // console.log("Generated Token:", token);

      // Send response with token
      // return res.status(201).json({ msg: "User registered successfully", token, newUser });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }


  static async login(req, res) {
    // const { email, password } = req.body;

    try {

      const { username, password } = req.body;

      const login = loginschema.parse(req.body)

      // const hashpass = bcrypt.hashSync(password, 10)

      const user = await prisma.user.findUnique({
        where: {
          username,
          // password
        }
      })

      if (!user) {
        alert("No user found with Username as", user.username)
      }

      const comparepass = bcrypt.compareSync(password, user.password)


      if (!comparepass) {
        alert("Please enter a valid Password")
      }

      res.status(200).json({
        msg: "Login Successfully",
        data: user,
        userId: user.id, // Add userId to the response
      });


      // Check for existing token in the cookies (auto-login if token exists)
      // const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];

      // if (token) {
      //   try {
      //     const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
      //     console.log("Token is valid", decodedToken);

      //     const user = await prisma.user.findUnique({
      //       where: { id: decodedToken.id },
      //     });

      //     if (!user) {
      //       return res.status(404).json({ msg: "User not found" });
      //     }

      //     // If the token is valid, return user data
      //     return res.status(200).json({ msg: "User already logged in", user });
      //   } catch (error) {
      //     return res.status(401).json({ msg: "Invalid or expired token" });
      //   }
      // }

      // // Proceed with login if no token is found
      // const login = await prisma.user.findUnique({
      //   where: { username },
      // });

      // if (!login) {
      //   return res.status(404).json({ msg: "User not found" });
      // }

      // const compare_pass = bcrypt.compareSync(password, login.password);
      // if (!compare_pass) {
      //   return res.status(401).json({ msg: "Invalid password" });
      // }

      // // Generate a new token and store it in a cookie
      // const newToken = jwt.sign(
      //   { id: login.id, email: login.email },
      //   process.env.SECRET_KEY,
      //   { expiresIn: "1h" }
      // );

      // res.cookie('authToken', newToken, {
      //   httpOnly: true,
      //   maxAge: 3600 * 1000 // 1 hour
      // });

      // return res.status(200).json({
      //   success: true,
      //   msg: "Login successfully",
      //   data: login,
      //   token: newToken
      // });

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }


  static async getUserProfile(req, res) {
    try {
      const userId = req.user.id; // Extracted from the token by `authenticateToken`
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, email: true, createdAt: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async menproduct(req, res) {
    try {
      const menProducts = await prisma.MenProduct.findMany()
      res.json(menProducts)


    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch men products' })

    }
  }


  static async womenproduct(req, res) {
    try {

      const womenProducts = await prisma.WomenProduct.findMany()
      res.json(womenProducts)

    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch men products' })

    }
  }

  static async kidsproduct(req, res) {
    try {
      const kidsProducts = await prisma.kidsProduct.findMany()
      res.json(kidsProducts)


    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch men products' })

    }
  }
  static async accessories(req, res) {
    try {
      const accessories = await prisma.AccessoriesProduct.findMany()
      res.json(accessories)

    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch men products' })

    }
  }

  static async cosmetics(req, res) {
    try {
      const cosmetics = await prisma.CosmeticsProduct.findMany()
      res.json(cosmetics)

    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch men products' })

    }
  }
  //   static async cart(req, res) {
  //     const { userId, quantity, productType, menProductId, womenProductId, kidsProductId, accessoriesProductId, cosmeticsProductId } = req.body;
  //     const parsedUserId = parseInt(userId, 10);
  //     try {
  //         const dataToCreate = {
  //             userId: parsedUserId,
  //             quantity: parseInt(quantity, 10),
  //             productType,
  //         };
  //         switch (productType) {
  //             case "MenProduct":
  //                 dataToCreate.menProductId = parseInt(menProductId, 10);
  //                 break;
  //             case "WomenProduct":
  //                 dataToCreate.womenProductId = parseInt(womenProductId, 10);
  //                 break;
  //             case "KidsProduct":
  //                 dataToCreate.kidsProductId = parseInt(kidsProductId, 10);
  //                 break;
  //             case "AccessoriesProduct":
  //                 dataToCreate.accessoriesProductId = parseInt(accessoriesProductId, 10);
  //                 break;
  //             case "CosmeticsProduct":
  //                 dataToCreate.cosmeticsProductId = parseInt(cosmeticsProductId, 10);
  //                 break;
  //             default:
  //                 return res.status(400).json({ message: "Invalid product type." });
  //         }

  //         console.log("Data being sent to create:", dataToCreate);
  //         const newCartItem = await prisma.cart.create({ data: dataToCreate });
  //         console.log("Cart item created:", newCartItem);
  //         res.status(201).json(newCartItem);
  //     } catch (error) {
  //         console.error("Error creating cart item:", error);
  //         res.status(500).json({ error: "Failed to add item to cart.", details: error.message });
  //     }
  //   // }
  //   static async cart(req, res) {
  //     const { userId, quantity, productType, menProductId, womenProductId, kidsProductId, accessoriesProductId, cosmeticsProductId } = req.body;
  //     const parsedUserId = parseInt(userId, 10);
  //     try {
  //       const dataToCreate = {
  //         userId: parsedUserId,
  //         quantity: parseInt(quantity, 10),
  //         productType,
  //       };

  //       switch (productType) {
  //         case "MenProduct":
  //           dataToCreate.menProduct = { connect: { id: parseInt(menProductId, 10) } }; // Connect the product
  //           break;
  //         case "WomenProduct":
  //           dataToCreate.womenProduct = { connect: { id: parseInt(womenProductId, 10) } };
  //           break;
  //         case "KidsProduct":
  //           dataToCreate.kidsProduct = { connect: { id: parseInt(kidsProductId, 10) } };
  //           break;
  //         case "AccessoriesProduct":
  //           dataToCreate.accessoriesProduct = { connect: { id: parseInt(accessoriesProductId, 10) } };
  //           break;
  //         case "CosmeticsProduct":
  //           dataToCreate.cosmeticsProduct = { connect: { id: parseInt(cosmeticsProductId, 10) } };
  //           break;
  //         default:
  //           return res.status(400).json({ message: "Invalid product type." });
  //       }

  //       console.log("Data being sent to create:", dataToCreate);
  //       const newCartItem = await prisma.cart.create({ data: dataToCreate, include: { menProduct: true, womenProduct: true, kidsProduct: true, accessoriesProduct: true, cosmeticsProduct: true } }); // Include here for immediate response
  //       console.log("Cart item created:", newCartItem);
  //       res.status(201).json(newCartItem);
  //     } catch (error) {
  //       console.error("Error creating cart item:", error);
  //       res.status(500).json({ error: "Failed to add item to cart.", details: error.message });
  //     }
  //   }
  //   // static async cart_fetch(req, res) {
  //   //   const { userId } = req.params;

  //   //   try {
  //   //     const cartItems = await prisma.cart.findMany({
  //   //       where: { userId: parseInt(userId) }, // Ensure `userId` is parsed as integer
  //   //       include: {
  //   //         menProduct: true,
  //   //         womenProduct: true,
  //   //         kidsProduct: true,
  //   //         accessoriesProduct: true,
  //   //         cosmeticsProduct: true,
  //   //       },
  //   //     });

  //   //     if (!cartItems || cartItems.length === 0) {
  //   //       return res.status(404).json({ message: "No items found in the cart." });
  //   //     }

  //   //     // Map cart items with appropriate product details
  //   //     const formattedCartItems = cartItems.map((item) => {
  //   //       let productDetails;
  //   //       switch (item.productType) {
  //   //         case "MenProduct":
  //   //           productDetails = item.menProduct;
  //   //           break;
  //   //         case "WomenProduct":
  //   //           productDetails = item.womenProduct;
  //   //           break;
  //   //         case "KidsProduct":
  //   //           productDetails = item.kidsProduct;
  //   //           break;
  //   //         case "AccessoriesProduct":
  //   //           productDetails = item.accessoriesProduct;
  //   //           break;
  //   //         case "CosmeticsProduct":
  //   //           productDetails = item.cosmeticsProduct;
  //   //           break;
  //   //         default:
  //   //           productDetails = null;
  //   //       }

  //   //       return {
  //   //         id: item.id,
  //   //         userId: item.userId,
  //   //         productType: item.productType,
  //   //         quantity: item.quantity,
  //   //         productDetails,
  //   //       };
  //   //     });

  //   //     res.json(formattedCartItems);
  //   //   } catch (error) {
  //   //     console.error("Error fetching cart items:", error);
  //   //     res.status(500).json({ error: "Error fetching cart items" });
  //   //   }
  //   // }


  //   static async cart_fetch(req, res) {
  //     const { userId } = req.params;

  //     try {
  //         const cartItems = await prisma.cart.findMany({
  //             where: { userId: parseInt(userId) },
  //             include: { // Correctly include related data
  //                 menProduct: true,
  //                 womenProduct: true,
  //                 kidsProduct: true,
  //                 accessoriesProduct: true,
  //                 cosmeticsProduct: true,
  //             },
  //         });

  //         if (!cartItems || cartItems.length === 0) {
  //             return res.status(404).json({ message: "No items found in the cart." });
  //         }

  //         res.json(cartItems); // Send the cartItems directly
  //     } catch (error) {
  //         console.error("Error fetching cart items:", error);
  //         res.status(500).json({ error: "Error fetching cart items" });
  //     }
  // }
  // static async cart(req, res) {
  //   const { userId, quantity, productType, menProductId, womenProductId, kidsProductId, accessoriesProductId, cosmeticsProductId } = req.body;

  //   try {
  //     let productConnectName; // This is the crucial variable
  //     let productIdName;

  //       const parsedUserId = parseInt(userId, 10);
  //       if (isNaN(parsedUserId)) {
  //           return res.status(400).json({ message: "Invalid userId provided." });
  //       }

  //       const dataToCreate = {
  //           user: { connect: { id: parsedUserId } },
  //           quantity: parseInt(quantity, 10),
  //           productType,
  //       };

  //       let productId; // Variable to hold the parsed product ID
  //       switch (productType) {
  //         case "MenProduct": 
  //             productIdName = "menProductId";
  //             productConnectName = "menProduct"; // Correct: lowercase 'm'
  //             break;
  //         case "WomenProduct": 
  //             productIdName = "womenProductId";
  //             productConnectName = "womenProduct"; // Correct: lowercase 'w'
  //             break;
  //         case "KidsProduct": 
  //             productIdName = "kidsProductId";
  //             productConnectName = "kidsProduct"; // Correct: lowercase 'k'
  //             break;
  //         case "AccessoriesProduct": 
  //             productIdName = "accessoriesProductId";
  //             productConnectName = "accessoriesProduct"; // Correct: lowercase 'a'
  //             break;
  //         case "CosmeticsProduct": 
  //             productIdName = "cosmeticsProductId";
  //             productConnectName = "cosmeticsProduct"; // Correct: lowercase 'c'
  //             break;
  //         default: return res.status(400).json({ message: "Invalid product type." });
  //     }

  //       // const productId = req.body[productIdName];

  //       // const productId = req.body[productIdName];

  //         if (!productId && productId !== 0) {
  //             return res.status(400).json({ message: `${productType}Id is required for ${productType}.` });
  //         }

  //         const parsedProductId = parseInt(productId, 10);
  //         if (isNaN(parsedProductId)) {
  //             return res.status(400).json({ message: `Invalid ${productType}Id provided. Must be a number.` });
  //         }

  //     dataToCreate[productConnectName] = { connect: { id: parsedProductId } }; // Use productConnectName!!!

  //     const newCartItem = await prisma.cart.create({ data: dataToCreate, include: {menProduct: true, womenProduct: true, kidsProduct: true, accessoriesProduct: true, cosmeticsProduct: true} });
  //     res.status(201).json(newCartItem);
  // } catch (error) {
  //       console.error("Error creating cart item:", error);
  //       res.status(500).json({ error: "Failed to add item to cart.", details: error.message });
  //   }
  // }
  // static async cart(req, res) {
  //   const { userId, quantity, productType } = req.body;

  //   try {
  //       const parsedUserId = parseInt(userId, 10);
  //       if (isNaN(parsedUserId)) {
  //           return res.status(400).json({ message: "Invalid userId provided." });
  //       }

  //       const dataToCreate = {
  //           user: { connect: { id: parsedUserId } },
  //           quantity: parseInt(quantity, 10),
  //           productType,
  //       };

  //       let productIdName;
  //       let productConnectName;

  //       switch (productType) {
  //           case "MenProduct":
  //               productIdName = "menProductId";
  //               productConnectName = "menProduct";
  //               break;
  //           case "WomenProduct":
  //               productIdName = "womenProductId";
  //               productConnectName = "womenProduct";
  //               break;
  //           case "KidsProduct":
  //               productIdName = "kidsProductId";
  //               productConnectName = "kidsProduct";
  //               break;
  //           case "AccessoriesProduct":
  //               productIdName = "accessoriesProductId";
  //               productConnectName = "accessoriesProduct";
  //               break;
  //           case "CosmeticsProduct":
  //               productIdName = "cosmeticsProductId";
  //               productConnectName = "cosmeticsProduct";
  //               break;
  //           default:
  //               return res.status(400).json({ message: "Invalid product type." });
  //       }

  //       const productId = req.body[productIdName];

  //       if (!productId && productId !== 0) {
  //           return res.status(400).json({ message: `${productType}Id is required for ${productType}.` });
  //       }

  //       const parsedProductId = parseInt(productId, 10);
  //       if (isNaN(parsedProductId)) {
  //           return res.status(400).json({ message: `Invalid ${productType}Id provided. Must be a number.` });
  //       }

  //       dataToCreate[productConnectName] = { connect: { id: parsedProductId } }; // Insert the line HERE

  //       const newCartItem = await prisma.cart.create({
  //           data: dataToCreate,
  //           include: {
  //               menProduct: true,
  //               womenProduct: true,
  //               kidsProduct: true,
  //               accessoriesProduct: true,
  //               cosmeticsProduct: true,
  //           },
  //       });
  //       res.status(201).json(newCartItem);
  //   } catch (error) {
  //       console.error("Error creating cart item:", error);
  //       res.status(500).json({ error: "Failed to add item to cart.", details: error.message });
  //   }
  // }
  static async cart(req, res) {
    const { userId, quantity, productType } = req.body;

    try {
      const parsedUserId = parseInt(userId, 10);
      if (isNaN(parsedUserId)) {
        return res.status(400).json({ message: "Invalid userId provided." });
      }

      let productIdName;
      let productConnectName;
      let includeOptions = {}; // Object to hold conditional include

      // Determine which product type to process
      switch (productType) {
        case "MenProduct":
          productIdName = "menProductId";
          productConnectName = "menProduct";
          includeOptions = { menProduct: true };
          break;
        case "WomenProduct":
          productIdName = "womenProductId";
          productConnectName = "womenProduct";
          includeOptions = { womenProduct: true };
          break;
        case "KidsProduct":
          productIdName = "kidsProductId";
          productConnectName = "kidsProduct";
          includeOptions = { kidsProduct: true };
          break;
        case "AccessoriesProduct":
          productIdName = "accessoriesProductId";
          productConnectName = "accessoriesProduct";
          includeOptions = { accessoriesProduct: true };  // Include if needed
          break;
        case "CosmeticsProduct":
          productIdName = "cosmeticsProductId";
          productConnectName = "cosmeticsProduct";
          includeOptions = { cosmeticsProduct: true };  // Include if needed
          break;
        default:
          return res.status(400).json({ message: "Invalid product type." });
      }

      // Get productId from request body
      const productId = req.body[productIdName];

      if (!productId && productId !== 0) {
        return res.status(400).json({ message: `${productType}Id is required for ${productType}.` });
      }

      const parsedProductId = parseInt(productId, 10);
      if (isNaN(parsedProductId)) {
        return res.status(400).json({ message: `Invalid ${productType}Id provided. Must be a number.` });
      }

      // Check if the product already exists in the cart
      const existingCartItem = await prisma.cart.findFirst({
        where: {
          userId: parsedUserId,
          [productConnectName]: { id: parsedProductId },
        },
      });

      // If the item exists in the cart, update the quantity
      if (existingCartItem) {
        const updatedCartItem = await prisma.cart.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + parseInt(quantity, 10),
            productType: productType  // Ensure productType is updated too
          },
          include: includeOptions, // Use the conditional include for product data
        });
        return res.status(200).json(updatedCartItem);
      } else {
        // If the item doesn't exist in the cart, create a new cart item
        const dataToCreate = {
          user: { connect: { id: parsedUserId } },
          quantity: parseInt(quantity, 10),
          [productConnectName]: { connect: { id: parsedProductId } },
          productType: productType,  // Pass productType here
        };

        const newCartItem = await prisma.cart.create({
          data: dataToCreate,
          include: includeOptions, // Use the conditional include for product data
        });
        return res.status(201).json(newCartItem);
      }
    } catch (error) {
      console.error("Error creating/updating cart item:", error);
      return res.status(500).json({ error: "Failed to add item to cart.", details: error.message });
    }
  }

  static async cart_fetch(req, res) {
    const { userId } = req.params;
    try {
      const cartItems = await prisma.cart.findMany({
        where: { user: { id: parseInt(userId) } }, // Use nested where for relations
        include: {
          menProduct: true,
          womenProduct: true,
          kidsProduct: true,
          accessoriesProduct: true,
          cosmeticsProduct: true,
        },
      });

      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ message: "No items found in the cart." });
      }

      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ error: "Error fetching cart items" });
    }
  }
  static async cart_delete(req, res) {
    const { cartId } = req.params;
    console.log("Deleting cart item with ID:", cartId); // Log cartId

    try {
      const cartItem = await prisma.cart.findFirst({ where: { id: parseInt(cartId) } });
      console.log("Cart item found:", cartItem); // Log the cart item

      if (!cartItem) {
        return res.status(404).json({ error: "Item not found in cart" });
      }

      await prisma.cart.delete({ where: { id: parseInt(cartId) } });
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ error: "Error removing item from cart" });
    }
  }


  static async cart_update(req, res) {
    try {
      const { quantity } = req.body;
      let { id } = req.params;
      id = parseInt(id);

      // Validate quantity
      if (!quantity || quantity < 1) {
        return res.status(400).json({ msg: "Invalid quantity." });
      }

      const updatedCartItem = await prisma.cart.update({
        where: { id },
        data: { quantity },
      });

      return res.status(200).json({ msg: "Updated successfully", data: updatedCartItem });
    } catch (error) {
      console.error("Error updating cart item:", error);
      return res.status(500).json({ msg: error.message });
    }
  }
  // static async buynow(req, res) {
  //   const { productId, productType, quantity, name, email, address, paymentMethod } = req.body;
  //   //  const { product, quantity, formData } = req.body;

  //   // if (!product || !quantity || !formData) {
  //   //   return res.status(400).json({ message: "Missing required fields." });
  //   // }
  //   // Validate incoming request
  //   if (!productId || !productType || !quantity || !name || !email || !address || !paymentMethod) {
  //     return res.status(400).json({ message: "All fields are required." });
  //   }

  //   try {
  //     // Dynamically determine the product model based on productType
  //     const productModel = prisma[`${productType.toLowerCase()}Product`];

  //     // Validate productType
  //     if (!productModel) {
  //       return res.status(400).json({ message: "Invalid product type." });
  //     }

  //     // Fetch product details
  //     const product = await productModel.findUnique({
  //       where: { id: productId },
  //     });

  //     if (!product) {
  //       return res.status(404).json({ message: "Product not found." });
  //     }

  //     // Calculate total price
  //     const totalPrice = product.price * quantity;

  //     // Store order details in the database
  //     const newOrder = await prisma.order.create({
  //       data: {
  //         productId,
  //         quantity,
  //         totalPrice,
  //         customerName: name,
  //         customerEmail: email,
  //         shippingAddress: address,
  //         paymentMethod,
  //         status: "Pending", // Initial status
  //       },
  //     });

  //     // Respond with success message
  //     res.status(201).json({
  //       message: "Order placed successfully!",
  //       orderId: newOrder.id,
  //     });
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     res.status(500).json({ message: "Failed to place order. Try again later." });
  //   }
  // }

  // static async buynow(req, res) {
  //   const { productId, productType, quantity, name, email, address, paymentMethod } = req.body;

  //   // Validate the input
  //   if (!productId || !productType || !quantity || !name || !email || !address || !paymentMethod) {
  //     return res.status(400).json({ message: "All fields are required." });
  //   }
  
  //   try {
  //     // Determine the correct product model dynamically
  //     const productModelName = `${productType.charAt(0).toLowerCase() + productType.slice(1)}Product`; 
  //     const productModel = prisma[productModelName];
  
  //     if (!productModel) {
  //       return res.status(400).json({ message: `Invalid product type: ${productType}. Expected types like MenProduct, WomenProduct etc.` });
  //     }
  
  //     const parsedProductId = parseInt(productId, 10);
  //     if (isNaN(parsedProductId)) {
  //       return res.status(400).json({ message: "Invalid productId provided." });
  //     }
  
  //     const product = await productModel.findUnique({
  //       where: { id: parsedProductId },
  //     });
  
  //     if (!product) {
  //       return res.status(404).json({ message: "Product not found." });
  //     }
  
  //     const parsedQuantity = parseInt(quantity, 10);
  //     if (isNaN(parsedQuantity) || parsedQuantity < 1) {
  //       return res.status(400).json({ message: "Invalid quantity provided." });
  //     }
  
  //     const totalPrice = product.price * parsedQuantity;
  
  //     // Create a new order in the database
  //     const newOrder = await prisma.order.create({
  //       data: {
  //         productId: parsedProductId,
  //         quantity: parsedQuantity,
  //         totalPrice,
  //         customerName: name,
  //         customerEmail: email,
  //         shippingAddress: address,
  //         paymentMethod,
  //         productType, 
  //       },
  //     });
  
  //     res.status(201).json({
  //       message: "Order placed successfully!",
  //       orderId: newOrder.id,
  //     });
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     res.status(500).json({ message: "Failed to place order. Try again later.", error: error.message });
  //   }
  // }
  static async buynow(req, res) {
    const { productId, productType, quantity, name, email, address, paymentMethod } = req.body;

    // Validate the input
    if (!productId || !productType || !quantity || !name || !email || !address || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Log incoming request data for debugging
    console.log("Received request:", req.body);

    // List of valid product types
    const validProductTypes = ["Men", "Women", "Cosmetics", "Kids","Accessories"]; // Add other types as needed

    // Ensure the productType is valid
    if (!validProductTypes.includes(productType)) {
        console.error(`Invalid product type: ${productType}`);
        return res.status(400).json({ message: `Invalid product type: ${productType}. Expected types: Men, Women, Cosmetics, Kids.` });
    }

    try {
        // Dynamically determine the correct product model
        const productModelName = `${productType.charAt(0).toLowerCase() + productType.slice(1)}Product`;
        const productModel = prisma[productModelName];

        // Log the dynamic model lookup for debugging
        console.log("Using product model:", productModelName);

        if (!productModel) {
            console.error(`Product model for type "${productType}" does not exist.`);
            return res.status(400).json({ message: `Product type "${productType}" does not exist in the model.` });
        }

        // Parse productId and quantity
        const parsedProductId = parseInt(productId, 10);
        if (isNaN(parsedProductId)) {
            return res.status(400).json({ message: "Invalid productId provided." });
        }

        // Find the product in the database
        const product = await productModel.findUnique({
            where: { id: parsedProductId },
        });

        // Log the found product for debugging
        console.log("Product found:", product);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Validate quantity
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ message: "Invalid quantity provided." });
        }

        const totalPrice = product.price * parsedQuantity;

        // Create a new order in the database
        const newOrder = await prisma.order.create({
            data: {
                productId: parsedProductId,
                quantity: parsedQuantity,
                totalPrice,
                customerName: name,
                customerEmail: email,
                shippingAddress: address,
                paymentMethod,
                productType, // Ensure the correct product type is stored
            },
        });

        // Return a success response
        res.status(201).json({
            message: "Order placed successfully!",
            orderId: newOrder.id,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Failed to place order. Try again later.", error: error.message });
    }
}

}

export default UserController;
