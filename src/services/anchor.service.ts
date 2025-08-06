import { StellarAnchorService } from "../chains/stellar/anchor";

// Future support: Add EvmAnchorService, SolanaAnchorService etc.
export function getAnchorService(chain: string = "stellar") {
  switch (chain.toLowerCase()) {
    case "stellar":
    default:
      return new StellarAnchorService();
  }
}
