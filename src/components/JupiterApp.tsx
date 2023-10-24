import { Jupiter, RouteInfo, TOKEN_LIST_URL, executeTransaction, getPlatformFeeAccounts } from "@jup-ag/core";
import { useJupiter } from "@jup-ag/react-hook";
import { Wallet } from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import base58 from "bs58";
import { useEffect, useState } from "react";


const JupiterApp = () => {
    // const [tokens, setTokens] = useState<Token[]>([]);
    // const ENV = 'devnet';
    const wallet = new Wallet(Keypair.fromSecretKey(base58.decode(process.env.PRIVATE_KEY || '4xP5gdpkp8efXYpjjhAbw8E3yFY5PQcK3uXLi532VE55h7unXGVT5nsJSL5GGruuMrAAvjbA8DWP43CT2EabSBhL')));
    const connection = useConnection()
    const bobWallet = new PublicKey('Br2vURArjVVvmyiyB93V2M8g4Y9pvxZzSg2MgMfEHrjN');
    const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    const swapButton = async () => {
        // Retrieve the `indexed-route-map`
        const indexedRouteMap = await (await fetch('https://quote-api.jup.ag/v6/indexed-route-map')).json();
        const getMint = (index: any) => indexedRouteMap["mintKeys"][index];
        const getIndex = (mint: any) => indexedRouteMap["mintKeys"].indexOf(mint);

        // Generate the route map by replacing indexes with mint addresses
        var generatedRouteMap: any = {};
        Object.keys(indexedRouteMap['indexedRouteMap']).forEach((key, index) => {
            generatedRouteMap[getMint(key)] = indexedRouteMap["indexedRouteMap"][key].map((index: any) => getMint(index))
        });

        // List all possible input tokens by mint address
        const allInputMints = Object.keys(generatedRouteMap);

        // List all possition output tokens that can be swapped from the mint address for SOL.
        // SOL -> X
        const swappableOutputForSOL = generatedRouteMap['So11111111111111111111111111111111111111112'];
        console.log({ allInputMints, swappableOutputForSOL })
        // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
        const quoteResponse = await (
            await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50`
            )
        ).json();
        console.log({ quoteResponse })
        // get serialized transactions for the swap
        const bobUSDCTokenAccount = Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            USDC_MINT,
            bobWallet,
            // @ts-ignore
            true,
          );
        const { swapTransaction } = await (
            await fetch('https://quote-api.jup.ag/v6/swap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // quoteResponse from /quote api
                    quoteResponse,
                    // user public key to be used for the swap
                    destinationTokenAccount: bobUSDCTokenAccount.toString(),
                    userPublicKey: wallet.publicKey.toString(),
                })
            })
        ).json();
        // deserialize the transaction
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        console.log(transaction);

        // sign the transaction
        transaction.sign([wallet.payer]);
        // Execute the transaction
        const rawTransaction = transaction.serialize()
        const txid = await connection.connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });
        await connection.connection.confirmTransaction(txid);
        console.log(`https://solscan.io/tx/${txid}`);
    }

    return (
        <>
            <div style={{ fontWeight: "600", fontSize: 16, marginTop: 24 }}>
                Hook example
            </div>
            {/* <div>Number of tokens: {tokens.length}</div>
            <div>Number of input tokens {allTokenMints.length}</div>
            <div>Possible number of routes: {routes?.length}</div>
            <div>Best quote: {routes ? routes[0].outAmount : ""}</div>*/}
            <button type="button" onClick={swapButton}>
                Swap best route
            </button>
        </>
    );
};

export default JupiterApp;
