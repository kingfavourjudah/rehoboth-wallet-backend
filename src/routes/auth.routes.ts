import express from "express";
import { getAuthService } from "../services/auth.service";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

const router = express.Router();

/**
 * @swagger
 * /api/auth/challenge:
 *   get:
 *     summary: Generate a challenge transaction for wallet authentication
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: account
 *         schema:
 *           type: string
 *         required: true
 *         description: Stellar wallet public key
 *       - in: query
 *         name: chain
 *         schema:
 *           type: string
 *         required: false
 *         description: Blockchain type (e.g. 'stellar')
 *     responses:
 *       200:
 *         description: Challenge transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: string
 *       400:
 *         description: Missing account
 *       500:
 *         description: Internal server error
 */
router.get("/challenge", async (req, res) => {
  const { account, chain = config.defaultChain } = req.query;

  if (!account) {
    return res.status(400).json({ error: "Missing account" });
  }

  const authService = getAuthService(chain as string);

  try {
    const challenge = await authService.getChallenge(account as string);
    res.json({ transaction: challenge });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Verify signed challenge and issue JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transaction
 *             properties:
 *               transaction:
 *                 type: string
 *                 description: Signed challenge transaction XDR
 *               chain:
 *                 type: string
 *                 description: Blockchain type (e.g. 'stellar')
 *     responses:
 *       200:
 *         description: JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing transaction
 *       401:
 *         description: Invalid signature
 */
router.post("/token", async (req, res) => {
  const { transaction, chain = config.defaultChain } = req.body;

  if (!transaction) {
    return res.status(400).json({ error: "Missing transaction" });
  }

  const authService = getAuthService(chain as string);

  try {
    const walletAddress = await authService.verifyChallenge(transaction);
    const token = jwt.sign(
      { sub: walletAddress, chain },
      config.jwtSecret,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: "Invalid signature" });
  }
});



export default router;

