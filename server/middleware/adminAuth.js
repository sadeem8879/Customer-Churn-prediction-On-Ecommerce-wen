// import prisma from "../database/db.js";

// const adminAuth = async (req, res, next) => {
//   try {
//     const userId = req.user.id; // Extracted from JWT token
//     const user = await prisma.user.findUnique({ where: { id: userId } });

//     if (!user || !user.isAdmin) {
//       return res.status(403).json({ error: "Access denied. Admins only." });
//     }

//     next(); // Allow access if user is an admin
//   } catch (error) {
//     console.error("Admin authentication error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export default adminAuth;
import prisma from "../database/db.js";
    const adminAuth = (req, res, next) => {
        const adminId = req.headers["admin-id"];
        console.log("Received Admin ID:", adminId);
    
        if (!adminId) {
            console.error("Unauthorized: Missing Admin ID");
            return res.status(401).json({ message: "Unauthorized - Admin ID missing" });
        }
    
        prisma.admin.findUnique({ where: { id: adminId } })
            .then(admin => {
                if (!admin) {
                    console.error("Unauthorized: Invalid Admin ID");
                    return res.status(403).json({ message: "Unauthorized - Invalid Admin" });
                }
                req.admin = admin;
                next();
            })
            .catch(error => {
                console.error("Server Error:", error);
                res.status(500).json({ error: "Server Error" });
            });
    };
    
  export default adminAuth