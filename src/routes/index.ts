import express from "express";

// Import route files BEFORE using them
import authRoutes from "./auth.routes";
import anchorRoutes from "./anchor.routes"; 
import accountRoutes from "./account.routes";
import swapRoutes from './swap.routes';
import sep24Routes from './sep24.routes';

// Declare router BEFORE using it
const router = express.Router();

// Register routes
router.use("/auth", authRoutes);
router.use("/anchor", anchorRoutes);
router.use("/account", accountRoutes);
router.use('/api', swapRoutes);
router.use('/api', sep24Routes);

export default router;

