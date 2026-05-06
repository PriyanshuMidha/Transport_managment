import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureDefaultTransports } from "./services/transportService.js";

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri);
    await ensureDefaultTransports();

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`Backend listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB using MONGO_URI", error.message);
    throw error;
  }
};

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
