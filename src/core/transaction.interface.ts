export interface ITransactionService {
  /**
   * Submit a signed transaction to the blockchain
   */
  submitTransaction(txXDR: string): Promise<any>;

  /**
   * Get transaction details by hash or ID
   */
  getTransaction(hash: string): Promise<any>;
}
