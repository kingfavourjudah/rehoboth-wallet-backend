// src/services/wallet.service.ts
import { StellarWallet } from "../chains/stellar/wallet";
import { EvmWallet } from "../chains/evm/wallet";
import { IWallet } from "../core/wallet.interface";
import { Wallet } from "ethers"; // Assuming you now have EVM support

export function getWallet(chain: string, publicKey: string): IWallet {
  switch (chain.toLowerCase()) {
    case "evm":
      return new EvmWallet(publicKey);
    case "stellar":
    default:
      return new StellarWallet(); // no public key needed if used for wallet creation
  }
}

export function createStellarWallet(): { publicKey: string; secret: string } {
  const wallet = new StellarWallet();
  return wallet.generateKeypair();
}

export function createEvmWallet(): { publicKey: string; privateKey: string } {
  const wallet = Wallet.createRandom();
  return {
    publicKey: wallet.address,
    privateKey: wallet.privateKey,
  };
}

export function fundStellarWallet(publicKey: string) {
  const wallet = new StellarWallet();
  return wallet.fundTestnetAccount(publicKey);
}
