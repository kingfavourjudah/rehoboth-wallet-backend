import { IAuthService } from "../../core/auth.interface";

export class EvmAuthService implements IAuthService {
  async getChallenge(account: string): Promise<string> {
    // Return a message that the wallet will sign (EIP-4361 compatible)
    return `Sign this message to authenticate with EVM wallet: ${account}`;
  }

  async verifyChallenge(signedMessage: string): Promise<string> {
    // Placeholder logic – to be replaced with ethers.js signature recovery
    return "0xEvmAddressRecoveredFromSignedMessage";
  }
}
