import express from "express";
import {
  addProduct,
  getAll,
  getAllProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/addProduct/:userId", addProduct);
router.get("/getAll/:userId", getAll);
router.get("/getAllProducts", getAllProducts);

export default router;
