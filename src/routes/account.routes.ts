import { Router } from 'express';
import {
  createAccount,
  getAccountDetails,
  getTransactions,
  fundAccount,
  createTrustline,
  removeTrustline,
  sendPayment,
} from '../controllers/account.controller';

const router = Router();

/**
 * @openapi
 * /api/account/create:
 *   get:
 *     summary: Create a new Stellar account
 *     tags:
 *       - Account
 *     responses:
 *       200:
 *         description: Returns a new Stellar keypair
 */
router.get('/create', createAccount);

/**
 * @openapi
 * /api/account/{publicKey}:
 *   get:
 *     summary: Get Stellar account details
 *     tags:
 *       - Account
 *     parameters:
 *       - in: path
 *         name: publicKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account details returned
 */
router.get('/:publicKey', getAccountDetails);

/**
 * @openapi
 * /api/account/{publicKey}/transactions:
 *   get:
 *     summary: Get recent transactions for account
 *     tags:
 *       - Account
 *     parameters:
 *       - in: path
 *         name: publicKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction history returned
 */
router.get('/:publicKey/transactions', getTransactions);

/**
 * @openapi
 * /api/account/{publicKey}/fund:
 *   get:
 *     summary: Fund a Stellar account via Friendbot
 *     tags:
 *       - Account
 *     parameters:
 *       - in: path
 *         name: publicKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account funded
 */
router.get('/:publicKey/fund', fundAccount);

/**
 * @openapi
 * /api/account/trustline/create:
 *   post:
 *     summary: Create a trustline to hold a token
 *     tags:
 *       - Trustline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicKey
 *               - secret
 *               - assetCode
 *               - issuer
 *             properties:
 *               publicKey:
 *                 type: string
 *               secret:
 *                 type: string
 *               assetCode:
 *                 type: string
 *               issuer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trustline created successfully
 */
router.post('/trustline/create', createTrustline);

/**
 * @openapi
 * /api/account/trustline/remove:
 *   post:
 *     summary: Remove a trustline for a token
 *     tags:
 *       - Trustline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicKey
 *               - secret
 *               - assetCode
 *               - issuer
 *             properties:
 *               publicKey:
 *                 type: string
 *               secret:
 *                 type: string
 *               assetCode:
 *                 type: string
 *               issuer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trustline removed successfully
 */
router.post('/trustline/remove', removeTrustline);


/**
 * @openapi
 * /api/account/payment/send:
 *   post:
 *     summary: Send a payment to another Stellar account
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderSecret
 *               - destination
 *               - amount
 *             properties:
 *               senderSecret:
 *                 type: string
 *               destination:
 *                 type: string
 *               amount:
 *                 type: string
 *               assetCode:
 *                 type: string
 *                 example: "USDC"
 *               issuer:
 *                 type: string
 *                 example: "GA5ZSEV...FOOBAR"
 *               memo:
 *                 type: string
 *                 example: "Thanks!"
 *     responses:
 *       200:
 *         description: Payment sent successfully
 *       500:
 *         description: Payment failed
 */
router.post('/payment/send', sendPayment);


export default router;
