// src/chains/stellar/sep24.service.ts

import {
  IssuedAssetId, 
  Types,
} from "@stellar/typescript-wallet-sdk";

export class StellarSep24Service {
  constructor(
    private anchor: Awaited<ReturnType<InstanceType<any>["anchor"]>>,
    private authToken: Types.AuthToken
  ) {}

  async getAnchorServices() {
    return await this.anchor.getServicesInfo();
  }

  async getAsset(assetCode: string): Promise<IssuedAssetId> {
    const info = await this.anchor.getServicesInfo() as {
      currencies: { code: string; issuer: string }[];
    };

    const currency = info.currencies.find(({ code }) => code === assetCode);

    if (!currency?.issuer) {
      throw new Error(`${assetCode} not supported by anchor.`);
    }

    return new IssuedAssetId(currency.code, currency.issuer);
  }

  async deposit(assetCode: string, extraFields?: Record<string, string>) {
    const sep24 = await this.anchor.sep24();
    return await sep24.deposit({
      assetCode,
      authToken: this.authToken,
      extraFields,
    });
  }

  async withdraw(assetCode: string) {
    const sep24 = await this.anchor.sep24();
    return await sep24.withdraw({
      assetCode,
      authToken: this.authToken,
    });
  }

  async watchTransaction(
    id: string,
    assetCode: string,
    onMessage: (tx: Types.AnchorTransaction) => void,
    onSuccess: (tx: Types.AnchorTransaction) => void,
    onError: (err: Types.AnchorTransaction | Error) => void
  ) {
    const sep24 = await this.anchor.sep24();
    const watcher = sep24.watcher();

    return watcher.watchOneTransaction({
      id,
      assetCode,
      authToken: this.authToken,
      onMessage,
      onSuccess,
      onError,
    });
  }

  async fetchTransactionById(id: string) {
    const sep24 = await this.anchor.sep24();
    return await sep24.getTransactionBy({
      authToken: this.authToken,
      id,
    });
  }

  async fetchTransactionsForAsset(assetCode: string) {
    const sep24 = await this.anchor.sep24();
    return await sep24.getTransactionsForAsset({
      authToken: this.authToken,
      assetCode,
    });
  }
}
