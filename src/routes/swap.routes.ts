import express from 'express';
import { swapTokens } from '../controllers/swap.controller';

const router = express.Router();

router.post('/swap', swapTokens);

export default router;

/**
 * @openapi
 * /api/swap/swap:
 *   post:
 *     summary: Swap tokens using Soroswap Aggregator
 *     tags:
 *       - Swap
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceAsset
 *               - destinationAsset
 *               - amount
 *               - sender
 *             properties:
 *               sourceAsset:
 *                 type: string
 *                 description: The asset contract ID or "native" for XLM
 *                 example: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
 *               destinationAsset:
 *                 type: string
 *                 description: The asset to receive in the swap
 *                 example: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV"
 *               amount:
 *                 type: string
 *                 description: The amount of the input asset to swap (in base units)
 *                 example: "10000000"
 *               sender:
 *                 type: string
 *                 description: The Stellar public key of the swap initiator
 *                 example: "GCFQBG..."
 *               recipient:
 *                 type: string
 *                 description: (Optional) The destination account to receive tokens
 *                 example: "GD5JZL..."
 *     responses:
 *       200:
 *         description: Swap transaction XDR and quote details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 xdr:
 *                   type: string
 *                   description: The XDR string of the transaction
 *                 quote:
 *                   type: object
 *                   description: The swap quote used to build the transaction
 *       400:
 *         description: Invalid request payload
 *       500:
 *         description: Server or swap failure
 */
