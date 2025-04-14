import prisma from "../database/db.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { userschema, loginschema, checkoutSchema } from "../schema/user.schema.js";
import "dotenv/config";
import { z } from 'zod';
import cron from 'node-cron';
import nodemailer from "nodemailer";
import { Parser } from "json2csv"
import axios from "axios"
// import { ML_API } from '../config/ml-endpoints';

// const AXIOS_CONFIG = {
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// };
// import dotenv from "dotenv";
// dotenv.config();

// const mlAxios = axios.create({
//   baseURL: ML_API.BASE_URL,
//   timeout: ML_API.TIMEOUT
// });
class UserController {
  static async register(req, res) {
    try {
      const validatedData = userschema.parse(req.body);
      const { username, email, password, age, role, state, gender } = validatedData;

      // Role is always "user"
      // const role = "user"; 

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: "Email already in use" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      await prisma.user.create({
        data: { username, email, password: hashedPassword, age, role, state, gender },
      });

      res.status(201).json({ success: true, msg: "User registered successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Registration Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  // static async login(req, res) {
  //   try {
  //     const { username, password } = req.body;
  //     const login = loginschema.parse(req.body);

  //     const user = await prisma.user.findUnique({
  //       where: { username }
  //     });

  //     if (!user) {
  //       return res.status(404).json({ msg: "User not found" });
  //     }

  //     const comparepass = bcrypt.compareSync(password, user.password);
  //     if (!comparepass) {
  //       return res.status(401).json({ msg: "Invalid password" });
  //     }

  //     res.status(200).json({
  //       msg: "Login Successfully",
  //       data: user,
  //       userId: user.id,
  //       role: user.role // Identify if user is admin
  //     });
  //   } catch (error) {
  //     return res.status(500).json({ msg: error.message });
  //   }
  // }
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate request body
      const validation = loginschema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ msg: "Invalid input", errors: validation.error.errors });
      }

      // Find user in the database
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // 🚫 Ensure only users can log in (Admins are denied access)
      if (user.role !== "user") {
        return res.status(403).json({ msg: "Admins are not allowed to log in here" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ msg: "Invalid password" });
      }

      // Send response without exposing sensitive data
      res.status(200).json({
        msg: "Login Successfully",
        userId: user.id,
        username: user.username,
        role: user.role, // Confirm that the user is a normal user
      });

    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
  }

  static async adminLogin(req, res) {
    try {
      const { username, password, secretkey } = req.body;

      // Fetch admin data from the admin table
      const admin = await prisma.admin.findUnique({
        where: { username },
      });

      // Check if admin exists
      if (!admin) {
        return res.status(401).json({ msg: "Admin not found" });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return res.status(401).json({ msg: "Invalid password" });
      }

      // Check secret key
      if (secretkey !== admin.secretKey) {
        return res.status(401).json({ msg: "Invalid Secret Key" });
      }

      return res.status(200).json({
        msg: "Admin login successful",
        adminId: admin.id,
      });

    } catch (error) {
      console.error("Admin Login Error:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }

  // static async createAdmin(req, res) {
  //   try {
  //       const { username, email, password, secretKey } = req.body;

  //       // Check if admin already exists
  //       const existingAdmin = await prisma.admin.findUnique({ where: { username } });

  //       if (existingAdmin) {
  //           return res.status(400).json({ msg: "Admin already exists" });
  //       }

  //       // Hash the password
  //       const hashedPassword = await bcrypt.hash(password, 10);

  //       // Create new admin
  //       const admin = await prisma.admin.create({
  //           data: {
  //               username,
  //               email,
  //               password: hashedPassword,
  //               secretKey,
  //           },
  //       });

  //       return res.status(201).json({
  //           msg: "Admin created successfully",
  //           adminId: admin.id,
  //       });

  //   } catch (error) {
  //       console.error("Error creating admin:", error);
  //       return res.status(500).json({ msg: "Internal server error" });
  //   }
  // }


  static async adminDashboard(req, res) {
    try {
      // Fetch total users
      const totalUsers = await prisma.user.count();

      // Fetch churned users
      const churnedUsers = await prisma.user.count({ where: { churn: 1 } });

      // Calculate churn rate
      const churnRate = totalUsers > 0 ? ((churnedUsers / totalUsers) * 100).toFixed(2) : 0;

      res.status(200).json({
        totalUsers,
        churnedUsers,
        churnRate: `${churnRate}%`,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
  static async buynow(req, res) {
    const { productId, productType, quantity, name, email, mobile, address, paymentMethod } = req.body;

    if (!productId || !productType || !quantity || !name || !email || !mobile || !address || !paymentMethod) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Trim spaces and remove any non-numeric characters from mobile
    req.body.mobile = req.body.mobile.trim();

    console.log("Received Order Data:", req.body);

    try {
      const Data = checkoutSchema.parse(req.body); // Validate the req.body directly
      console.log("Validated Input:", Data);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "User with this email is not registered." });
      }

      if (user.email !== email) {
        return res.status(400).json({ message: "Entered email does not match registered email." });
      }

      // Ensure entered email matches the registered email
      if (user.email !== email) {
        return res.status(400).json({ message: "Entered email does not match registered email." });
      }

      const modelMapping = {
        MenProduct: prisma.menProduct,
        WomenProduct: prisma.womenProduct,
        KidsProduct: prisma.kidsProduct,
        AccessoriesProduct: prisma.accessoriesProduct,
        CosmeticsProduct: prisma.cosmeticsProduct,
      };

      const productModel = modelMapping[productType];
      if (!productModel) {
        return res.status(400).json({ message: `Invalid product type: ${productType}.` });
      }

      const product = await productModel.findUnique({
        where: { id: parseInt(productId, 10) },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        return res.status(400).json({ message: "Invalid quantity provided." });
      }

      const totalPrice = product.price * parsedQuantity;

      const newOrder = await prisma.order.create({
        data: {
          productId: parseInt(productId, 10),
          quantity: parsedQuantity,
          totalPrice,
          customerName: name,
          customerEmail: email,
          customerMobile: mobile,
          shippingAddress: address,
          paymentMethod,
          productType,
          status: "Pending",
        },
      });

      res.status(201).json({
        message: "Order placed successfully!",
        orderId: newOrder.id,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation Error", errors: error.errors });
      }
      res.status(500).json({
        message: "Failed to place order. Try again later.",
        error: error.message,
      });
    }
  }


  static async handleUserLogout(userId, sessionStartTime) {
    const date = new Date();  // Current date and time

    // Logic to calculate time spent during the session (in minutes)
    const timeSpentDuringSession = calculateTimeSpent(sessionStartTime, date);

    try {
      await prisma.userTimeSpent.upsert({
        where: {
          userId_date: {
            userId: userId,
            date: date.toISOString(),  // Use ISO format
          }
        },
        update: {
          timeSpent: {
            increment: timeSpentDuringSession
          }
        },
        create: {
          userId: userId,
          date: date.toISOString(),  // Use ISO format
          timeSpent: timeSpentDuringSession
        }
      });
      console.log(`User ${userId} session time updated successfully`);
    } catch (error) {
      console.error(`Error updating user ${userId} session time:`, error);
    }
  }

  // In userController.js
  // In userController.js
  // static async Profile(req, res) {
  //   const { type, id } = req.params;
  //   console.log(`API hit: /profile/${type}/${id}`); // Debugging line

  //   try {
  //     if (type === 'user') {
  //       const user = await prisma.user.findUnique({
  //         where: { id: parseInt(id) },
  //         select: { username: true, email: true }
  //       });

  //       if (!user) return res.status(404).json({ message: 'User not found' });
  //       return res.json(user);

  //     } else if (type === 'admin') {
  //       const admin = await prisma.admin.findUnique({
  //         where: { id: parseInt(id) },
  //         select: { username: true, email: true }
  //       });

  //       if (!admin) return res.status(404).json({ message: 'Admin not found' });
  //       return res.json(admin);

  //     } else {
  //       return res.status(400).json({ message: 'Invalid type' });
  //     }
  //   } catch (error) {
  //     console.error("Profile fetch error:", error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }
  static async Profile(req, res) {
    const { type, id } = req.params;
    console.log(`API hit: /profile/${type}/${id}`); // Debugging line
  
    try {
      if (type === 'user') {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) }, // Users have numeric IDs
          select: { username: true, email: true }
        });
  
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user);
  
      } else if (type === 'admin') {
        const admin = await prisma.admin.findUnique({
          where: { id: id.toString() }, // ✅ Fix: Use string, not parseInt
          select: { username: true, email: true }
        });
  
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        return res.json(admin);
  
      } else {
        return res.status(400).json({ message: 'Invalid type' });
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  



  // Example function to calculate time spent in minutes
  static async calculateTimeSpent(startTime, endTime) {
    const timeDiff = endTime - startTime;  // In milliseconds
    return Math.floor(timeDiff / 60000);  // Convert milliseconds to minutes
  }
  // Called every minute or periodically based on user activity
  // static async updateUserTimeSpent(userId) {
  //   const date = new Date();  // Current date and time
  //   const timeSpentIncrement = 1; // 1 minute increment

  //   await prisma.userTimeSpent.upsert({
  //     where: {
  //       userId_date: {
  //         userId: userId,
  //         date: date.toISOString(),  // Use ISO format
  //       }
  //     },
  //     update: {
  //       timeSpent: {
  //         increment: timeSpentIncrement
  //       }
  //     },
  //     create: {
  //       userId: userId,
  //       date: date.toISOString(),  // Use ISO format
  //       timeSpent: timeSpentIncrement
  //     }
  //   });
  // }
  static async sendContactForm(req, res) {
    const { name, email, mobile, message } = req.body;

    // Validate fields
    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail
          pass: process.env.EMAIL_PASS, // Your App Password
        },
      });

      // Email details
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: "ansarisadeem8879@gmail.com",
        subject: "New Contact Form Submission",
        text: `You have received a new message:
          Name: ${name}
          Email: ${email}
          Mobile: ${mobile}
          Message: ${message}`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending failed:", error);
      res.status(500).json({ success: false, message: "Error sending email" });
    }

  }
  static async updateUserTimeSpent(userId) {
    console.log("Updating time spent for user:", userId);

    if (!userId || isNaN(userId)) {
      console.error("Invalid userId detected:", userId);
      return;
    }
    const adminId = parseInt(req.admin?.id, 10);  // Extract admin ID (if admin)
    if (adminId) {
      console.log("Admin logged in, skipping user activity tracking.");
      return res.status(200).json({ msg: "Admin login detected, skipping tracking." });
    }

    const date = new Date();
    const timeSpentIncrement = 1; // 1-minute increment

    try {
      await prisma.userTimeSpent.upsert({
        where: {
          userId_date: {
            userId: Number(userId),
            date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
          }
        },
        update: {
          timeSpent: {
            increment: timeSpentIncrement
          }
        },
        create: {
          userId: Number(userId),
          date: date.toISOString().split("T")[0],
          timeSpent: timeSpentIncrement
        }
      });
    } catch (error) {
      console.error("Error updating time spent:", error);
    }
  }

  // static convertBigIntToString(obj) {
  //   if (typeof obj === "bigint") {
  //     return obj.toString();
  //   } else if (Array.isArray(obj)) {
  //     return obj.map(UserController.convertBigIntToString);
  //   } else if (typeof obj === "object" && obj !== null) {
  //     const newObj = {};
  //     for (const key in obj) {
  //       newObj[key] = UserController.convertBigIntToString(obj[key]);
  //     }
  //     return newObj;
  //   }
  //   return obj;
  // }


  // static convertBigIntToString(obj) {
  //   if (!obj) return obj;

  //   // Handle arrays
  //   if (Array.isArray(obj)) {
  //     return obj.map(item => this.convertBigIntToString(item));
  //   }

  //   // Handle objects
  //   if (typeof obj === 'object' && obj !== null) {
  //     const newObj = {};
  //     for (const key in obj) {
  //       if (obj.hasOwnProperty(key)) {
  //         newObj[key] = this.convertBigIntToString(obj[key]);
  //       }
  //     }
  //     return newObj;
  //   }

  //   // Handle bigints
  //   if (typeof obj === 'bigint') {
  //     return obj.toString();
  //   }

  //   return obj;
  // }


  // // 1️⃣ Get Churn Trends (Using ML Model)
  // static async getChurnTrends(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/churn-trends");
  //     res.status(200).json(UserController.convertBigIntToString(response.data));
  //   } catch (error) {
  //     console.error("Error fetching churn trends:", error);
  //     res.status(500).json({ error: error.message || "Internal Server Error" });
  //   }
  // }

  // // 2️⃣ Get High-Risk Customers (Using ML Model)
  // static async getHighRiskCustomers(req, res) {
  //   try {
  //     // Get predictions from ML model
  //     const response = await axios.get("http://127.0.0.1:5000/high-risk-customers");

  //     // The Flask endpoint should return formatted high-risk customers
  //     res.status(200).json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching high-risk customers:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // 3️⃣ Get Customer Segments (Using ML Model)
  // static async getCustomerSegments(req, res) {
  //   try {
  //     // Get segments from ML model
  //     const response = await axios.get("http://127.0.0.1:5000/customer-segments");

  //     res.status(200).json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching customer segments:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // 4️⃣ Get Retention Rate (Using ML Model)
  // static async getRetentionRate(req, res) {
  //   try {
  //     // Get retention rate from ML model
  //     const response = await axios.get("http://127.0.0.1:5000/retention-rate");

  //     res.status(200).json(response.data);
  //   } catch (error) {
  //     console.error("Error calculating retention rate:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // 5️⃣ Export Data (Using ML Model)
  // static async exportData(req, res) {
  //   try {
  //     const format = req.query.format || "json";

  //     if (!["json", "csv"].includes(format)) {
  //       return res.status(400).json({ error: "Invalid format specified" });
  //     }

  //     const response = await axios.get("http://127.0.0.1:5000/export-data", {
  //       ...AXIOS_CONFIG,
  //       params: { format }
  //     });

  //     if (format === "csv") {
  //       res.header("Content-Type", "text/csv");
  //       res.attachment("customers.csv");
  //       return res.send(response.data); // Assuming Flask already returns CSV
  //     }

  //     res.status(200).json(this.convertBigIntToString(response.data));
  //   } catch (error) {
  //     console.error("Error exporting data:", error);
  //     res.status(500).json({
  //       error: error.response?.data?.error || "Internal Server Error"
  //     });
  //   }
  // }
  // // 6️⃣ Get Customer Details (Using ML Model)
  // static async getCustomerDetails(req, res) {
  //   try {
  //     const { id } = req.params;

  //     // Validate ID
  //     if (!id || !/^\d+$/.test(id)) {
  //       return res.status(400).json({
  //         error: "Invalid customer ID",
  //         expected: "Numeric ID"
  //       });
  //     }

  //     const response = await axios.get(
  //       `${ML_API.BASE_URL}/customer/${id}`,
  //       { timeout: 3000 }
  //     );

  //     if (!response.data) {
  //       return res.status(404).json({ error: "Customer not found" });
  //     }

  //     res.status(200).json(this.convertBigIntToString(response.data));
  //   } catch (error) {
  //     // Handle different error cases
  //     if (error.code === 'ECONNABORTED') {
  //       return res.status(504).json({ error: "ML service timeout" });
  //     }
  //     if (error.response?.status === 404) {
  //       return res.status(404).json({ error: "Customer not found in ML service" });
  //     }

  //     console.error("Customer details error:", error);
  //     res.status(500).json({
  //       error: "Failed to get customer details",
  //       ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  //     });
  //   }
  // }
  // // 7️⃣ Get Churned Customers (Using ML Model)
  // static async getChurnedCustomers(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/churned-customers");
  //     res.status(200).json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching churned customers:", error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  // static async getChurnedUSer(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/churn-explanation/${id}");
  //     res.status(200).json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching churned customers:", error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }


  // // 8️⃣ Get Churn Count by State (Using ML Model)
  // static async getChurnByState(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/churn-state");
  //     res.json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching churn data by state:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // 9️⃣ Get Churn Count by Gender (Using ML Model)
  // static async getChurnByGender(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/churn-gender");
  //     res.json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching churn data by gender:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // 🔟 Get Churn by Age (Using ML Model)
  // static async getChurnByAge(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/churn-age");
  //     res.json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching churn data by age:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // 1️⃣1️⃣ Predict Customer Churn using ML Model
  // static async predictChurn(req, res) {
  //   try {
  //     const customerData = req.body;

  //     if (!customerData || Object.keys(customerData).length === 0) {
  //       return res.status(400).json({ error: "Invalid customer data" });
  //     }

  //     const response = await axios.post("http://127.0.0.1:5000/predict-churn", customerData);
  //     res.status(200).json(response.data);
  //   } catch (error) {
  //     console.error("Error predicting churn:", error.message);
  //     res.status(500).json({ error: "Prediction service unavailable" });
  //   }
  // }

  // // 1️⃣2️⃣ Get Total Customers (Using ML Model)
  // static async getTotalCustomers(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/total-customers");
  //     res.json(response.data);
  //   } catch (error) {
  //     console.error("Error fetching total and active customers:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // 1️⃣3️⃣ Get Stats (Using ML Model)
  // static async getStats(req, res) {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:5000/churn-stats");
  //     res.json(response.data);
  //   } catch (err) {
  //     console.error("❌ Error in getStats:", err);
  //     res.status(500).json({ error: err.message || "Internal Server Error" });
  //   }
  // }
  static convertBigIntToString(obj) {
    if (!obj) return obj;
    if (Array.isArray(obj)) return obj.map(item => this.convertBigIntToString(item));
    if (typeof obj === 'object') {
      return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, this.convertBigIntToString(v)]));
    }
    return typeof obj === 'bigint' ? obj.toString() : obj;
  }

  static ML_API_CONFIG = {
    BASE_URL: "http://127.0.0.1:5000",
    TIMEOUT: 60000, // increased to 60 seconds
    RETRIES: 3,
    RETRY_DELAY: 2000
  };


  static mlApi = axios.create({
    baseURL: UserController.ML_API_CONFIG.BASE_URL,
    timeout: UserController.ML_API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });

  static async callWithRetry(endpoint, options = {}) {
    let lastError;
    for (let attempt = 1; attempt <= UserController.ML_API_CONFIG.RETRIES; attempt++) {
      try {
        const response = await UserController.mlApi({ url: endpoint, ...options });
        return response.data;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for ${endpoint}:`, error.message);
        if (attempt < UserController.ML_API_CONFIG.RETRIES) {
          await new Promise(res => setTimeout(res, UserController.ML_API_CONFIG.RETRY_DELAY * attempt));
        }
      }
    }
    throw lastError || new Error(`Failed to call ${endpoint} after ${UserController.ML_API_CONFIG.RETRIES} attempts`);
  }

  static async getChurnTrends(req, res) {
    try {
      const data = await UserController.callWithRetry('/churn-trends');
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get churn trends");
    }
  }

  static async getHighRiskCustomers(req, res) {
    try {
      const data = await UserController.callWithRetry('/high-risk-customers');
      res.status(200).json({
        count: data.customers.length,
        customers: UserController.convertBigIntToString(data.customers),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get high-risk customers");
    }
  }

  static async getCustomerSegments(req, res) {
    try {
      const data = await UserController.callWithRetry('/customer-segments');
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get customer segments");
    }
  }

  static async getRetentionRate(req, res) {
    try {
      const data = await UserController.callWithRetry('/retention-rate');

      const processed = {
        retentionRate: parseFloat(data.retention_rate),
        churnRate: parseFloat(data.churn_rate),
        activeCustomers: data.active_customers,
        inactiveCustomers: data.inactive_customers,
        atRiskCustomers: data.at_risk_customers,
        newCustomers: data.new_customers,
        totalCustomers: data.total_customers,
        timestamp: data.timestamp
      };

      res.status(200).json(processed);
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to calculate retention rate");
    }
  }


  static async exportData(req, res) {
    try {
      const format = req.query.format || "json";
      if (!["json", "csv"].includes(format)) {
        return res.status(400).json({ error: "Invalid format", allowedFormats: ["json", "csv"] });
      }
      const data = await UserController.callWithRetry('/export-data', {
        params: { format },
        responseType: format === "csv" ? "stream" : "json"
      });
      if (format === "csv") {
        res.header("Content-Type", "text/csv");
        res.attachment("customer_churn_export.csv");
        return data.pipe(res);
      }
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Export failed");
    }
  }

  static async getCustomerDetails(req, res) {
    try {
      const { id } = req.params;
      const data = await UserController.callWithRetry(`/customer/${id}`);
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get customer details");
    }
  }

  static async getChurnedCustomers(req, res) {
    try {
      const data = await UserController.callWithRetry('/churned-customers');
      res.status(200).json({
        count: data.customers.length,
        customers: UserController.convertBigIntToString(data.customers),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get churned customers");
    }
  }

  static async getChurnedUser(req, res) {
    try {
      const { id } = req.params;
      const data = await UserController.callWithRetry(`/churn-explanation/${id}`);
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get churn explanation");
    }
  }

  static async getChurnByState(req, res) {
    try {
      const data = await UserController.callWithRetry('/churn-state');
      res.json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get churn by state");
    }
  }

  static async getChurnByGender(req, res) {
    try {
      const data = await UserController.callWithRetry('/churn-gender');
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get churn by gender");
    }
  }

  static async getChurnByAge(req, res) {
    try {
      const data = await UserController.callWithRetry('/churn-age');
      const processed = typeof data === 'string' ? JSON.parse(data) : data;
      res.status(200).json(UserController.convertBigIntToString(processed));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get age churn data");
    }
  }

  static async predictChurn(req, res) {
    try {
      const customerData = req.body;
      const data = await UserController.callWithRetry('/predict-churn', {
        method: 'post',
        data: customerData
      });
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Prediction failed");
    }
  }

  static async getTotalCustomers(req, res) {
    try {
      const data = await UserController.callWithRetry('/total-customers');
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get customer count");
    }
  }

  static async getStats(req, res) {
    try {
      const data = await UserController.callWithRetry('/churn-stats');
      res.status(200).json(UserController.convertBigIntToString(data));
    } catch (error) {
      UserController.handleErrorResponse(res, error, "Failed to get churn stats");
    }
  }

  static handleErrorResponse(res, error, defaultMessage) {
    const statusCode = error?.response?.status || 500;
    res.status(statusCode).json({
      error: defaultMessage,
      details: error.message
    });
  }
}


export default UserController;
