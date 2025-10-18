import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import dbConnect from "./config/dbConnect";

const app = express();



dotenv.config();

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