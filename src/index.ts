import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import connect_db from "./config/db.ts";
import chat from "./routes/chat.route.ts";
import cors from "cors";
import conversations from "./routes/conversation.route.ts";
import policy from "./routes/policy.route.ts";
import ticketRoutes from "./routes/ticket.route.ts";

//load .env file into envionment
process.loadEnvFile();

connect_db();
const app: Express = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

app.use("/api", chat);
app.use("/api/conversations", conversations);
app.use("/api/policy", policy);
app.use("/admin/tickets", ticketRoutes);
app.use(
  (req: Request, res: Response<{ message: String }>, next: NextFunction) => {
    res.status(404).json({ message: "No such route exist." });
  },
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
