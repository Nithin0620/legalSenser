import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import dbConnect from "./src/config/dbConnect";
import authRoutes from "./src/routes/auth.routes";
import aiRoutes from "./src/routes/ai.routes";
import documentRoutes from "./src/routes/document.routes";
import dashboardRoutes from "./src/routes/dashboard.routes";
import profileRoutes from "./src/routes/profile.routes";

const app = express();

dotenv.config();

const PORT: number | string = process.env.PORT || 5000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb", parameterLimit: 10000 }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL || "",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.ENVIRONMENT === "development" || allowedOrigins.includes(origin) || !process.env.ENVIRONMENT) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(
    `<h1> This is homepage, response from server. Hence, the server is up and running. <h1/>`
  );
});

app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started at port No: ${PORT}`);
  dbConnect();
});


//  npm install -D ts-node typescript @types/node
//  npx ts-node index.ts