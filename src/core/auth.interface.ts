export interface IAuthService {
  /**
   * Generate a challenge transaction or message to be signed by the user's wallet
   */
  getChallenge(account: string): Promise<string>;

  /**
   * Verify the signed challenge and return the wallet's public key or address
   */
  verifyChallenge(signedTransactionOrMessage: string): Promise<string>;
}
