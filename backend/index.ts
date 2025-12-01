import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import dbConnect from "./src/config/dbConnect";
import authRoutes from "./src/routes/auth.routes";
import aiRoutes from "./src/routes/ai.routes";
import documentRoutes from "./src/routes/document.routes";

const app = express();



dotenv.config();
// Quick runtime check for essential env vars (masked for safety)
// const mask = (s?: string) => (s ? `${s.slice(0, 8)}...${s.slice(-4)}` : "<empty>");
// console.log("ENV check: DATABASE_URL present:", !!process.env.DATABASE_URL, "JWT_SECRET present:", !!process.env.JWT_SECRET);
// console.log("DATABASE_URL:", process.env.DATABASE_URL ? mask(process.env.DATABASE_URL) : process.env.DATABASE_URL);
// console.log("JWT_SECRET:", process.env.JWT_SECRET ? mask(process.env.JWT_SECRET) : process.env.JWT_SECRET);

// Fallback: if DATABASE_URL wasn't picked up by dotenv, try parsing it directly from the .env file
// if (!process.env.DATABASE_URL) {
//   try {
//     const fs = require('fs');
//     const p = require('path');
//     const envPath = p.resolve(process.cwd(), '.env');
//     if (fs.existsSync(envPath)) {
//       const envContents = fs.readFileSync(envPath, 'utf8');
//       const m = envContents.match(/^\s*DATABASE_URL\s*=\s*(.+)\s*$/m);
//       if (m && m[1]) {
//         let val: string = m[1].trim();
//         if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
//           val = val.slice(1, -1);
//         }
//         process.env.DATABASE_URL = val;
//         console.log('Fallback: loaded DATABASE_URL from .env (masked):', mask(process.env.DATABASE_URL));
//       }
//     }
//   } catch (err) {
//     console.error('Error while attempting fallback .env parse:', (err as any)?.message || err);
//   }
// }

const PORT: number | string = process.env.PORT || 5000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb", parameterLimit: 10000 }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ENVIRONMENT === "development"
      ? "http://localhost:8080"
      : "",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);

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