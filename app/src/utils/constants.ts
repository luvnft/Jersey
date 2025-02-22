import { Connection, PublicKey } from '@solana/web3.js';

export const SOLANA_NETWORK = "https://devnet.helius-rpc.com/?api-key=40734dc1-6a29-40dd-ac22-1a3e98aa9edb";
export const connection = new Connection(SOLANA_NETWORK, 'confirmed');
export const PROGRAM_ID = new PublicKey("9h4jHLwgmwdRJETCYFx28Q85xarwzaqUwuimMvkfVLeX"); 