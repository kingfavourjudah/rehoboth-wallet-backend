// import { Request, Response } from 'express';
// import { StellarRecoveryService } from '../chains/stellar/recovery.service';
// import { Recovery, Types } from '@stellar/typescript-wallet-sdk';
// import { Keypair } from '@stellar/stellar-sdk';

// // Initialize Recovery instance with appropriate parameters
// // This should match your Stellar network configuration
// // For example, using TestNet or MainNet
// const recovery = new Recovery({
//     network: 'testnet', // or 'public' for MainNet
//     horizonUrl: 'https://horizon-testnet.stellar.org', // TestNet Horizon URL
//     networkPassphrase: 'Test SDF Network ; September 2015',
// });

// // Example recovery servers configuration
// // This should be replaced with actual recovery server details
// // Ensure these match your Stellar network setup
// const recoveryServers: Record<string, Types.RecoveryServer> = {
//   server1: {
    
//     authEndpoint: 'https://recovery1.example.com/auth',
//     signingKey: 'GDABC...', // Replace with actual key
//   },
//   server2: {
//     authEndpoint: 'https://recovery2.example.com/auth',
//     signingKey: 'GDEF...', // Replace with actual key
//   },
// };

// const recoveryService = new StellarRecoveryService(recovery, recoveryServers);

// const handleError = (err: unknown, res: Response) => {
//   const message = err instanceof Error ? err.message : 'Unknown error occurred';
//   res.status(500).json({ error: message });
// };

// export const createRecoverableWallet = async (req: Request, res: Response) => {
//   try {
//     const { accountSecret, deviceSecret, recoverySecret } = req.body;

//     const result = await recoveryService.createRecoverableWallet({
//       accountKp: Keypair.fromSecret(accountSecret),
//       deviceKp: Keypair.fromSecret(deviceSecret),
//       recoveryKp: Keypair.fromSecret(recoverySecret),
//     });

//     res.json({ message: 'Wallet created', result });
//   } catch (err) {
//     handleError(err, res);
//   }
// };

// export const getAccountInfo = async (req: Request, res: Response) => {
//   try {
//     const { accountSecret, authTokens } = req.body;

//     const accountKp = Keypair.fromSecret(accountSecret);
//     const result = await recoveryService.getAccountInfo(accountKp, authTokens);

//     res.json(result);
//   } catch (err) {
//     handleError(err, res);
//   }
// };

// export const recoverWallet = async (req: Request, res: Response) => {
//   try {
//     const { accountSecret, recoverySignerAddresses, recoverySecret, firebaseToken } = req.body;

//     const result = await recoveryService.recoverWallet({
//       accountKp: Keypair.fromSecret(accountSecret),
//       recoverySignerAddresses,
//       recoveryKp: Keypair.fromSecret(recoverySecret),
//       firebaseToken,
//     });

//     res.json({ newDevicePublicKey: result.publicKey() });
//   } catch (err) {
//     handleError(err, res);
//   }
// };
