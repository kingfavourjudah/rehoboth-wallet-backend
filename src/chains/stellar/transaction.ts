import { ITransactionService } from "../../core/transaction.interface";
import { Server, Networks, Transaction } from "stellar-sdk";
import { config } from "../../config/env";

export class StellarTransactionService implements ITransactionService {
  private server = new Server(config.stellar.horizonUrl);

  async submitTransaction(xdr: string): Promise<any> {
    // Parse the transaction XDR into a Transaction object
    const tx = new Transaction(xdr, Networks.TESTNET); // or Networks.PUBLIC for mainnet
    return await this.server.submitTransaction(tx);
  }

  async getTransaction(hash: string): Promise<any> {
    return await this.server.transactions().transaction(hash).call();
  }
}
