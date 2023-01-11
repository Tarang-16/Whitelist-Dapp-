const { ethers, providers } = require("ethers");
import { contractAddress, abi } from "../constants";
import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";

export default function Whitelist() {
  const [walletConnected, setWalletConnected] = useState(false); // tracks if the wallet is connected
  const [joinedWhitelist, setJoinedWhitelist] = useState(false); // tracks if the user is whitelisted or not
  const [numWhitelisted, setNumWhiteListed] = useState(0); // tracks the number of user already whitelisted
  const [loading, setLoading] = useState(false); // turns true when we are waiting for a transaction to get mined

  const web3ModalRef = useRef();

  const getaSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  async function addToWhitelist() {
    const signer = await getaSigner(true);

    const whitelistContract = new ethers.Contract(
      contractAddress[5][0],
      abi,
      signer
    );

    const tx = await whitelistContract.joinWhitelist();
    setLoading(true);
    await tx.wait();
    setLoading(false);
    setJoinedWhitelist(true);
    const _numberOfWhitelisted = await whitelistContract.getUserNum();
    setNumWhiteListed(_numberOfWhitelisted);
  }

  async function numMembers() {
    try {
      const provider = await getaSigner();

      const whitelistContract = new ethers.Contract(
        contractAddress[5][0],
        abi,
        provider
      );

      const _numUser = await whitelistContract.getUserNum();
      setNumWhiteListed(_numUser);
    } catch (error) {
      console.log(error);
    }
  }

  async function checkAddress() {
    try {
      const signer = await getaSigner(true);

      const whitelistContract = new ethers.Contract(
        contractAddress[5][0],
        abi,
        signer
      );

      const _address = await signer.getAddress();
      const _member = await whitelistContract.member(_address);
      setJoinedWhitelist(_member);

      const _numUser = await whitelistContract.getUserNum();
      setNumWhiteListed(_numUser);
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getaSigner();
      setWalletConnected(true);

      checkAddress();
      numMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      // connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numWhitelisted.toString()} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Tarang Tyagi
      </footer>
    </div>
  );
}
