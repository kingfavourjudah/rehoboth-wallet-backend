import { Request, Response } from 'express';
import {
  SoroswapSDK,
  SupportedNetworks,
  SupportedProtocols,
  TradeType,
  QuoteRequest,
} from '@soroswap/sdk';
import { config } from '../config';

import { TransactionBuilder, Keypair } from 'stellar-sdk';

const soroswapClient = new SoroswapSDK({
  apiKey: process.env.SOROSWAP_API_KEY!,
  defaultNetwork: config.soroswap.defaultNetwork,
});

/**
 * POST /api/swap
 * Swaps tokens using Soroswap Aggregator
 */
export const swapTokens = async (req: Request, res: Response) => {
  try {
    const {
      assetIn,
      assetOut,
      amount,
      senderSecret,
      recipient,
      protocols,
      slippageBps,
      memo,
    } = req.body;

    if (!assetIn || !assetOut || !amount || !senderSecret) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const senderKeypair = Keypair.fromSecret(senderSecret);
    const senderPublicKey = senderKeypair.publicKey();

    // Get quote
    const quote = await soroswapClient.quote({
      assetIn,
      assetOut,
      amount: BigInt(amount),
      tradeType: TradeType.EXACT_IN,
      protocols: protocols ?? [
        SupportedProtocols.SDEX,
        SupportedProtocols.SOROSWAP,
        SupportedProtocols.AQUA,
      ],
      slippageBps: slippageBps ?? '50', // default 0.5%
    });

    // Build transaction
    const buildResponse = await soroswapClient.build({
      quote,
      from: senderPublicKey,
      to: recipient ?? senderPublicKey,
    });

    // Deserialize XDR to Transaction object
    const transaction = TransactionBuilder.fromXDR(
    buildResponse.xdr,
    SupportedNetworks.TESTNET
    )

    // Sign the transaction
    transaction.sign(senderKeypair);

    // Serialize back to XDR
    const signedXdr = transaction.toXDR();

    // Send transaction
    const result = await soroswapClient.send(signedXdr, false);

    res.status(200).json({
      message: 'Swap completed successfully',
      result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Swap failed' });
  }
};
