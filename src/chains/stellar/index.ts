// src/chains/stellar/index.ts

import { walletSdk, Types } from "@stellar/typescript-wallet-sdk";
import { StellarSep24Service } from "./sep24.service";

export const createStellarSep24Service = (
  homeDomain: string,
  authToken: Types.AuthToken
): StellarSep24Service => {
  const wallet = walletSdk.Wallet.TestNet(); // or MainNet() based on environment
  const anchor = wallet.anchor({ homeDomain });

  return new StellarSep24Service(anchor, authToken);
};
