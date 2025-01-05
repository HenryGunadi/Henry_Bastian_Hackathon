import cron from "node-cron";
import mongoose from "mongoose";
import Order from "../models/order"; // Adjust path to where your Order model is

// Schedule the cron job to run every minute
export default function startCronJob() {
  cron.schedule("* * * * *", async () => {
    console.log("Cron job is running...");
    try {
      // Get current time
      const now = new Date();

      // Update orders with expired deadlines
      const result = await Order.updateMany({ deadline: { $lte: now }, status: "ongoing" }, { $set: { status: "terminated" } });

      console.log(`Updated ${result.modifiedCount} orders to 'terminated'`);
    } catch (err) {
      console.error("Error updating expired orders:", err);
    }
  });
}
