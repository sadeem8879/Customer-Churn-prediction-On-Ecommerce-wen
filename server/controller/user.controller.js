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
  static async cart(req, res) {
    const { userId, productId, productType, quantity } = req.body;

    // Validate incoming data
    if (!userId || !productId || !productType || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    try {
      const existingCartItem = await prisma.cart.findFirst({
        where: { userId, productId, productType },
      });

      if (existingCartItem) {
        const updatedItem = await prisma.cart.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
        res.json(updatedItem);
      } else {
        const newCartItem = await prisma.cart.create({
          data: {
            userId: parseInt(userId, 10),
            productId: parseInt(productId, 10),
            quantity: parseInt(quantity, 10),
            productType,
          },
        });
        res.json(newCartItem);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Error adding to cart" });
    }
  }

  static async cart_fetch(req, res) {
    const { userId } = req.params;

    try {
      const cartItems = await prisma.cart.findMany({
        where: { userId: parseInt(userId) }, // Ensure `userId` is parsed as integer
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

      // Map cart items with appropriate product details
      const formattedCartItems = cartItems.map((item) => {
        let productDetails;
        switch (item.productType) {
          case "MenProduct":
            productDetails = item.menProduct;
            break;
          case "WomenProduct":
            productDetails = item.womenProduct;
            break;
          case "KidsProduct":
            productDetails = item.kidsProduct;
            break;
          case "AccessoriesProduct":
            productDetails = item.accessoriesProduct;
            break;
          case "CosmeticsProduct":
            productDetails = item.cosmeticsProduct;
            break;
          default:
            productDetails = null;
        }

        return {
          id: item.id,
          userId: item.userId,
          productType: item.productType,
          quantity: item.quantity,
          productDetails,
        };
      });

      res.json(formattedCartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ error: "Error fetching cart items" });
    }
  }



  static async cart_delete(req, res) {
    const { cartId } = req.params;

    try {
      const cartItem = await prisma.cart.findFirst({ where: { id: parseInt(cartId) } });
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

}

export default UserController;
