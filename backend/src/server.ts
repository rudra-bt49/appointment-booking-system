import app from "./app";
import { initCleanupCron } from "./services/cleanup.service";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // start cleanup cron after server starts
  initCleanupCron();
});
