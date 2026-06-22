import cron from "node-cron";

let cronStarted = false;

export function startCronJobs() {
  if (cronStarted) return;
  cronStarted = true;

  // Daily iiko sync at 03:00
  cron.schedule("0 3 * * *", async () => {
    console.log("[cron] Starting daily iiko sync...");
    try {
      const { POST } = await import("@/app/api/admin/sync-iiko/route");
      const res = await POST();
      const data = await res.json();
      console.log("[cron] iiko sync result:", data);
    } catch (error) {
      console.error("[cron] iiko sync failed:", error);
    }
  });

  console.log("[cron] Scheduled daily iiko sync at 03:00");
}
