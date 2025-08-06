import * as StellarSdk from '@stellar/stellar-sdk';
import { SorobanRpc } from '@stellar/stellar-sdk';
import { SorobanContextType } from '@soroban-react/core';

const rpcServer = new SorobanRpc.Server('https://rpc-futurenet.stellar.org', {
  timeout: 30000,
  allowHttp: false,
}) as unknown as SorobanContextType['server'];

const horizonServer = new StellarSdk.Horizon.Server('https://horizon-futurenet.stellar.org') as unknown as SorobanContextType['serverHorizon'];

export async function createSorobanContext(): Promise<SorobanContextType> {
  return {
    chains: [],
    connectors: [],
    server: rpcServer,
    serverHorizon: horizonServer,
    connect: async () => {},
    disconnect: async () => {},
  };
}

export const NETWORK_PASSPHRASE = 'Test SDF Future Network ; October 2022';
