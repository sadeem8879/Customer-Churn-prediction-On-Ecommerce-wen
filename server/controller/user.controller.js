import prisma from "../database/db.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
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
  static async buynow(req, res) {
    const { productId, productType, quantity, name, email, address, paymentMethod } = req.body;

    // Validate input data
    if (!productId || !productType || !quantity || !name || !email || !address || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Mapping for product models in Prisma
        const modelMapping = {
            MenProduct: prisma.menProduct,
            WomenProduct: prisma.womenProduct,
            KidsProduct: prisma.kidsProduct,
            AccessoriesProduct: prisma.accessoriesProduct,
            CosmeticsProduct: prisma.cosmeticsProduct
        };

        // Check if productType is valid
        const productModel = modelMapping[productType];
        if (!productModel) {
            return res.status(400).json({ 
                message: `Invalid product type: ${productType}. Expected types: ${Object.keys(modelMapping).join(", ")}.` 
            });
        }

        // Validate productId
        const parsedProductId = parseInt(productId, 10);
        if (isNaN(parsedProductId)) {
            return res.status(400).json({ message: "Invalid productId provided." });
        }

        // Fetch product details
        const product = await productModel.findUnique({
            where: { id: parsedProductId },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Validate quantity
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ message: "Invalid quantity provided." });
        }

        // Calculate total price
        const totalPrice = product.price * parsedQuantity;

        // Create new order in Prisma
        const newOrder = await prisma.order.create({
            data: {
                productId: parsedProductId,
                quantity: parsedQuantity,
                totalPrice,
                customerName: name,
                customerEmail: email,
                shippingAddress: address,
                paymentMethod,
                productType,
            },
        });

        // Send success response
        res.status(201).json({
            message: "Order placed successfully!",
            orderId: newOrder.id,
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ 
            message: "Failed to place order. Try again later.", 
            error: error.message 
        });
    }
}

static async  handleUserLogout(userId, sessionStartTime) {
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
static async  updateUserTimeSpent(userId) {
  const date = new Date();  // Current date and time
  const timeSpentIncrement = 1; // 1 minute increment

  await prisma.userTimeSpent.upsert({
    where: {
      userId_date: {
        userId: userId,
        date: date.toISOString(),  // Use ISO format
      }
    },
    update: {
      timeSpent: {
        increment: timeSpentIncrement
      }
    },
    create: {
      userId: userId,
      date: date.toISOString(),  // Use ISO format
      timeSpent: timeSpentIncrement
    }
  });
}



}

export default UserController;
