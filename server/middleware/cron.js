import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Run every hour to check and update orders from "Pending" to "Delivered"
cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();
        const orders = await prisma.order.findMany({
            where: {
                status: "Pending",
                createdAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }, // 24 hours ago
            },
        });

        for (const order of orders) {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: "Delivered" },
            });
        }

        console.log(`✅ Updated ${orders.length} orders to Delivered`);
    } catch (error) {
        console.error("❌ Error updating orders:", error);
    }
});

export default cron;
