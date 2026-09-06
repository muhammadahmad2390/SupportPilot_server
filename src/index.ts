import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import connect_db from "./config/db.ts";
import chat from "./routes/chat.route.ts";

//load .env file into envionment
process.loadEnvFile();

connect_db();
const app: Express = express();
app.use(express.json());

app.use("/api", chat);
app.use(
  (req: Request, res: Response<{ message: String }>, next: NextFunction) => {
    res.status(404).json({ message: "No such route exist." });
    next();
  },
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
