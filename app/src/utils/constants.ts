import { Connection, PublicKey } from '@solana/web3.js';

export const SOLANA_NETWORK = "http://127.0.0.1:8899";
export const connection = new Connection(SOLANA_NETWORK, 'confirmed');
export const PROGRAM_ID = new PublicKey("9h4jHLwgmwdRJETCYFx28Q85xarwzaqUwuimMvkfVLeX"); 