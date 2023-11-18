import { Cluster } from "@solana/web3.js";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

require("dotenv").config();

// Endpoints, connection
export const ENV: Cluster = (process.env.CLUSTER as Cluster) || "mainnet-beta";



export const SOLANA_RPC_ENDPOINT =
  ENV === "devnet"
    ? "https://api.devnet.solana.com"
    : "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed";
    // !IMPORTANT:  This example is using a quiknode free plan that is shared and has limits so should not be used for productions.
// Wallets

// Token Mints
export const INPUT_MINT_ADDRESS =
  ENV === "devnet"
    ? "So11111111111111111111111111111111111111112" // SOL
    : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
export const OUTPUT_MINT_ADDRESS =
  ENV === "devnet"
    ? "MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K" // MER
    : "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT

// Interface
export interface Token {
  chainId: number; // 101,
  address: string; // '8f9s1sUmzUbVZMoMh6bufMueYH1u4BJSM57RCEvuVmFp',
  symbol: string; // 'TRUE',
  name: string; // 'TrueSight',
  decimals: number; // 9,
  logoURI: string; // 'https://i.ibb.co/pKTWrwP/true.jpg',
  tags: string[]; // [ 'utility-token', 'capital-token' ]
}