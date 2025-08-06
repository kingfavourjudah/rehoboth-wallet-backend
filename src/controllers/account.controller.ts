import { Request, Response } from 'express';
import {
  Keypair,
  Server,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
} from 'stellar-sdk';
import axios from 'axios';
import { config } from '../config/env';

const server = new Server(config.stellar.horizonUrl);
const networkPassphrase = Networks.TESTNET;

/**
 * Create a new random Stellar account (keypair only)
 */
export const createAccount = async (_req: Request, res: Response) => {
  try {
    const pair = Keypair.random();
    res.json({ publicKey: pair.publicKey(), secret: pair.secret() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    res.status(400).json({ error: message });
  }
};

/**
 * Load account details from Horizon
 */
export const getAccountDetails = async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;
    const account = await server.loadAccount(publicKey);
    res.json(account);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(404).json({ error: message });
  }
};

/**
 * Get recent transaction history for a Stellar account
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;
    const transactions = await server
      .transactions()
      .forAccount(publicKey)
      .order('desc')
      .limit(10)
      .call();

    res.json(transactions.records);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

/**
 * Fund an account using the Stellar Testnet Friendbot
 */
export const fundAccount = async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;
    const response = await axios.get(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);

    res.status(200).json({
      message: 'Funding successful',
      result: response.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Friendbot error';
    res.status(500).json({ error: message });
  }
};

/**
 * Create a trustline so an account can hold a custom asset
 */
export const createTrustline = async (req: Request, res: Response) => {
  try {
    const { publicKey, secret, assetCode, issuer } = req.body;

    if (!publicKey || !secret || !assetCode || !issuer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const trustAsset = new Asset(assetCode, issuer);
    const account = await server.loadAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      networkPassphrase: Networks.TESTNET,
      fee: (await server.fetchBaseFee()).toString(),
    })
      .addOperation(
        Operation.changeTrust({
          asset: trustAsset,
        }),
      )
      .setTimeout(180)
      .build();

    tx.sign(Keypair.fromSecret(secret));
    const result = await server.submitTransaction(tx);

    res.status(200).json({
      message: 'Trustline created successfully',
      result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Trustline creation failed';
    res.status(500).json({ error: message });
  }
};

/**
 * Remove a trustline from the account by setting the limit to "0"
 */
export const removeTrustline = async (req: Request, res: Response) => {
  try {
    const { publicKey, secret, assetCode, issuer } = req.body;

    if (!publicKey || !secret || !assetCode || !issuer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const trustAsset = new Asset(assetCode, issuer);
    const account = await server.loadAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      networkPassphrase: Networks.TESTNET,
      fee: (await server.fetchBaseFee()).toString(),
    })
      .addOperation(
        Operation.changeTrust({
          asset: trustAsset,
          limit: '0', // Set limit to 0 to remove trustline
        }),
      )
      .setTimeout(180)
      .build();

    tx.sign(Keypair.fromSecret(secret));
    const result = await server.submitTransaction(tx);

    res.status(200).json({
      message: 'Trustline removed successfully',
      result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Trustline removal failed';
    res.status(500).json({ error: message });
  }
};


/**
 * Send payment from one Stellar address to another
 */
export const sendPayment = async (req: Request, res: Response) => {
  try {
    const {
      senderSecret,
      destination,
      amount,
      assetCode,    // optional: if not native, must include issuer
      issuer,       // optional
      memo,         // optional
    } = req.body;

    if (!senderSecret || !destination || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const senderKeypair = Keypair.fromSecret(senderSecret);
    const senderPublicKey = senderKeypair.publicKey();

    const senderAccount = await server.loadAccount(senderPublicKey);

    const fee = await server.fetchBaseFee();

    const builder = new TransactionBuilder(senderAccount, {
      fee: fee.toString(),
      networkPassphrase,
    });

    // Determine asset type
    const asset =
      assetCode && issuer
        ? new Asset(assetCode, issuer)
        : Asset.native();

    // Optional: attach memo
    if (memo) {
      builder.addMemo(Memo.text(memo));
    }

    builder.addOperation(
      Operation.payment({
        destination,
        amount: amount.toString(),
        asset,
      })
    );

    const tx = builder.setTimeout(180).build();
    tx.sign(senderKeypair);

    const result = await server.submitTransaction(tx);

    res.status(200).json({
      message: 'Payment successful',
      result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment failed';
    res.status(500).json({ error: message });
  }
};