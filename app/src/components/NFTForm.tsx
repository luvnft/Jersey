'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Transaction, Keypair } from '@solana/web3.js';
import { connection } from '@/utils/constants';
import { MusicNFTClient } from '@/utils/MusicNFTClient';
import { uploadToPinata } from '@/utils/pinata';

export function NFTForm() {
  const { publicKey, signTransaction } = useWallet();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [nftAccount, setNftAccount] = useState<Keypair | null>(null);

  const handleCreateNFT = async () => {
    if (!publicKey || !signTransaction || !musicFile || !certificateFile) return;

    try {
      setLoading(true);
      const musicHash = await uploadToPinata(musicFile);
      const certificateHash = await uploadToPinata(certificateFile);

      const client = new MusicNFTClient(connection);
      const newNFTAccount = await client.createNFTAccount();
      setNftAccount(newNFTAccount);

      const instruction = await client.initializeMusicNFT(
        publicKey,
        newNFTAccount.publicKey,
        title,
        artist,
        musicHash,
        certificateHash
      );

      const transaction = new Transaction();
      transaction.add(instruction);
      
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash('confirmed')
      ).blockhash;
      
      transaction.feePayer = publicKey;
      transaction.sign(newNFTAccount);

      const signedTx = await signTransaction(transaction);
      const txId = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txId, 'confirmed');

      alert('NFT created successfully!');
    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Error creating NFT. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-end mb-8">
        <WalletMultiButton />
      </div>

      <h1 className="text-3xl font-bold mb-8">Music NFT Platform</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Music File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Certificate File</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleCreateNFT}
          disabled={!publicKey || loading}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Create Music NFT'}
        </button>
      </div>
    </div>
  );
} 