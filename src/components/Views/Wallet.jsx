import React, { useEffect, useState } from "react";
import { CHAINS_CONFIG } from "./chains";
import {
  SwapOutlined,
  BranchesOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Tooltip, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import * as solanaWeb3 from "@solana/web3.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import abi from "../../abi.json";
import NFT from "./NFT";
import Token from "./Token";
import Transaction from "./Transaction";
import Swal from "sweetalert2";
import Loading from "../Layouts/Loading";
import Swap from "./Swap";
import Bridge from "./Bridge";
import Activity from "./Activity";

import { Keypair } from "@solana/web3.js";
import { Buffer } from "buffer";
import { mnemonicToSeedSync } from "bip39";

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey, mnemonicToPrivateKey } from "ton-crypto";
import { TonClient, WalletContractV4, internal } from "ton";
import Icon from "@ant-design/icons/lib/components/Icon";
import iconcoin from "./img/dollar-coin.png";

const bs58 = require("bs58");

window.Buffer = Buffer;

const Wallet = ({ setWallet, setSeedPhrase }) => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionSent, setIsTransactionSent] = useState(false);

  const [selected, setSelected] = useState("transaction");

  let wallet;
  const walleteth = localStorage.getItem("wallet");
  const waleletSln = localStorage.getItem("WalletSln");
  const walletAddressTon = localStorage.getItem("walletAddressTon");
  const seedPhrase = localStorage.getItem("encrypt-seedPhrase");
  const selectedChain = localStorage.getItem("selectedChain");
  const timeExpired = localStorage.getItem("expired");
  const currentTime = new Date().getTime();
  const encryptPass = localStorage.getItem("encrypt-pass");

  if (selectedChain === "0x65") {
    wallet = waleletSln;
  } else if (selectedChain === "0x2") {
    wallet = walletAddressTon;
  } else {
    wallet = walleteth;
  }

  useEffect(() => {
    if (!wallet && seedPhrase) {
      navigate("/enter-password");
      return;
    }
    if (!localStorage.getItem("expired")) {
      localStorage.setItem("expired", new Date().getTime() + 1500000);
      expiredTime(1500000);
    } else {
      const remainTime = timeExpired - currentTime;
      if (remainTime > 0) {
        expiredTime(remainTime);
      } else {
        // localStorage.removeItem("wallet");
        localStorage.removeItem("expired");
        navigate("/enter-password");
      }
    }
  }, []);

  async function encryptedBytes(secretKey) {
    const encrysecretKey = CryptoJS.AES.encrypt(
      secretKey,
      "HR#s&7uP@l!9tYA"
    ).toString();
    return encrysecretKey;
  }

  const expiredTime = (time) => {
    clearTimeout(logout);
    var logout = setTimeout(() => {
      localStorage.removeItem("wallet");
      localStorage.removeItem("expired");

      navigate("/enter-password");
    }, time);
  };

  const Sucess = () => {
    return Swal.fire({
      title: "Transaction Completed!",
      text: null,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
      footer: '<a href="Where to navigate on click?">View Transaction</a>',
      showConfirmButton: true,
      timer: null,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  const Error = () => {
    return Swal.fire({
      title: "Transaction Failed!",
      text: "There was a problem with your transaction. Please try again.",
      icon: "error",
      confirmButtonColor: "#d33", // Red color for the confirmation button
      confirmButtonText: "Retry",
      footer: '<a href="Where to navigate on retry?">Need help?</a>',
      showConfirmButton: true,
      timer: null,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  const onClickActive = (e) => {
    setSelected(e.target.id);
    lightingOnClick(e);
    lightingOnClick2(e);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet);
    message.success("Address copied successfully");
  };

  const lightingOnClick = (e) => {
    document.querySelectorAll(`.wallet-item`).forEach((item) => {
      item.classList.remove(`actived`);
    });
    const walletItem = e.target.closest(".wallet-item");
    if (walletItem) {
      walletItem.classList.add("actived");
    }
  };

  const lightingOnClick2 = (e) => {
    document.querySelectorAll(`.wallet-itemTwo`).forEach((item) => {
      item.classList.remove(`actived`);
    });
    e.target.className += " actived";
  };

  const decryptSeedPhrase = (password) => {
    if (seedPhrase) {
      const decryptedBytes = CryptoJS.AES.decrypt(seedPhrase, password);

      const decryptedSeedPhrase = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decryptedSeedPhrase;
    }
    return null;
  };

  async function sendToken(
    tokenAddress,
    recipientAddress,
    amount,
    decimals,
    password
  ) {
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const amountFormatted = ethers.parseUnits(amount.toString(), decimals);

    const tokenAbi = abi;

    try {
      const privateKey = ethers.Wallet.fromPhrase(
        decryptSeedPhrase(password)
      ).privateKey;
      const wallet = new ethers.Wallet(privateKey, provider);

      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);
      const tx = {
        to: tokenAddress, // Địa chỉ của hợp đồng token
        from: wallet.address,
        data: tokenContract.interface.encodeFunctionData("transfer", [
          recipientAddress,
          amountFormatted,
        ]),
      };
      const estimatedGas = await provider.estimateGas(tx);
      const gasPrice = await provider.getFeeData();
      const estimatedGasCost = ethers.formatEther(
        estimatedGas * gasPrice.gasPrice
      );

      return {
        contract: tokenContract,
        wallet: wallet,
        estimatedGasCost: estimatedGasCost,
        txhash: tx.data,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function sendTransaction(to, amount, password) {
    if (isTransactionSent) return;

    setIsLoading(true);

    try {
      const chain = CHAINS_CONFIG[selectedChain];

      const provider = new ethers.JsonRpcProvider(chain.rpcUrl);

      const privateKey = ethers.Wallet.fromPhrase(
        decryptSeedPhrase(password)
      ).privateKey;

      const wallet = new ethers.Wallet(privateKey, provider);

      const tx = {
        to: to,
        value: ethers.parseEther(amount),
      };

      sleep(2000);
      const transaction = await wallet.sendTransaction(tx);
      // await transaction.wait();

      setIsTransactionSent(true);
      setHash(transaction.hash);
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        setIsLoading(false);
        Sucess();
        getAccountTokens();
      } else {
        setIsLoading(false);
        Error();
      }
    } catch (error) {
      Error();
      setIsLoading(false);
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
    } finally {
      setIsTransactionSent(false);
    }
  }

  async function sendZksync(receiver, amount, password) {
    setIsLoading(true);

    try {
      const decryptedSeedPhrase = decryptSeedPhrase(password);

      const Wallet = await ethers.Wallet.fromPhrase(decryptedSeedPhrase);
      const encrymnemonicKey = await encryptedBytes(decryptedSeedPhrase);

      const res = await axios.post(`${process.env.REACT_APP_API_SENDZKSYNC}`, {
        encrysecretKey: encrymnemonicKey,
        chainUrlFrom: CHAINS_CONFIG[selectedChain].rpcUrl,
        chainUrlTO: CHAINS_CONFIG["0x1"].rpcUrl,
        amount: amount,
        receiver: receiver,
      });
      setIsLoading(false);
      Sucess();
      getAccountTokens();
    } catch {
      Error();
    }
  }

  async function transferSOLToken(recipientPublicKeyString, amount, password) {
    if (isTransactionSent) return;
    try {
      const network = "https://go.getblock.io/cf0feaabdead44d3b04f866ea4d518b3";

      const connection = new solanaWeb3.Connection(network);

      const seed = await mnemonicToSeedSync(decryptSeedPhrase(password));

      const keypair = Keypair.fromSeed(seed.slice(0, 32));

      const key = keypair.secretKey;

      // Sử dụng bs58 để chuyển đổi bytes sang Base58
      const base58String = bs58.encode(key);

      const senderPrivateKey = bs58.decode(base58String);
      const senderKeypair = solanaWeb3.Keypair.fromSecretKey(senderPrivateKey);

      const recipientPublicKey = new solanaWeb3.PublicKey(
        recipientPublicKeyString
      );

      const lamportsToSend = amount * solanaWeb3.LAMPORTS_PER_SOL;

      const instruction = solanaWeb3.SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: lamportsToSend,
      });

      async function setWalletTransaction(instruction, connection) {
        const transaction = new solanaWeb3.Transaction();
        transaction.add(instruction);
        transaction.feePayer = wallet.publicKey;
        let hash = await connection.getRecentBlockhash();
        // console.log("blockhash", hash);
        transaction.recentBlockhash = hash.blockhash;
        return transaction;
      }

      let trans = await setWalletTransaction(instruction, connection);

      setIsLoading(true);

      const Transactioned = await connection.sendTransaction(trans, [
        senderKeypair,
      ]);

      if (Transactioned) {
        setIsLoading(false);

        Sucess();
        getAccountTokens();
      } else {
        setIsLoading(false);
        Error();
      }
      setIsLoading(false);
    } catch (err) {
      Error();
      setIsLoading(false);
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
      console.log(err);
    }

    setIsTransactionSent(false);
  }

  async function sendTonTransaction(receiverAddress, amount, password) {
    try {
      setIsLoading(true);

      const mnemonic = decryptSeedPhrase(password);

      let seedPhraseArray = mnemonic.split(" ");
      const keyPair = await mnemonicToPrivateKey(seedPhraseArray);
      const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
      });
      console.log(wallet);

      const endpoint = await getHttpEndpoint({
        network: "mainnet",
      });
      const client = new TonClient({ endpoint });

      const walletContract = client.open(wallet);
      const seqno = await walletContract.getSeqno();
      const Transactioned = await walletContract.sendTransfer({
        secretKey: keyPair.secretKey,
        seqno: seqno,
        messages: [
          internal({
            to: receiverAddress,
            value: amount, // 0.05 TON
            body: "Hello World", // optional comment
            bounce: false,
          }),
        ],
      });

      let currentSeqno = seqno;
      while (currentSeqno == seqno) {
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
      }
      setIsLoading(false);
      Sucess();
      getAccountTokens();
    } catch {
      Error();
      setIsLoading(false);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function getAccountTokens() {
    setFetching(true);
    let apiUrl;

    if (selectedChain === "0x65") {
      apiUrl = process.env.REACT_APP_API_CHECKBALANCESOL;
    } else if (selectedChain === "0x2") {
      apiUrl = process.env.REACT_APP_API_CHECKBALANCETON;
    } else {
      apiUrl = process.env.REACT_APP_API_CHECKBALANCEEVM;
    }
    const res = await axios.get(apiUrl, {
      params: {
        userAddress: wallet,
        chain: selectedChain,
        url: CHAINS_CONFIG[selectedChain].rpcUrl,
        encryptSeedPhrase: seedPhrase,
      },
    });

    const response = res.data;

    setBalance(response.balance);

    setFetching(false);
  }

  function logout() {
    setBalance(0);
    // localStorage.removeItem("wallet");
    localStorage.removeItem("expired");
    navigate("/enter-password");
  }
  async function ModalConfirmLogOut() {
    const { value: accept } = await Swal.fire({
      title: "Are you sure you want to sign out?",
      input: "checkbox",
      inputValue: 1,
      inputPlaceholder: `
        I agree with the terms and conditions
      `,
      confirmButtonText: `
        Continue&nbsp;<i class="fa fa-arrow-right"></i>
      `,
      inputValidator: (result) => {
        return !result && "You need to agree with T&C";
      },
    });
    if (accept) {
      logout();
    }
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
  }, [wallet, seedPhrase, selectedChain]);

  return (
    <>
      {isLoading && <Loading />}
      <div className="start-come-to-wallet">
        <div className="onboarding-flow__wrapper">
          <div
            className="recovery-phrase__confirm"
            data-testid="confirm-recovery-phrase"
          >
            <>
              <div className="content">
                <div className="logoutButton">
                  <div className="text-logout" onClick={ModalConfirmLogOut}>
                    Sign Out <i className="bi bi-box-arrow-right"></i>
                  </div>
                </div>
                {/* <div
                  className="walletName text-center"
                  style={{ letterSpacing: 5, fontWeight: "bold" }}
                >
                  MULTI WALLET
                </div> */}
                <Tooltip
                  className="d-flex justify-content-center"
                  title={wallet}
                >
                  <div>
                    {wallet?.slice(0, 7)}...{wallet?.slice(-7)}
                    <div className="copy_address" onClick={handleCopy}>
                      <i className="bi bi-copy"></i>
                    </div>
                  </div>
                </Tooltip>
                <div className="d-flex mt-4 block-colum">
                  <div
                    onClick={onClickActive}
                    id="transaction"
                    className="wallet-item actived "
                  >
                    <div className="transaction-icon">
                      <SendOutlined />
                    </div>
                  </div>
                  <div
                    onClick={onClickActive}
                    id="Swap"
                    className="wallet-item"
                  >
                    <div className="icon-swap">
                      <SwapOutlined />
                    </div>
                  </div>

                  <div
                    onClick={onClickActive}
                    id="tokens"
                    className="wallet-item"
                  >
                    <i
                      className="fa-solid fa-dollar-sign"
                      style={{ pointerEvents: "none" }}
                    ></i>
                  </div>
                  <div
                    onClick={onClickActive}
                    id="nfts"
                    className="wallet-item"
                  >
                    <i
                      className="fa-solid fa-puzzle-piece"
                      style={{ pointerEvents: "none" }}
                    ></i>
                  </div>
                  <div
                    onClick={onClickActive}
                    id="activity"
                    className="wallet-item"
                  >
                    <i
                      className="fa-solid fa-clock-rotate-left"
                      style={{ pointerEvents: "none" }}
                    ></i>
                  </div>

                  {/* <div
                    onClick={onClickActive}
                    id="Bridge"
                    className="wallet-itemTwo"
                  >
                    <div className="bridge-icon">
                      <BranchesOutlined />
                    </div>
                  </div> */}
                </div>

                {/* <div className="d-flex justify-content-around mt-4">
                  <div
                    onClick={onClickActive}
                    id="tokens"
                    className="wallet-item"
                  >
                    <i
                      className="fa-solid fa-dollar-sign"
                      style={{ pointerEvents: "none" }}
                    ></i>
                  </div>
                  <div
                    onClick={onClickActive}
                    id="nfts"
                    className="wallet-item"
                  >
                    <i
                      className="fa-solid fa-puzzle-piece"
                      style={{ pointerEvents: "none" }}
                    ></i>
                  </div>
                  <div
                    onClick={onClickActive}
                    id="activity"
                    className="wallet-item"
                  >
                    <i
                      className="fa-solid fa-clock-rotate-left"
                      style={{ pointerEvents: "none" }}
                    ></i>
                  </div>
                </div> */}
                <div className="wallet-body">
                  <div className="tokens" hidden={selected !== "tokens"}>
                    <Token
                      tokens={tokens}
                      fetching={fetching}
                      sendToken={sendToken}
                      setFetching={setFetching}
                      getAccountTokens={getAccountTokens}
                      wallet={wallet}
                      selectedChain={selectedChain}
                      walleteth={walleteth}
                      walletSln={waleletSln}
                      walletAddressTon={walletAddressTon}
                    />
                  </div>

                  <div className="activity" hidden={selected !== "activity"}>
                    <Activity
                      fetching={fetching}
                      setFetching={setFetching}
                      selectedChain={selectedChain}
                      wallet={wallet}
                    />
                  </div>
                  <div className="nfts" hidden={selected !== "nfts"}>
                    <NFT
                      fetching={fetching}
                      nfts={nfts}
                      selectedChain={selectedChain}
                      wallet={wallet}
                    />
                  </div>
                  <div
                    className="transaction"
                    hidden={selected !== "transaction"}
                  >
                    <Transaction
                      hash={hash}
                      balance={balance}
                      fetching={fetching}
                      processing={processing}
                      selectedChain={selectedChain}
                      sendTransaction={sendTransaction}
                      sendSol={transferSOLToken}
                      TransactionTon={sendTonTransaction}
                      sendZksync={sendZksync}
                    />
                  </div>
                  <div className="Swap" hidden={selected !== "Swap"}>
                    <Swap
                      fetching={fetching}
                      setFetching={setFetching}
                      selectedChain={selectedChain}
                    />
                  </div>
                  {/* <div className="Bridge" hidden={selected !== "Bridge"}>
                    <Bridge selectedChain={selectedChain} />
                  </div> */}
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};
export default Wallet;
