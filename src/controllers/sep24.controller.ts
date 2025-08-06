import { Request, Response } from 'express';
import { StellarSep24Service } from '../chains/stellar/sep24.service';
import { getAnchorInstance } from '../chains/stellar/anchor';
import { Types } from '@stellar/typescript-wallet-sdk';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

dotenv.config();

const getServiceInstance = async (req: AuthenticatedRequest): Promise<StellarSep24Service> => {
  const anchor = await getAnchorInstance(process.env.ANCHOR_HOME_DOMAIN!);

  const token = req.authToken!;
  const account = req.stellarAccount!;

  const authToken: Types.AuthToken = {
    token,
    account,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    issuer: process.env.STELLAR_ANCHOR_ISSUER!,
    clientDomain: process.env.STELLAR_CLIENT_DOMAIN!,
    memo: process.env.STELLAR_DEFAULT_MEMO || '',
  } as any; // use `as any` if SDK enforces private fields

  return new StellarSep24Service(anchor, authToken);
};


export const depositAsset = async (req: Request, res: Response) => {
  try {
    const { assetCode, extraFields } = req.body;
    const sep24 = await getServiceInstance(req);
    const result = await sep24.deposit(assetCode, extraFields);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const withdrawAsset = async (req: Request, res: Response) => {
  try {
    const { assetCode } = req.body;
    const sep24 = await getServiceInstance(req);
    const result = await sep24.withdraw(assetCode);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sep24 = await getServiceInstance(req);
    const tx = await sep24.fetchTransactionById(id);
    res.json(tx);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchTransactionsByAsset = async (req: Request, res: Response) => {
  try {
    const { assetCode } = req.params;
    const sep24 = await getServiceInstance(req);
    const txs = await sep24.fetchTransactionsForAsset(assetCode);
    res.json(txs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


