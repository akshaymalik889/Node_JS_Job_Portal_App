import express from "express";
import authRoutes from "./routes/auth.js";
import { connectKafka } from "./producer.js";
import cors from "cors";
const app = express();
app.use(express.json()); // use to read body of request
// cors
app.use(cors());
// kafka
connectKafka();
app.use("/api/auth", authRoutes);
export default app;
