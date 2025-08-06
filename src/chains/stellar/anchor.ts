// src/chains/stellar/anchor.ts

import { Wallet, StellarConfiguration } from "@stellar/typescript-wallet-sdk";

export class StellarAnchorService {
  private wallet: Wallet;

  constructor() {
    this.wallet = new Wallet({
      stellarConfiguration: StellarConfiguration.TestNet(), // or MainNet()
    });
  }

  async fetchSep1(homeDomain: string, allowHttp = false): Promise<any> {
    const anchor = this.wallet.anchor({ homeDomain, allowHttp });
    const info = await anchor.sep1();
    return info;
  }

  // Add a method to get the anchor instance
  getAnchor(homeDomain: string, allowHttp = false) {
    return this.wallet.anchor({ homeDomain, allowHttp });
  }
}

// ✅ Export a helper function to use in SEP-24 controller
export async function getAnchorInstance(homeDomain: string) {
  const service = new StellarAnchorService();
  return service.getAnchor(homeDomain);
}
