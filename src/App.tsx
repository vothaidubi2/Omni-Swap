import React from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
  getTorusWallet,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import MyWallet from "./components/MyWallet";
import Menu from './components/menu'
import Sweeper from './components/sweeper';
import Footer from './components/footer';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

function App() {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = React.useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <div className="main">
          <p className="sign">Sign in With Solana</p>
          <br />
          <div>
            <MyWallet />
            <span id="postSignIn" style={{ display: "none" }}>
              <p>Public Key</p>
              <input className="publicKey" type="text" id="publicKey" />
              <p>Signature</p>
              <input className="signature" type="text" id="signature" />
              <button className="web3auth" id="verify">
                Verify
              </button>
            </span>
            <p className="center">Created By</p>
            <p style={{textAlign:'center',paddingBottom:'30px',fontSize:'32px'}}>OmniPay Team</p>
          </div>
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
