import { IWallet } from "../../core/wallet.interface";
import { Keypair, Server, Transaction } from "stellar-sdk";
import axios from "axios";
import { config } from "../../config/env";

export class StellarWallet implements IWallet {
  private server: Server;
  private keypair?: Keypair;

  constructor(private publicKey?: string) {
    this.server = new Server(config.stellar.horizonUrl);

    // If no publicKey is passed, assume keypair will be generated
    if (!publicKey) {
      this.keypair = Keypair.random();
      this.publicKey = this.keypair.publicKey();
    }
  }

  getPublicKey(): string {
    return this.publicKey!;
  }

  getChain(): string {
    return "stellar";
  }

  getSecret(): string | undefined {
    return this.keypair?.secret();
  }

  generateKeypair(): { publicKey: string; secret: string } {
    const keypair = Keypair.random();
    this.keypair = keypair;
    this.publicKey = keypair.publicKey();

    return {
      publicKey: keypair.publicKey(),
      secret: keypair.secret(),
    };
  }

  async fundTestnetAccount(publicKey: string): Promise<void> {
    const url = `https://friendbot.stellar.org?addr=${publicKey}`;
    await axios.get(url);
  }

  async submitTransaction(transaction: Transaction): Promise<any> {
    return await this.server.submitTransaction(transaction);
  }

  getServer(): Server {
    return this.server;
  }
}
