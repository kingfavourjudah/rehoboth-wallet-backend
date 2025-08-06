import { Keypair, Networks, TransactionBuilder, Operation, Server, Transaction } from "stellar-sdk";
import { config } from "../../config/env";
import { IAuthService } from "../../core/auth.interface";

export class StellarAuthService implements IAuthService {
  async getChallenge(account: string): Promise<string> {
    const server = new Server(config.stellar.horizonUrl);
    const serverAccount = await server.loadAccount(config.stellar.serverPublicKey);
    
    const now = Math.floor(Date.now() / 1000);
    const transaction = new TransactionBuilder(serverAccount, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
      timebounds: {
        minTime: now,
        maxTime: now + 300, // 5 minutes
      },
    })
      .addOperation(
        Operation.manageData({
          name: `example.com auth`,
          value: Keypair.fromPublicKey(account).publicKey(),
          source: account,
        })
      )
      .setTimeout(300)
      .build();

    transaction.sign(Keypair.fromSecret(config.stellar.serverSecretKey));

    return transaction.toXDR();
  }

  async verifyChallenge(xdr: string): Promise<string> {
    const tx = new Transaction(xdr, Networks.TESTNET);
    const operation = tx.operations[0];

    if (operation.type !== "manageData") {
      throw new Error("Invalid challenge: must be manageData op");
    }

    const clientAccountId = operation.source;

    if (!clientAccountId) {
      throw new Error("Missing client account in challenge operation");
    }

    return clientAccountId;
  }
}
