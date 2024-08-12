import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  SwapOutlined,
  DownOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

import { Popover, Button, Modal, Radio, Spin, Input } from "antd";
import tokenList from "./Tokenlist.json";
import axios from "axios";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import ABI_SWAP from "./ABISWAP";
import Loading from "../Layouts/Loading";
import TokenListTon from "./ListTokenTon.json";
import Swal from "sweetalert2";

import { sleep } from "zksync-web3/build/src/utils";

const SwapComponent = ({ selectedChain, fetching }) => {
  const [changeToken, setChangeToken] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState("");
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [prices, setPrices] = useState(null);
  const [slippage, setSlippage] = useState(2.5);
  const [TokenTwoAmountModal, SetTokenTwoAmountModal] = useState(null);
  const [SwapFee, SetSwapFee] = useState(null);
  const [password, setpassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenThree, setisOpenThree] = useState(false);
  const [invalid, setinvalid] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [WalletProvider, setWalletProvider] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState(null);

  const [ListTokenSwap, setListTokenSwap] = useState(null);

  const [encrymnemonicKey, setEncrymnemonicKey] = useState(null);
  const [SwapTonFee, setSwapTonFee] = useState(0.01);

  const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const amountIn = ethers.parseUnits(tokenOneAmount || "0", "ether");
  const tokenIn = tokenOne.address;
  const tokenOut = tokenTwo.address;
  const uniswapRouter = new ethers.Contract(
    uniswapRouterAddress,
    ABI_SWAP.ABI_SWAP,
    WalletProvider
  );

  const [tokenSwapLoading, setTokenSwapLoading] = useState(true);
  const [fetchingInput, setFetchingInput] = useState(false);

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }
  function onCancelModalThree() {
    setisOpenThree(false);
    setpassword(null);
    setinvalid(false);
  }
  function onCancelModalTwo() {
    setIsOpenTwo(false);
    setError("");
  }

  function openModalTwo() {
    setIsOpenTwo(true);
    setisOpenThree(false);
    SetAmountModal();
    SetestimateSwapFee();
  }
  function openModalThree() {
    setisOpenThree(true);
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

  function modifyToken(i) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    // setTokenOneAmount("");
    // setTokenTwoAmount("");
    if (changeToken === 1) {
      setTokenOne(ListTokenSwap[i]);
      // fetchPrices(tokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(ListTokenSwap[i]);
      // fetchPrices(tokenOne.address, tokenList[i].address);
    }
    setIsOpen(false);
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices).toFixed(4));
    } else {
      setTokenTwoAmount(null);
    }
  }

  function SetAmountModal() {
    if (prices) {
      SetTokenTwoAmountModal((1 * prices).toFixed(2));
    } else {
      SetTokenTwoAmountModal(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount("");
    setTokenTwoAmount("");
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    // fetchPrices(two.address, one.address);
  }

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  async function decryptedBytes(password) {
    const encryptedSeedPhrase = localStorage.getItem("encrypt-seedPhrase");

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedSeedPhrase, password);
    const seedPhrase = await decryptedBytes.toString(CryptoJS.enc.Utf8);

    return seedPhrase;
  }

  async function encryptedBytes(secretKey) {
    const encrysecretKey = CryptoJS.AES.encrypt(
      secretKey,
      "HR#s&7uP@l!9tYA"
    ).toString();
    return encrysecretKey;
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

      setRecipient(Wallet.address);
      setWalletProvider(Walletprovider);
      openModalTwo();
      setisOpenThree(false);
    } catch {
      setinvalid(true);
    }
  }

  async function ConfirmPasswordTVM() {
    try {
      const decryptedSeedPhrase = await decryptedBytes(password);

      const Wallet = await ethers.Wallet.fromPhrase(decryptedSeedPhrase);
      const encrymnemonicKey = await encryptedBytes(decryptedSeedPhrase);
      setEncrymnemonicKey(encrymnemonicKey);
      openModalTwo();
    } catch {
      setinvalid(true);
    }
  }

  async function SwapTokens() {
    try {
      setIsLoading(true);

      const tx = await uniswapRouter.swapExactTokensForTokens(
        amountIn,
        0,
        [tokenIn, tokenOut],
        recipient,
        Math.floor(Date.now() / 1000) + 60 * 1,
        {
          gasLimit: 21000,
        }
      );

      const receipt = await tx.wait();
      setIsLoading(false);

      Swal.fire({
        title: "Swap Completed!",
        text: "Your transaction has been successfully processed.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        footer: '<a href="Where to navigate on click?">View Transaction</a>',
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } catch (error) {
      setIsLoading(false);

      Swal.fire({
        title: "Swap Failed!",
        text: "Unable to complete your transaction at this time.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
        footer: '<a href="Where to navigate on click?">Need Help?</a>',
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    }
  }

  useEffect(() => {
    setTokenSwap();
  }, [selectedChain]);

  async function fetchTokenTONPrice() {
    setPrices(null);
    setFetchingInput(true);
    try {
      sleep(1500);
      const res = await axios.get(`${process.env.REACT_APP_API_PRICETON}`, {
        params: {
          idApiOne: tokenOne.idApi || TokenListTon[0].idApi,
          idApiTwo: tokenTwo.idApi || TokenListTon[1].idApi,
        },
      });

      setPrices(res.data);
      setFetchingInput(false);
    } catch (error) {
      setFetchingInput(false);
      console.log(error);
    }
  }

  async function fetchPrices(one, two) {
    setPrices(null);

    const res = await axios.get(`${process.env.REACT_APP_API_TOKENPRICE}`, {
      params: { addressOne: one, addressTwo: two },
    });

    setPrices(res.data);
  }

  function setTokenSwap() {
    const tokens = selectedChain === "0x2" ? TokenListTon : tokenList;
    setListTokenSwap(tokens);
    setTokenOne(tokens[0]);
    setTokenTwo(tokens[1]);
    setTokenSwapLoading(false);
  }

  useEffect(() => {
    sleep(2500);
    selectedChain === "0x2"
      ? fetchTokenTONPrice()
      : fetchPrices(tokenOne.address, tokenTwo.address);
  }, [tokenOne, tokenTwo, !tokenSwapLoading]);

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  async function swapTon() {
    setIsOpenTwo(false);
    try {
      setIsLoading(true);

      let url;
      if (tokenOne.ticker === "TON") {
        url = `${process.env.REACT_APP_API_SWAPTONTOJETTON}`;
      } else if (tokenTwo.ticker === "TON") {
        url = `${process.env.REACT_APP_API_SWAPJETTONTOTON}`;
      } else {
        url = `${process.env.REACT_APP_API_SWAPJETTONTOJETTON}`;
      }

      const res = await axios.post(url, {
        amount: tokenOneAmount,
        addressOne: tokenOne.address,
        addressTwo: tokenTwo.address,
        from: tokenOne.address,
        to: tokenTwo.address,
        encrysecretKey: encrymnemonicKey,
        amount_In: tokenOneAmount,
        feeGas: "0.3",
        feeGasForward: "0.25",
        minimal_AmountOut: "0.01",
      });

      setIsLoading(false);

      Swal.fire({
        title: "Swap Completed!",
        text: "Your transaction has been successfully processed.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        footer: '<a href="Where to navigate on click?">View Transaction</a>',
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } catch {
      setIsLoading(false);
      Swal.fire({
        title: "Swap Failed!",
        text: "Unable to complete your transaction at this time.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
        footer: '<a href="Where to navigate on click?">Need Help?</a>',
        showConfirmButton: true,
        timer: 5000, // Optional: you may remove the timer if you want the user to close it manually
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <Modal
        className="Modal-token"
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {ListTokenSwap?.map((e, i) => {
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
        open={isOpenTwo}
        footer={null}
        onCancel={() => onCancelModalTwo()}
        title="Info Swap"
        style={{
          caretColor: "transparent",
          height: "371.56px",
        }}
      >
        <div className="Info-Swap">
          <div className="Logoicon">
            <img
              src={tokenOne.img}
              alt={tokenOne.ticker}
              className="tokenLogoSwapOne"
            />
            <DoubleRightOutlined />
            <DoubleRightOutlined />
            <DoubleRightOutlined />
            <img
              src={tokenTwo.img}
              alt={tokenTwo.ticker}
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

            {selectedChain === "0x2" ? (
              <div className="Gas">{SwapTonFee} Ton</div>
            ) : (
              <div className="Gas">{SwapFee} ETH</div>
            )}
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
            <Button
              className="Confirm"
              onClick={() =>
                selectedChain === "0x2" ? swapTon() : SwapTokens()
              }
            >
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
          {/* <button
            className="btn-swapConfirm"
            disabled={!password}
            onClick={() =>
              selectedChain === "0x2" ? ConfirmPasswordTVM() : ConfirmPassword()
            }

            // onClick={() => openModalTwo()}
          >
            Confirm
          </button> */}
          <center>
            <button
              className="codepro-custom-btn codepro-btn-15"
              style={{ height: "55px", width: "50%", margin: "55px 0 30px 0" }}
              target="blank"
              title="Code Pro"
              onClick={() =>
                selectedChain === "0x2"
                  ? ConfirmPasswordTVM()
                  : ConfirmPassword()
              }
            >
              Confirm
            </button>
          </center>
        </div>
      </Modal>
      <div className="swap-interface">
        <div className="swap-header" style={{ display: "block" }}>
          <h4
            style={{
              display: "grid",
              justifyItems: "center",
              jusfontFamily: "serif",
            }}
          >
            Swap
          </h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomLeft"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="swap-body">
          <div className="input-group">
            <div className="assetOne" onClick={() => openModal(1)}>
              <img
                src={tokenOne.img}
                alt="assetOneLogo"
                className="assetLogo"
              />
              <div className="tokenTicker">{tokenOne.ticker}</div>
              <DownOutlined />
            </div>
            <Input
              placeholder="0"
              value={tokenOneAmount}
              onChange={changeAmount}
              disabled={!prices}
            />
            {!prices && <span class="loader"></span>}{" "}
          </div>
          <Button className="swap-icon" onClick={switchTokens}>
            <SwapOutlined />
          </Button>
          <div className="input-group">
            <div className="assetTwo" onClick={() => openModal(2)}>
              <img
                src={tokenTwo.img}
                alt="assetOneLogo"
                className="assetLogo"
              />
              <div className="tokenTicker"> {tokenTwo.ticker}</div>

              <DownOutlined />
            </div>
            <Input
              placeholder="0"
              value={tokenTwoAmount}
              disabled={!tokenOneAmount}
            />
          </div>
        </div>
        {/* <Button
          className="swap-button"
          // onClick={fetchTokenTONPrice}
          onClick={openModalThree}
        >
          Swap
        </Button> */}

        <center>
          <button
            className="codepro-custom-btn codepro-btn-15"
            style={{ marginTop: "26px", width: "100%" }}
            target="blank"
            title="Code Pro"
            onClick={openModalThree}
          >
            Swap
          </button>
        </center>
      </div>
    </>
  );
};

export default SwapComponent;
