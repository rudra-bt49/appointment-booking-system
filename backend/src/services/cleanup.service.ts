import cron from "node-cron";
import prisma from "../config/prisma";

export async function cleanStaleTimeSlots(): Promise<number> {
  try {
    const now = new Date();

    const result = await prisma.timeSlot.deleteMany({
      where: {
        isAvailable: true,
        availability: {
          date: {
            lt: now,
          },
        },
      },
    });

    console.log(`✅ Deleted ${result.count} stale available time slot(s)`);
    return result.count;
  } catch (err) {
    console.error("⚠️ Error cleaning stale time slots:", err);
    throw err;
  }
}

export function initCleanupCron() {
  // Runs every day at 00:00 server local time
  cron.schedule(
    "0 10 * * *",
    async () => {
      console.log("🧹 Running cleanup cron: removing stale available time slots...");
      try {
        await cleanStaleTimeSlots();
      } catch (err) {
        console.error("Cleanup cron failed:", err);
      }
    }
  );

  // Also run once at startup
  cleanStaleTimeSlots().catch((err) => console.error(err));
}
