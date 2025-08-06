import { IWallet } from "../../core/wallet.interface";

export class EvmWallet implements IWallet {
  constructor(private address: string) {}

  getPublicKey(): string {
    return this.address;
  }

  getChain(): string {
    return "evm";
  }
}