import http from "http";
import app from "./app.js";
import config from "./app/config/index.js";
import { socketIO } from "./app/utils/socket.js";
import { seedSuperAdmin } from "./app/modules/supperAdmin/supper_admin.ts";

const port = config.port || 3000;

const bootstrap = async () => {
  try {
    const server = http.createServer(app);

    // Seed Super Admin — non-fatal: log and continue if it fails (e.g. pending migration)
    try {
      await seedSuperAdmin();
    } catch (seedError) {
      console.warn(
        "⚠️  Super Admin seed skipped:",
        seedError instanceof Error ? seedError.message : seedError,
      );
      console.warn(
        "   → Run `npm run migrate` to apply pending schema, then `npm run create` to seed.",
      );
    }

    // Initialize Socket.io
    socketIO(server);

    server.listen(port, () => {
      console.log(`⭐⭐ Example app listening on port ${port} ⭐⭐`);
    });

    // Handle server errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

      switch (error.code) {
        case "EACCES":
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Handle unhandled promise rejections
    process.on(
      "unhandledRejection",
      (reason: unknown, promise: Promise<unknown>) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
      },
    );

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:", error);
    });

    // Handle SIGTERM gracefully
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      process.exit(0);
    });

    // Handle SIGINT (Ctrl+C) gracefully
    process.on("SIGINT", () => {
      console.log("SIGINT signal received: closing HTTP server");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
};

bootstrap();
