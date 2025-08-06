import { Request, Response } from 'express';
import { Vault, SorobanNetwork } from 'defindex-sdk';
import { createSorobanContext } from '../utils/sorobanContext';

const vaultContractId = process.env.DEFINDEX_VAULT_ID || 'YOUR_CONTRACT_ID';

export const depositToVault = async (req: Request, res: Response) => {
  try {
    const { account, amount, secretKey } = req.body;

    if (!account || !amount || !secretKey) {
      return res.status(400).json({ error: 'Missing required fields: account, amount, or secretKey' });
    }

    const sorobanContext = await createSorobanContext();

    const vault = new Vault({
      network: SorobanNetwork.TESTNET,
      contractId: vaultContractId,
    });

    const txHash = await vault.deposit(
      account,
      Number(amount),
      true,
      sorobanContext,
      secretKey
    );

    return res.status(200).json({
      message: 'Deposit successful',
      txHash,
    });
  } catch (error: any) {
    console.error('Deposit error:', error);
    return res.status(500).json({
      error: error?.message || 'Deposit failed',
    });
  }
};
