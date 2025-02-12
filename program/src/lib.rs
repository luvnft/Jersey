#![allow(warnings)]  

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    program::invoke,
    sysvar::{rent::Rent, Sysvar},
};

#[cfg(not(feature = "no-entrypoint"))]
#[cfg_attr(target_os = "solana", allow(unexpected_cfgs))]
entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct MusicNFTMetadata {
    pub artist: String,
    pub title: String,
    pub ipfs_hash: String,          
    pub certificate_hash: String,    
    pub timestamp: i64,
    pub is_minted: bool,
    pub creator: Pubkey,            
    pub copyright_registered: bool,
    pub creation_date: i64,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum MusicNFTInstruction {
    InitializeMusicNFT {
        title: String,
        artist: String,
        ipfs_hash: String,
        certificate_hash: String,
    },
    MintNFT {
        nft_account_bump: u8,
    },
    RegisterCopyright {
        nft_account_bump: u8,
    },
    TransferNFT {
        new_owner: Pubkey,
    },
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = MusicNFTInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        MusicNFTInstruction::InitializeMusicNFT { 
            title, 
            artist, 
            ipfs_hash, 
            certificate_hash 
        } => {
            initialize_music_nft(
                program_id,
                accounts,
                title,
                artist,
                ipfs_hash,
                certificate_hash,
            )
        }
        MusicNFTInstruction::MintNFT { nft_account_bump } => {
            mint_nft(program_id, accounts, nft_account_bump)
        }
        MusicNFTInstruction::RegisterCopyright { nft_account_bump } => {
            register_copyright(program_id, accounts, nft_account_bump)
        }
        MusicNFTInstruction::TransferNFT { new_owner } => {
            transfer_nft(program_id, accounts, new_owner)
        }
    }
}

fn initialize_music_nft(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    artist: String,
    ipfs_hash: String,
    certificate_hash: String,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let initializer = next_account_info(accounts_iter)?;
    let nft_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    if !initializer.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let metadata = MusicNFTMetadata {
        artist,
        title,
        ipfs_hash,
        certificate_hash,
        timestamp: solana_program::clock::Clock::get()?.unix_timestamp,
        is_minted: false,
        creator: *initializer.key,
        copyright_registered: false,
        creation_date: solana_program::clock::Clock::get()?.unix_timestamp,
    };

    let space = metadata.try_to_vec()?.len();
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(space);

    invoke(
        &system_instruction::create_account(
            initializer.key,
            nft_account.key,
            lamports,
            space as u64,
            program_id,
        ),
        &[
            initializer.clone(),
            nft_account.clone(),
            system_program.clone(),
        ],
    )?;

    metadata.serialize(&mut &mut nft_account.data.borrow_mut()[..])?;
    msg!("Music NFT initialized successfully!");
    Ok(())
}

fn mint_nft(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _nft_account_bump: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let artist = next_account_info(accounts_iter)?;
    let nft_account = next_account_info(accounts_iter)?;

    if !artist.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut metadata = MusicNFTMetadata::try_from_slice(&nft_account.data.borrow())?;

    if metadata.is_minted {
        return Err(ProgramError::Custom(1)); 
    }

    if metadata.creator != *artist.key {
        return Err(ProgramError::Custom(2)); 
    }

    metadata.is_minted = true;
    metadata.serialize(&mut &mut nft_account.data.borrow_mut()[..])?;

    msg!("NFT minted successfully!");
    Ok(())
}

fn register_copyright(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _nft_account_bump: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let artist = next_account_info(accounts_iter)?;
    let nft_account = next_account_info(accounts_iter)?;

    if !artist.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut metadata = MusicNFTMetadata::try_from_slice(&nft_account.data.borrow())?;

    if !metadata.is_minted {
        return Err(ProgramError::Custom(3)); 
    }

    if metadata.creator != *artist.key {
        return Err(ProgramError::Custom(4)); 
    }

    if metadata.copyright_registered {
        return Err(ProgramError::Custom(5)); 
    }

    metadata.copyright_registered = true;
    metadata.serialize(&mut &mut nft_account.data.borrow_mut()[..])?;

    msg!("Copyright registered successfully!");
    Ok(())
}

fn transfer_nft(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    new_owner: Pubkey,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let current_owner = next_account_info(accounts_iter)?;
    let nft_account = next_account_info(accounts_iter)?;

    if !current_owner.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut metadata = MusicNFTMetadata::try_from_slice(&nft_account.data.borrow())?;

    if !metadata.is_minted {
        return Err(ProgramError::Custom(6)); 
    }

    if metadata.creator != *current_owner.key {
        return Err(ProgramError::Custom(7)); 
    }

    metadata.creator = new_owner;
    metadata.serialize(&mut &mut nft_account.data.borrow_mut()[..])?;

    msg!("NFT transferred successfully!");
    Ok(())
}