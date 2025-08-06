import { IAuthService } from "../core/auth.interface";
import { StellarAuthService } from "../chains/stellar/auth";
import { EvmAuthService } from "../chains/evm/auth";

// Pluggable registry
export function getAuthService(chain: string): IAuthService {
  switch (chain.toLowerCase()) {
    case "evm":
      return new EvmAuthService();
    case "stellar":
    default:
      return new StellarAuthService();
  }
}
