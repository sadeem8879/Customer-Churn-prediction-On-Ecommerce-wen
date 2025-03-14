import prisma from "../database/db.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { userschema, loginschema, checkoutSchema } from "../schema/user.schema.js";
import "dotenv/config";
import { z } from 'zod';
import cron from 'node-cron';

// import dotenv from "dotenv";
// dotenv.config();


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
  //   static async getChurnedCustomers(req, res) {
  //     try {
  //         const churnedCustomers = await prisma.$queryRaw`
  //             SELECT user_id, user_name, user_email, age, gender, state, total_orders, total_spent, recency_days, churn_risk
  //             FROM user_full_dataset
  //             WHERE churn_risk IN ('High Risk', 'Medium Risk')
  //         `;

  //         // Convert BigInt values to strings
  //         const formattedCustomers = churnedCustomers.map(customer => ({
  //             ...customer,
  //             user_id: customer.user_id.toString(), // Convert if it's BigInt
  //             total_orders: customer.total_orders.toString(),
  //             total_spent: customer.total_spent.toString(),
  //             recency_days: customer.recency_days.toString(),
  //         }));

  //         res.status(200).json(formattedCustomers);
  //     } catch (error) {
  //         console.error("Error fetching churned customers:", error);
  //         res.status(500).json({ message: "Internal Server Error" });
  //     }
  // }

  // // Get churn count grouped by state
  // static async getChurnByState(req, res) {
  //     try {
  //         const churnByState = await prisma.$queryRaw`
  //             SELECT state, COUNT(*) AS churn_count
  //             FROM user_full_dataset
  //             WHERE churn_risk IN ('High Risk', 'Medium Risk')
  //             GROUP BY state
  //         `;
  //         res.status(200).json(churnByState);
  //     } catch (error) {
  //         console.error("Error fetching churn data by state:", error);
  //         res.status(500).json({ error: "Internal Server Error" });
  //     }
  // }

  // // Get churn count grouped by gender
  // static async getChurnByGender(req, res) {
  //     try {
  //         const churnByGender = await prisma.$queryRaw`
  //             SELECT gender, COUNT(*) AS churn_count
  //             FROM user_full_dataset
  //             WHERE churn_risk IN ('High Risk', 'Medium Risk')
  //             GROUP BY gender
  //         `;
  //         res.status(200).json(churnByGender);
  //     } catch (error) {
  //         console.error("Error fetching churn data by gender:", error);
  //         res.status(500).json({ error: "Internal Server Error" });
  //     }
  // }

  // // Get churn count grouped by age
  // static async getChurnByAge(req, res) {
  //     try {
  //         const churnByAge = await prisma.$queryRaw`
  //             SELECT age, COUNT(*) AS churn_count
  //             FROM user_full_dataset
  //             WHERE churn_risk IN ('High Risk', 'Medium Risk')
  //             GROUP BY age
  //             ORDER BY age
  //         `;
  //         res.status(200).json(churnByAge);
  //     } catch (error) {
  //         console.error("Error fetching churn data by age:", error);
  //         res.status(500).json({ error: "Internal Server Error" });
  //     }
  // }

  // // Predict customer churn using external ML model
  // static async predictChurn(req, res) {
  //     try {
  //         const customerData = req.body;

  //         // Basic validation
  //         if (!customerData || Object.keys(customerData).length === 0) {
  //             return res.status(400).json({ error: "Invalid customer data" });
  //         }

  //         const response = await axios.post("http://127.0.0.1:5000/predict-churn", customerData);

  //         res.status(200).json(response.data);
  //     } catch (error) {
  //         console.error("Error predicting churn:", error.message);
  //         res.status(500).json({ error: "Prediction service unavailable" });
  //     }
  // // }
  // static async getChurnedCustomers(req, res) {
  //   try {
  //       const churnedCustomers = await prisma.$queryRaw`
  //           SELECT user_id, user_name, user_email, age, gender, state, total_orders, total_spent, recency_days
  //           FROM user_full_dataset
  //           WHERE 1=1; -- Assuming you want all customers for now, or add another condition
  //       `;

  //       // Convert BigInt values to strings, handling nulls
  //       const formattedCustomers = churnedCustomers.map(customer => ({
  //           ...customer,
  //           user_id: customer.user_id?.toString() || null, // Use optional chaining
  //           total_orders: customer.total_orders?.toString() || null, // Use optional chaining
  //           total_spent: customer.total_spent?.toString() || null, // Use optional chaining
  //           recency_days: customer.recency_days?.toString() || null, // Use optional chaining
  //       }));

  //       res.status(200).json(formattedCustomers);
  //   } catch (error) {
  //       console.error("Error fetching customers:", error);
  //       res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }


  // // Get churn count grouped by state (without churn_risk)
  // static async getChurnByState(req, res) {
  //   try {
  //     const result = await prisma.$queryRaw`
  //       SELECT state, COUNT(*) AS customer_count
  //       FROM user_full_dataset
  //       GROUP BY state
  //     `;

  //     // Convert BigInt to string
  //     const formattedResult = result.map(row => ({
  //       state: row.state,
  //       customer_count: row.customer_count.toString() // Convert BigInt to string
  //     }));

  //     res.json(formattedResult);
  //   } catch (error) {
  //     console.error("Error fetching customer data by state:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // Get churn count grouped by gender (without churn_risk)
  // static async getChurnByGender(req, res) {
  //   try {
  //     const adminId = req.headers["admin-id"]; // Get adminId from headers

  //     if (!adminId) {
  //       return res.status(400).json({ error: "Admin ID is required." });
  //     }

  //     const churnByGender = await prisma.$queryRaw`
  //       SELECT gender, COUNT(*) AS customer_count
  //       FROM user_full_dataset
  //       GROUP BY gender
  //     `;

  //     // Convert BigInt to string before sending
  //     const formattedChurnByGender = churnByGender.map(row => ({
  //       gender: row.gender,
  //       customer_count: row.customer_count.toString() // Convert BigInt to string
  //     }));

  //     res.json(formattedChurnByGender);
  //   } catch (error) {
  //     console.error("Error fetching churn data by gender:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  // static async getChurnByAge(req, res) {
  //   try {
  //       // Define the threshold for inactivity (e.g., 90 days)
  //       const churnThresholdDays = 90;

  //       // Get the total number of customers (using the view, but could be optimized)
  //       const totalCustomers = await prisma.$queryRaw`SELECT COUNT(DISTINCT user_id) FROM user_full_dataset`;
  //       // Convert BigInt to Number here
  //       const totalCustomersCount = Number(totalCustomers[0].count);

  //       const result = await prisma.$queryRaw`
  //           SELECT 
  //               age_group AS ageRange,
  //               COUNT(CASE 
  //                   WHEN last_order_date IS NULL AND last_login_date IS NULL OR
  //                        last_order_date < NOW() - INTERVAL '${churnThresholdDays} days' AND
  //                        last_login_date < NOW() - INTERVAL '${churnThresholdDays} days'
  //                   THEN user_id  -- Count the user ID if churned
  //               END) AS churned_customer_count
  //           FROM user_full_dataset
  //           GROUP BY age_group
  //           ORDER BY age_group
  //       `;

  //       // Calculate churn percentage
  //       const formattedResult = result.map((row) => {
  //           // Convert BigInt to Number here
  //           const churnedCount = Number(row.churned_customer_count);
  //           return {
  //               ageRange: row.agerange,
  //               customer_count: churnedCount.toString(),
  //               churnPercentage: ((churnedCount / totalCustomersCount) * 100).toFixed(2),
  //           };
  //       });

  //       res.json(formattedResult);
  //   } catch (error) {
  //       console.error("Error fetching customer data by age:", error);
  //       res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }
  // // Predict customer churn using external ML model
  // static async predictChurn(req, res) {
  //   try {
  //       const customerData = req.body;

  //       // Basic validation
  //       if (!customerData || Object.keys(customerData).length === 0) {
  //           return res.status(400).json({ error: "Invalid customer data" });
  //       }

  //       const response = await axios.post("http://127.0.0.1:5000/predict-churn", customerData);

  //       res.status(200).json(response.data);
  //   } catch (error) {
  //       console.error("Error predicting churn:", error.message);
  //       res.status(500).json({ error: "Prediction service unavailable" });
  //   }
  // }

  // static async getChurnedCustomers(req, res) {
  //   try {
  //       const churnedCustomers = await prisma.$queryRaw`
  //           SELECT user_id, user_name, user_email, age, gender, state, total_orders, total_spent, recency_days
  //           FROM user_full_dataset
  //           WHERE total_orders = 0 OR recency_days >= 90; -- Filtering churned customers
  //       `;

  //       // Convert BigInt values to strings
  //       const formattedCustomers = churnedCustomers.map(customer => ({
  //           ...customer,
  //           user_id: customer.user_id?.toString() || null,
  //           total_orders: customer.total_orders?.toString() || null,
  //           total_spent: customer.total_spent?.toString() || null,
  //           recency_days: customer.recency_days?.toString() || null,
  //       }));

  //       res.status(200).json(formattedCustomers);
  //   } catch (error) {
  //       console.error("Error fetching churned customers:", error);
  //       res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  // // Get churn count grouped by state
  // static async getChurnByState(req, res) {
  //   try {
  //       const result = await prisma.$queryRaw`
  //           SELECT state, COUNT(*) AS customer_count
  //           FROM user_full_dataset
  //           WHERE total_orders = 0 OR recency_days >= 90 -- Filtering churned customers
  //           GROUP BY state
  //       `;

  //       // Convert BigInt to string
  //       const formattedResult = result.map(row => ({
  //           state: row.state,
  //           customer_count: row.customer_count.toString()
  //       }));

  //       res.json(formattedResult);
  //   } catch (error) {
  //       console.error("Error fetching churn data by state:", error);
  //       res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // Get churn count grouped by gender
  // // Get churn count grouped by gender
  // static async getChurnByGender(req, res) {
  //   try {
  //       const result = await prisma.$queryRaw`
  //           SELECT LOWER(gender) AS gender, COUNT(*) AS customer_count
  //           FROM user_full_dataset
  //           WHERE total_orders = 0 OR recency_days >= 90 -- Filtering churned customers
  //           AND gender IS NOT NULL
  //           GROUP BY LOWER(gender)
  //       `;

  //       // Convert BigInt to string
  //       const formattedResult = result.map(row => ({
  //           gender: row.gender.charAt(0).toUpperCase() + row.gender.slice(1), // Capitalize first letter
  //           customer_count: row.customer_count.toString(),
  //       }));

  //       res.json(formattedResult);
  //   } catch (error) {
  //       console.error("Error fetching churn data by gender:", error);
  //       res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }


  // // Get churn count grouped by age range
  // static async getChurnByAge(req, res) {
  //   try {
  //       const result = await prisma.$queryRaw`
  //           SELECT age_group AS ageRange, COUNT(*) AS customer_count
  //           FROM user_full_dataset
  //           WHERE total_orders = 0 OR recency_days >= 90 -- Filtering churned customers
  //           GROUP BY age_group
  //           ORDER BY age_group
  //       `;

  //       // Convert BigInt to string
  //       const formattedResult = result.map(row => ({
  //           ageRange: row.agerange,
  //           customer_count: row.customer_count.toString()
  //       }));

  //       res.json(formattedResult);
  //   } catch (error) {
  //       console.error("Error fetching churn data by age:", error);
  //       res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  // // Predict customer churn using external ML model
  // static async predictChurn(req, res) {
  //   try {
  //       const customerData = req.body;

  //       // Basic validation
  //       if (!customerData || Object.keys(customerData).length === 0) {
  //           return res.status(400).json({ error: "Invalid customer data" });
  //       }

  //       const response = await axios.post("http://127.0.0.1:5000/predict-churn", customerData);

  //       res.status(200).json(response.data);
  //   } catch (error) {
  //       console.error("Error predicting churn:", error.message);
  //       res.status(500).json({ error: "Prediction service unavailable" });
  //   }
  // }

  static async getChurnedCustomers(req, res) {
    try {
      const churnedCustomers = await prisma.$queryRaw`
          SELECT 
              user_id, 
              user_name, 
              user_email, 
              age, 
              gender, 
              state, 
              total_orders, 
              total_spent, 
              recency_days, 
              total_logins, 
              total_time_spent, 
              avg_time_per_session, 
              abandoned_cart_count
          FROM user_full_dataset
          WHERE 
              (
                  -- Customers with NO purchases and LOW engagement
                  total_orders = 0
                  AND (total_logins <= 2 OR total_time_spent <= 5 OR avg_time_per_session <= 1 OR abandoned_cart_count >= 3)
              )
              OR 
              (
                  -- Customers inactive for 90+ days with low time spent
                  recency_days >= 90
                  AND total_time_spent <= 10
              )
          ORDER BY recency_days DESC, total_orders ASC;
      `;

      // Convert BigInt values to strings (if necessary)
      const formattedCustomers = churnedCustomers.map(customer => ({
        ...customer,
        user_id: customer.user_id?.toString() || null,
        total_orders: customer.total_orders?.toString() || null,
        total_spent: customer.total_spent?.toString() || null,
        recency_days: customer.recency_days?.toString() || null,
        total_logins: customer.total_logins?.toString() || null,
        total_time_spent: customer.total_time_spent?.toString() || null,
        avg_time_per_session: customer.avg_time_per_session?.toString() || null,
        abandoned_cart_count: customer.abandoned_cart_count?.toString() || null
      }));

      res.status(200).json(formattedCustomers);
    } catch (error) {
      console.error("Error fetching churned customers:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  // 2️⃣ Get Churn Count by State
  static async getChurnByState(req, res) {
    try {
      const result = await prisma.$queryRaw`
          SELECT state, COUNT(*) AS customer_count
          FROM user_full_dataset
          WHERE total_orders = 0 OR recency_days >= 90
          GROUP BY state
      `;

      const formattedResult = result.map(row => ({
        state: row.state,
        customer_count: row.customer_count.toString()
      }));

      res.json(formattedResult);
    } catch (error) {
      console.error("Error fetching churn data by state:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // 3️⃣ Get Churn Count by Gender
  static async getChurnByGender(req, res) {
    try {
      const result = await prisma.$queryRaw`
          SELECT LOWER(gender) AS gender, COUNT(*) AS customer_count
          FROM user_full_dataset
          WHERE (total_orders = 0 OR recency_days >= 90) AND gender IS NOT NULL
          GROUP BY LOWER(gender)
      `;

      const formattedResult = result.map(row => ({
        gender: row.gender.charAt(0).toUpperCase() + row.gender.slice(1),
        customer_count: row.customer_count.toString()
      }));

      res.json(formattedResult);
    } catch (error) {
      console.error("Error fetching churn data by gender:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async getChurnByAge(req, res) {
    try {
        const result = await prisma.$queryRaw`
            SELECT age_group AS ageRange,
                   COUNT(*) AS customer_count,
                   SUM(CASE WHEN total_orders = 0 OR recency_days >= 20 THEN 1 ELSE 0 END) AS churned_customers
            FROM user_full_dataset
            GROUP BY age_group
            ORDER BY age_group ASC
        `;

        const formattedData = result.map((entry) => {
            // Explicitly convert BigInt values to Number
            const churnedCustomers = Number(entry.churned_customers) || 0;
            const customerCount = Number(entry.customer_count) || 1; // Avoid division by zero

            // Calculate churn percentage safely
            const churnPercentage = (churnedCustomers / customerCount) * 100;

            return {
                ageRange: entry.ageRange ? entry.ageRange.trim() : "Unknown",
                churnPercentage: !isNaN(churnPercentage) ? parseFloat(churnPercentage.toFixed(2)) : 0,
            };
        });

        console.log("Formatted Churn by Age Data:", formattedData);
        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching churn data by age:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

  

  // 5️⃣ Predict Customer Churn using ML Model
  static async predictChurn(req, res) {
    try {
      const customerData = req.body;

      if (!customerData || Object.keys(customerData).length === 0) {
        return res.status(400).json({ error: "Invalid customer data" });
      }

      const response = await axios.post("http://127.0.0.1:5000/predict-churn", customerData);

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error predicting churn:", error.message);
      res.status(500).json({ error: "Prediction service unavailable" });
    }
  }
  static async getTotalCustomers(req, res) {
    try {
      const result = await prisma.$queryRaw`
          SELECT COUNT(*) AS total
          FROM "User"
      `;

      let total = result[0].total;

      if (typeof total === 'bigint') {
        total = total.toString();
      }

      res.json({ total });
    } catch (error) {
      console.error("Error fetching total customers:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }

  }

  static async getStats(req, res) {
    try {
      // Check if view exists before querying
      const viewCheck = await prisma.$queryRaw`
          SELECT EXISTS (
              SELECT 1 FROM pg_catalog.pg_views 
              WHERE viewname = 'user_full_dataset'
          ) AS view_exists;
      `;

      if (!viewCheck[0].view_exists) {
        return res.status(500).json({ error: "View 'user_full_dataset' does not exist" });
      }

      // Run the main query
      const result = await prisma.$queryRaw`
         SELECT
    state, gender, age, COUNT(*) AS total,
    SUM(CASE WHEN (total_logins < 1 AND avg_time_per_session < 60 AND abandoned_cart_count > 5) THEN 1 ELSE 0 END) AS high_risk,
    SUM(CASE WHEN (total_logins BETWEEN 1 AND 3 AND avg_time_per_session BETWEEN 60 AND 300 AND abandoned_cart_count BETWEEN 1 AND 5) THEN 1 ELSE 0 END) AS medium_risk,
    SUM(CASE WHEN (total_logins > 3 AND avg_time_per_session > 300) THEN 1 ELSE 0 END) AS low_risk
FROM user_full_dataset     
GROUP BY state, gender, age;

      `;

      // Format the response
      const formattedResult = result.map(row => ({
        state: row.state,
        gender: row.gender,
        age: row.age,
        total: Number(row.total),
        high_risk: Number(row.high_risk),
        medium_risk: Number(row.medium_risk),
        low_risk: Number(row.low_risk),
      }));

      res.json(formattedResult);
    } catch (err) {
      console.error("❌ Error in getStats:", err);
      res.status(500).json({ error: err.message || "Database error" });
    }
  }
}


export default UserController;
