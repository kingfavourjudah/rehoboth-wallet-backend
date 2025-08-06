import { SupportedNetworks } from '@soroswap/sdk';

export const config = {
  soroswap: {
    apiKey: process.env.SOROSWAP_API_KEY!,
    defaultNetwork:
      process.env.STELLAR_NETWORK === 'mainnet'
        ? SupportedNetworks.MAINNET
        : SupportedNetworks.TESTNET,
  },
};
