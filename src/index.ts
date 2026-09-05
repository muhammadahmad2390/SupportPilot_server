import express from "express";
import type { Express } from "express";
import connect_db from "./config/db.ts";
import chat from "./routes/chat.route.ts";

//load .env file into envionment
process.loadEnvFile();

connect_db();
const app: Express = express();
app.use(express.json());

app.use("/api", chat);
const PORT = process.env.PORT || 8000;

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
