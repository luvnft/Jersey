'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Transaction } from '@solana/web3.js';
import { connection } from '@/utils/constants';
import { MusicNFTClient } from '@/utils/MusicNFTClient';
import { uploadToPinata } from '@/utils/pinata';
import { motion } from 'framer-motion';

export default function NFTForm() { // Make sure this is the default export
    const { publicKey, signTransaction } = useWallet();
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [musicFile, setMusicFile] = useState<File | null>(null);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);


    const handleCreateNFT = async () => {
        if (!publicKey || !signTransaction || !musicFile || !certificateFile) return;

        try {
            setLoading(true);
            const musicHash = await uploadToPinata(musicFile);
            const certificateHash = await uploadToPinata(certificateFile);

            const client = new MusicNFTClient(connection);
            const newNFTAccount = await client.createNFTAccount();

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
        <motion.div
            className="min-h-screen bg-gradient-to-r from-indigo-100 via-sky-100 to-blue-100 flex flex-col items-center justify-center py-12 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                <div className="flex justify-end mb-6">
                    <WalletMultiButton className="rounded-md px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium" />
                </div>

                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Your Music NFT</h1>

                <div className="space-y-6">

                    <InputGroup label="Title">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            placeholder="Enter title"
                        />
                    </InputGroup>

                    <InputGroup label="Artist">
                        <input
                            type="text"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            placeholder="Enter artist name"
                        />
                    </InputGroup>

                    <InputGroup label="Music File">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {musicFile && <p className="mt-2 text-sm text-gray-600">{musicFile.name}</p>}
                    </InputGroup>

                    <InputGroup label="Certificate File">
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {certificateFile && <p className="mt-2 text-sm text-gray-600">{certificateFile.name}</p>}
                    </InputGroup>


                    <button
                        onClick={handleCreateNFT}
                        disabled={!publicKey || loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md font-medium disabled:bg-gray-400 transition duration-300"
                    >
                        {loading ? <LoadingSpinner /> : 'Create MU$IK'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}


const InputGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block mb-2 text-gray-700 font-medium">{label}</label>
        {children}
    </div>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
