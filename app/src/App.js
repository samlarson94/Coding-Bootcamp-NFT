import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // Check to see if User has a Solana wallet connected as soon as they open the app.
  //Check our window object to see if the Phantom Wallet Extension has injected the solana object

    //Set State
  const [walletAddress, setWalletAddress] = useState(null)
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window; // Destructuring Assignment - This is declaring the solana constant and assigning to window.solana
      // Check that we have a solana object AND it is a phantom wallet
      if (solana && solana.isPhantom) { 
          console.log('Boo! 👻 Phantom wallet found!');
          // Check if user has given us permission to access their Phantom Wallet
            const response = await solana.connect({ onlyIfTrusted: true });
            console.log(
              'Connected with Public Key:',
              response.publicKey.toString()
            );
            // Set the user's publicKey in state to be used later
            setWalletAddress(response.publicKey.toString());
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Connect Wallet - "Sign In"
  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  //Call using useEffect hook
  useEffect(() => {
    const onLoad = async () => {  // Wait for window to fully load before checking if wallet is connected 
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">mybootcampNFT 📜🏅</p>
          <p className="sub-text">Mint your NFT certificate</p>
          {/* Conditional to show button only if we DONT already have a wallet address. React to onlycall this ren method if there is no walletAddress set in our state */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
