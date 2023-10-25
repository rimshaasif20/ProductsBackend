import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import ProtectRoute from "./middlewares/auth.js";
import CustomError from "./utils/CustomError.js";
import errorHandler from "./controllers/errorController.js";
import ProductRoutes from "./routes/productRoutes.js";
dotenv.config();
const app = express();

connectDB();
app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/products", ProductRoutes);
app.get("/task", ProtectRoute, (req, res) => {
  res.json({ message: "Protected route accessed successfully" });
});

// global error handling

app.all("*", (req, res, next) => {
  // const err = new Error(`cant find ${req.originalUrl} on the server`);
  // err.status = "fail";
  // err.statusCode = 404;
  const err = new CustomError(`cant find ${req.originalUrl} on the server`);

  next(err);
});

app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () =>
  console.log(`App is listening at http://localhost:${PORT}`)
);
