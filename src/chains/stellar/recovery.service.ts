import { StellarWallet } from "./wallet";

// ✅ Import only what wallet-sdk provides
import { Recovery, Types } from "@stellar/typescript-wallet-sdk";

// ✅ Use `stellar-base` to match Wallet SDK's internal types
import { Transaction, Keypair } from "@stellar/stellar-base";

// Convert Keypair to format expected by wallet-sdk
function toAccountKeypair(kp: Keypair): { publicKey: string; keypair: Keypair } {
    return {
        publicKey: kp.publicKey(),
        keypair: kp,
    };
}

export class StellarRecoveryService {
    private recovery: Recovery;
    private stellarWallet: StellarWallet;

    constructor(
        recovery: Recovery,
        private recoveryServers: Record<string, Types.RecoveryServer>
    ) {
        this.recovery = recovery;
        this.stellarWallet = new StellarWallet();
    }

    createKeypairs(): {
        accountKp: Keypair;
        deviceKp: Keypair;
        recoveryKp: Keypair;
    } {
        return {
        accountKp: Keypair.random(),
        deviceKp: Keypair.random(),
        recoveryKp: Keypair.random(),
        };
    }

    async createRecoverableWallet({
        accountKp,
        deviceKp,
        recoveryKp,
    }: {
        accountKp: Keypair;
        deviceKp: Keypair;
        recoveryKp: Keypair;
    }) {
        const identities: Types.RecoveryIdentityMap = {};

    Object.keys(this.recoveryServers).forEach((serverKey, i) => {
      identities[serverKey] = [
        {
          role: Types.RecoveryRole.OWNER,
          authMethods: [
            i === 0
              ? {
                  type: Types.RecoveryType.STELLAR_ADDRESS,
                  value: recoveryKp.publicKey(),
                }
              : {
                  type: Types.RecoveryType.EMAIL,
                  value: "my-email@example.com",
                },
          ],
        },
      ];
    });

    const config: Types.RecoverableWalletConfig = {
      accountAddress: toAccountKeypair(accountKp),
      deviceAddress: toAccountKeypair(deviceKp),
      accountThreshold: { low: 10, medium: 10, high: 10 },
      accountIdentity: identities,
      signerWeight: { device: 10, recoveryServer: 5 },
    };

    const recoverableWallet = await this.recovery.createRecoverableWallet(config);

    // Sign with account keypair
    recoverableWallet.transaction.sign(accountKp);

    // Cast the transaction to avoid type mismatch errors due to duplicate stellar-base versions
    await this.stellarWallet.submitTransaction(
    recoverableWallet.transaction as any
    );

    return recoverableWallet;
    }

    async getAccountInfo(
        accountKp: Keypair,
        authTokens: Record<string, Types.AuthToken>
    ) {
        return await this.recovery.getAccountInfo(
        toAccountKeypair(accountKp),
        authTokens
        );
    }

    async recoverWallet({
        accountKp,
        recoverySignerAddresses,
        recoveryKp,
        firebaseToken,
    }: {
        accountKp: Keypair;
        recoverySignerAddresses: string[];
        recoveryKp: Keypair;
        firebaseToken: string;
    }): Promise<Keypair> {
        const newDeviceKp = Keypair.random();

    const authToken1 = await this.recovery
      .sep10Auth("server1")
      .authenticate({ accountKp: toAccountKeypair(recoveryKp) });

    const serverAuth: Types.RecoveryServerSigningMap = {
      server1: {
        signerAddress: recoverySignerAddresses[0],
        authToken: authToken1,
      },
      server2: {
        signerAddress: recoverySignerAddresses[1],
        authToken: Types.AuthToken.from(firebaseToken),
      },
    };

    const recoverTxn = await this.recovery.replaceDeviceKey(
    toAccountKeypair(accountKp),
    toAccountKeypair(newDeviceKp),
    serverAuth
    );

    // Cast to expected Transaction type from stellar-base
    await this.stellarWallet.submitTransaction(recoverTxn as any);

    return newDeviceKp;

    }
}
