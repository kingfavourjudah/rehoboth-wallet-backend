import express from 'express';
import { depositToVault } from '../controllers/vault.controller';

const router = express.Router();

router.post('/deposit', depositToVault);

export default router;

/**
 * @openapi
 * /api/vault/deposit:
 *   post:
 *     summary: Deposit assets into DeFindex vault
 *     tags:
 *       - Vault
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - amount
 *               - secretKey
 *             properties:
 *               account:
 *                 type: string
 *                 example: 'GABC...'
 *               amount:
 *                 type: number
 *                 example: 100
 *               secretKey:
 *                 type: string
 *                 example: 'SB....'
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Deposit failed
 */
