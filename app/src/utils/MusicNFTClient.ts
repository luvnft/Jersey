import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction, Keypair } from '@solana/web3.js';
import { Buffer } from 'buffer';

export class MusicNFTClient {
    connection: Connection;
    programId: PublicKey;

    constructor(connection: Connection) {
        this.connection = connection;
        this.programId = new PublicKey("9h4jHLwgmwdRJETCYFx28Q85xarwzaqUwuimMvkfVLeX");
    }

    async createNFTAccount(): Promise<Keypair> {
        return Keypair.generate();
    }

    async initializeMusicNFT(
        payer: PublicKey,
        nftAccount: PublicKey,
        title: string,
        artist: string,
        ipfsHash: string,
        certificateHash: string,
    ): Promise<TransactionInstruction> {
        // Create a Buffer to store our instruction data
        const instructionData = Buffer.alloc(1000); // Allocate enough space
        
        // Write instruction index (0 for InitializeMusicNFT)
        instructionData.writeUInt8(0, 0);
        
        // Write strings with their lengths
        let offset = 1;
        
        // Write title
        const titleBuffer = Buffer.from(title);
        instructionData.writeUInt32LE(titleBuffer.length, offset);
        titleBuffer.copy(instructionData, offset + 4);
        offset += 4 + titleBuffer.length;
        
        // Write artist
        const artistBuffer = Buffer.from(artist);
        instructionData.writeUInt32LE(artistBuffer.length, offset);
        artistBuffer.copy(instructionData, offset + 4);
        offset += 4 + artistBuffer.length;
        
        // Write ipfsHash
        const ipfsHashBuffer = Buffer.from(ipfsHash);
        instructionData.writeUInt32LE(ipfsHashBuffer.length, offset);
        ipfsHashBuffer.copy(instructionData, offset + 4);
        offset += 4 + ipfsHashBuffer.length;
        
        // Write certificateHash
        const certHashBuffer = Buffer.from(certificateHash);
        instructionData.writeUInt32LE(certHashBuffer.length, offset);
        certHashBuffer.copy(instructionData, offset + 4);
        offset += 4 + certHashBuffer.length;

        // Slice the buffer to only include the data we wrote
        const finalData = instructionData.slice(0, offset);

        return new TransactionInstruction({
            keys: [
                { pubkey: payer, isSigner: true, isWritable: true },
                { pubkey: nftAccount, isSigner: true, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            programId: this.programId,
            data: finalData,
        });
    }

    async mintNFT(
        payer: PublicKey,
        nftAccount: PublicKey,
    ): Promise<TransactionInstruction> {
        const instructionData = Buffer.alloc(1);
        instructionData.writeUInt8(1, 0); // 1 for MintNFT instruction

        return new TransactionInstruction({
            keys: [
                { pubkey: payer, isSigner: true, isWritable: true },
                { pubkey: nftAccount, isSigner: false, isWritable: true },
            ],
            programId: this.programId,
            data: instructionData,
        });
    }

    async registerCopyright(
        payer: PublicKey,
        nftAccount: PublicKey,
    ): Promise<TransactionInstruction> {
        const instructionData = Buffer.alloc(1);
        instructionData.writeUInt8(2, 0); // 2 for RegisterCopyright instruction

        return new TransactionInstruction({
            keys: [
                { pubkey: payer, isSigner: true, isWritable: true },
                { pubkey: nftAccount, isSigner: false, isWritable: true },
            ],
            programId: this.programId,
            data: instructionData,
        });
    }
} 