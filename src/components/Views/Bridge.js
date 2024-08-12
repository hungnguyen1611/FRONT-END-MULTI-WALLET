import React, { useState, useEffect } from "react";
import { Input, Modal, Button, message, Spin } from "antd";
import { CHAINS_CONFIG } from "./ChainBridge";
import {
  DownOutlined,
  SwapOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
import tokenList from "./Tokenlist.json";
import axios from "axios";
import Swal from "sweetalert2";
import { icons } from "antd/es/image/PreviewGroup";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import { Token_Bridge } from "./ListTokenBridge";
import { calc } from "antd/es/theme/internal";

const Bridge = ({ selectedChain }) => {
  // const chain = CHAINS_CONFIG[selectedChain];
  const [openIs, setOpenIs] = useState(false);
  const [tokenOne, setTokenOne] = useState(Token_Bridge["0x144"][0]);
  const [tokenTwo, setTokenTwo] = useState(Token_Bridge["0x144"][1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(null);
  const [tokenOneAmount, setTokenOneAmount] = useState("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState("");
  const [prices, setPrices] = useState(null);
  const [changeChain, setChangeChain] = useState(null);
  const [chainOne, setChainOne] = useState(CHAINS_CONFIG["0x1"]);
  const [chainTwo, setChainTwo] = useState(CHAINS_CONFIG["0x144"]);
  const [encryseedPhrase, setencryseedPhrase] = useState(
    localStorage.getItem("encrypt-seedPhrase")
  );
  const [encrymnemonicKey, setEncrymnemonicKey] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [SwapFee, SetSwapFee] = useState(null);

  const [TokenTwoAmountModal, SetTokenTwoAmountModal] = useState(1);

  const [isOpenThree, setisOpenThree] = useState(false);

  const [OpenModalToken, setOpenModalToken] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [password, setpassword] = useState(null);
  const [invalid, setinvalid] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);

  function openModal(asset) {
    setIsOpen(true);
    setChangeChain(asset);
  }
  function onCancelModalTwo() {
    setIsOpenTwo(false);
  }
  function openModalTwoToken(asset) {
    // setOpenIs(true);
    setOpenModalToken(true);
    setChangeToken(asset);
  }
  function openModalTwo() {
    setIsOpenTwo(true);
    setisOpenThree(false);
    // SetAmountModal();
    SetestimateSwapFee();
  }

  async function encryptedBytes(secretKey) {
    const encrysecretKey = CryptoJS.AES.encrypt(
      secretKey,
      "HR#s&7uP@l!9tYA"
    ).toString();
    return encrysecretKey;
  }
  function modifyToken(i) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    // setTokenOneAmount("");
    // setTokenTwoAmount("");
    if (changeToken === 1) {
      setTokenOne(Token_Bridge["0x144"][i]);
      // fetchPrices(tokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(Token_Bridge["0x144"][i]);
      // fetchPrices(tokenOne.address, tokenList[i].address);
    }
    setOpenModalToken(false);
  }

  function modifyChain(i) {
    if (changeChain === 1) {
      setChainOne(CHAINS_CONFIG[i]);
    } else {
      setChainTwo(CHAINS_CONFIG[i]);
    }
    setIsOpen(false);
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);

    setTokenTwoAmount(tokenOneAmount);
    // if (e.target.value && prices) {
    //   setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2));
    // } else {
    //   setTokenTwoAmount(null);
    // }
  }
  function switchChain() {
    setTokenOneAmount("");
    setTokenTwoAmount("");
    const One = chainOne;
    const Two = chainTwo;

    setChainOne(Two);
    setChainTwo(One);
  }
  async function SetestimateSwapFee() {
    const rpcUrl = "https://eth.llamarpc.com";
    try {
      setIsLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_API_ESTIMATESWAPFEE}`,
        {
          params: {
            rpcUrl: rpcUrl,
          },
        }
      );
      if (res?.data) {
        SetSwapFee(res.data.toFixed(6));

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }
  async function fetchPrices(one, two) {
    const res = await axios.get(`${process.env.REACT_APP_API_TOKENPRICE}`, {
      params: { addressOne: one, addressTwo: two },
    });

    setPrices(res.data);
    // console.log(res.data);
  }

  function fetchPricesZk() {
    setPrices({
      ratio: 1,
    });
  }

  useEffect(() => {
    // if (selectedChain === 0x144) {
    //   fetchPricesZk();
    // }
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  const Success = (text) => {
    return Swal.fire({
      title: "Success",
      text: text,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
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

  async function Bridge() {
    try {
      let url =
        chainOne.hex === "0x1"
          ? process.env.REACT_APP_API_L1TOL2
          : process.env.REACT_APP_API_L2TOL1;

      const res = await axios.post(url, {
        encrysecretKey: encrymnemonicKey,
        chainUrlFrom: chainOne.rpcUrl,
        chainUrlTO: chainTwo.rpcUrl,
        amount: tokenOneAmount,
      });

      Sucess();
    } catch {
      Error();
    }
  }
  function openModalThree() {
    setisOpenThree(true);
  }
  function onCancelModalThree() {
    setisOpenThree(false);
    setpassword(null);
    setinvalid(false);
  }

  async function decryptedBytes(password) {
    const encryptedSeedPhrase = localStorage.getItem("encrypt-seedPhrase");

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedSeedPhrase, password);
    const seedPhrase = await decryptedBytes.toString(CryptoJS.enc.Utf8);

    return seedPhrase;
  }

  async function ConfirmPassword() {
    const provider = new ethers.JsonRpcProvider(
      "https://mainnet.infura.io/v3/034a271e17be45d289047a22326d569d"
    );
    try {
      const decryptedSeedPhrase = await decryptedBytes(password);
      const Wallet = await ethers.Wallet.fromPhrase(decryptedSeedPhrase);
      const privateKey = Wallet.privateKey;
      const Walletprovider = new ethers.Wallet(privateKey, provider);
      const encrymnemonicKey = await encryptedBytes(decryptedSeedPhrase);
      setEncrymnemonicKey(encrymnemonicKey);

      // setRecipient(Wallet.address);
      // setWalletProvider(Walletprovider);
      openModalTwo();
      setisOpenThree(false);
    } catch {
      setinvalid(true);
    }
  }

  return (
    <>
      <Modal
        open={isOpenTwo}
        footer={null}
        onCancel={() => onCancelModalTwo()}
        title="Info Bridge"
        style={{
          caretColor: "transparent",
          height: "371.56px",
        }}
      >
        <div className="Info-Swap">
          <div className="Logoicon">
            <img
              src={chainOne.imageUrl}
              alt={chainOne.ticker}
              className="tokenLogoSwapOne"
            />
            <DoubleRightOutlined />
            <DoubleRightOutlined />
            <DoubleRightOutlined />
            <img
              src={chainTwo.imageUrl}
              alt={chainTwo.ticker}
              className="tokenLogoSwapTwo"
            />
          </div>

          <div className="Exchange-Rate">
            <strong className="ex-st">Exchange Rate </strong>
            <div className="Exchange">
              1 {tokenOne.ticker} = {TokenTwoAmountModal} {tokenTwo.ticker}
            </div>
          </div>

          <div className="GasSWap">
            <strong className="ex-st">Estimated Gas Fees</strong>

            <div className="Gas">{SwapFee || <Spin />} ETH</div>
          </div>
          <div className="TransactionSwap">
            {/* <span style={{ color: isError ? "red" : "limegreen" }}>
              {error}
            </span> */}
          </div>

          <div className="Button-footer">
            <Button className="CancelSwap" onClick={() => setIsOpenTwo(false)}>
              Cancel
            </Button>
            <Button className="Confirm" onClick={() => Bridge()}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={isOpenThree}
        footer={null}
        onCancel={() => onCancelModalThree()}
        title="Password Confirm"
        style={{
          caretColor: "transparent",
          height: "340.53px",
        }}
      >
        <div className="content-swappass">
          <h3 className="text-title"> Please enter password</h3>

          <div className="Enter-input">
            <Input
              type={isShow ? "text" : "password"}
              className="input-passwordSwap"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            ></Input>
            {invalid && (
              <p className="password-err" style={{ color: "red" }}>
                {" "}
                Invalid Password{" "}
              </p>
            )}
            <i
              className={
                "eyeSwap eyes-show-pass bi bi-eye" + (!isShow ? "-slash" : "")
              }
              onClick={() => setIsShow(!isShow)}
            ></i>
          </div>
          <center>
            <button
              className="codepro-custom-btn codepro-btn-15"
              style={{ height: "55px", width: "50%", margin: "55px 0 30px 0" }}
              target="blank"
              title="Code Pro"
              onClick={() => ConfirmPassword()}
            >
              Confirm
            </button>
          </center>
        </div>
      </Modal>
      <Modal
        open={isOpen}
        title="Chain List"
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        <div className="modalContent">
          {Object.values(CHAINS_CONFIG).map((chain) => {
            return (
              <div
                className="chainChoince"
                key={chain.hex}
                onClick={() => modifyChain(chain.hex)}
              >
                <img
                  src={chain.imageUrl}
                  alt={chain.name}
                  className="chainLogo"
                />
                <div className="chainChoiceNames">
                  <div className="chainNameModal">{chain.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal
        className="Modal-token"
        open={openIs}
        footer={null}
        onCancel={() => setOpenIs(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal
        title="List Token Zksync"
        open={OpenModalToken}
        onCancel={() => setOpenModalToken(false)}
        footer={null}
      >
        <div className="modalContent">
          {Object.values(Token_Bridge["0x144"])?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="Bridge-title">
        <h4 style={{ fontFamily: "serif" }}> Bridge</h4>
      </div>
      <div className="Bridge-body">
        <label className="labelBridge"> From this network</label>

        <div className="Bridge-input">
          <div className="assetOneBridge" onClick={() => openModal(1)}>
            <img className="logo-assetOneBridge" src={chainOne.imageUrl}></img>
            <div className="chainName">{chainOne.name}</div>

            <DownOutlined />
          </div>
          <Button className="iconSwapBridge" onClick={switchChain}>
            <SwapOutlined />
          </Button>
          <div className=" assetTwoBridge" onClick={() => openModal(2)}>
            <img className="logo-assetOneBridge" src={chainTwo.imageUrl}></img>
            <div className="chainName">{chainTwo.name}</div>

            <DownOutlined />
          </div>
        </div>
        <div className="BridgeInputToken">
          <label className="labelBridge"> You send</label>
          <div className="input-groupBridge">
            <div
              className="assetBridgeToken"
              onClick={() => openModalTwoToken(1)}
            >
              <img
                className="logo-assetTwoBridge"
                src={tokenOne.img}
                height="26px"
              ></img>
              {tokenOne.ticker}
              <DownOutlined />
            </div>
            <Input
              placeholder="0"
              value={tokenOneAmount}
              onChange={changeAmount}
              // disabled={!prices}
            ></Input>
          </div>
        </div>
        <div className="BridgeInputToken">
          <label className="labelBridge"> You receive</label>
          <div className="input-groupBridge">
            <div
              className="assetBridgeTokenTwo"
              onClick={() => openModalTwoToken(2)}
            >
              <img
                className="logo-assetTwoBridge"
                src={tokenTwo.img}
                height="26px"
              ></img>
              {tokenTwo.ticker}
              <DownOutlined />
            </div>
            <Input
              className="inputBridge"
              placeholder="0"
              value={tokenOneAmount}
              disabled={!tokenOneAmount}
            ></Input>
          </div>
        </div>
        {/* <Button
          className="btnBridge"
          // onClick={passwordform}>
          onClick={Bridge}
        >
          {" "}
          Confirm
        </Button> */}

        <center>
          <button
            className="codepro-custom-btn codepro-btn-15"
            style={{ marginTop: "26px", width: "100%" }}
            target="blank"
            title="Code Pro"
            onClick={openModalThree}
          >
            Confirm
          </button>
        </center>
      </div>
    </>
  );
};

export default Bridge;
