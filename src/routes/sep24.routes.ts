import express from 'express';
import {
  depositAsset,
  withdrawAsset,
  fetchTransaction,
  fetchTransactionsByAsset,
} from '../controllers/sep24.controller';
import { validateSep10Token } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/deposit', validateSep10Token, depositAsset);
router.post('/withdraw', validateSep10Token, withdrawAsset);
router.get('/transaction/:id', validateSep10Token, fetchTransaction);
router.get('/transactions/:assetCode', validateSep10Token, fetchTransactionsByAsset);

export default router;

/**
 * @openapi
 * /api/sep24/deposit:
 *   post:
 *     summary: Deposit an asset using SEP-24
 *     tags:
 *       - SEP-24
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetCode:
 *                 type: string
 *                 example: USDC
 *               extraFields:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Deposit transaction initiated
 */

/**
 * @openapi
 * /api/sep24/withdraw:
 *   post:
 *     summary: Withdraw an asset using SEP-24
 *     tags:
 *       - SEP-24
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetCode:
 *                 type: string
 *                 example: USDC
 *     responses:
 *       200:
 *         description: Withdraw transaction initiated
 */

/**
 * @openapi
 * /api/sep24/transaction/{id}:
 *   get:
 *     summary: Fetch a SEP-24 transaction by ID
 *     tags:
 *       - SEP-24
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SEP-24 transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 */

/**
 * @openapi
 * /api/sep24/transactions/{assetCode}:
 *   get:
 *     summary: Fetch SEP-24 transactions for a specific asset
 *     tags:
 *       - SEP-24
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The asset code (e.g., USDC)
 *     responses:
 *       200:
 *         description: List of transactions
 */
