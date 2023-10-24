import React, { useState, useEffect } from 'react';
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton,
} from '@solana/wallet-adapter-react-ui';
import SignIn from './SignIn';
import { Button } from '@mui/material';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import JupiterApp from './JupiterApp';


const MyWallet: React.FC = () => {
    const { connection } = useConnection();
    let walletAddress = "";

    // if you use anchor, use the anchor hook instead
    // const wallet = useAnchorWallet();
    // const walletAddress = wallet?.publicKey.toString();

    const wallet = useWallet();
    const {publicKey,sendTransaction} = useWallet();
    if (wallet.connected && wallet.publicKey) {
        walletAddress = wallet.publicKey.toString();
    }

    const sendToken = async()=>{
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey == null ? new Keypair().publicKey : publicKey,
                toPubkey:new PublicKey("Br2vURArjVVvmyiyB93V2M8g4Y9pvxZzSg2MgMfEHrjN"),
                lamports:LAMPORTS_PER_SOL * 0.5,
            })
        )
        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed');
    }
    return (
        <>
            {wallet.connected && (
                <span>
                    <p className="center">Public Key</p>
                    <input className="publicKey" type="text" id="publicKey" value={walletAddress} />
                </span>
            )}

            <div className="multi-wrapper">
                <span className="button-wrapper">
                    <WalletModalProvider>
                        <WalletMultiButton />
                    </WalletModalProvider>
                    {wallet.connected ? <SignIn/> : <></>}
                    {wallet.connected ?<Button onClick={sendToken}>Sending</Button>:<></>}
                    <JupiterApp/>
                </span>
            </div>
        </>
    );
};

export default MyWallet;
