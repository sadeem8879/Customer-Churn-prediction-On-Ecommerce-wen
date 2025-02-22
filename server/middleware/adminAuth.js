import prisma from "../database/db.js";

const adminAuth = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extracted from JWT token
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next(); // Allow access if user is an admin
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default adminAuth;
