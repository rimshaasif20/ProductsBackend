import express from "express";
import { RegisterUser, loginUser } from "../controllers/userController.js";
const router = express.Router();

router.post("/registeruser", RegisterUser);
router.post("/signIn", loginUser);

export default router;
