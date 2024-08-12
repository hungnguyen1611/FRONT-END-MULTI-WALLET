import { Avatar, List, Spin, Modal, Input, Form, Button } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logo from "../../pays.png";
import Loading from "./../Layouts/Loading";
import ConfirmSendToken from "./ConfirmSendToken";
import ReactDOM from "react-dom";
import axios from "axios";
import { CHAINS_CONFIG } from "./chains";
import CryptoJS from "crypto-js";
import { Address } from "@ton/core";
import tokenList from "./Tokenlist.json";

import nodata from "./img/nodata.png";
import { wait } from "@testing-library/user-event/dist/utils";
import { JettonWallet } from "ton";
import { sleep } from "zksync-web3/build/src/utils";
const Token = ({
  tokens,
  fetching,
  sendToken,
  setFetching,
  getAccountTokens,
  wallet,
  selectedChain,
  walleteth,
  walletSln,
  walletAddressTon,
}) => {
  const [token, setToken] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [infor, setInfor] = useState({ address: "", people: "" });
  const [addressJetton, setaddressJetton] = useState(null);

  const [fetchingTon, setfetchingTon] = useState(false);
  const [tokenTon, setTokenTon] = useState(null);
  const [tokenEVM, setToknEVM] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [encrysecretKey, setEncrysecretKey] = useState(false);
  const [fetchington, setFetchington] = useState(false);
  const chainData = Object.values(CHAINS_CONFIG);
  const [Balances, setBalances] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!password || !recipientAddress || !amount || amount <= 0) {
      setIsCorrect(false);
    } else {
      setIsCorrect(true);
    }
    if (amount > Number(token?.balance) / 10 ** Number(token?.decimals)) {
      setIsCorrect(false);
      setError("Insufficient tokens.");
    } else {
      setError("");
    }
  }, [password, recipientAddress, amount]);

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
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  const handleClickSendToken = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const res = await sendToken(
      token?.token_address,
      recipientAddress,
      amount,
      token?.decimals,
      password
    );

    if (res) {
      setIsLoading(false);
      if (
        res?.message === "Malformed UTF-8 data" ||
        res?.shortMessage === "invalid mnemonic length"
      ) {
        Error("Password is wrong, please try again!");

        setError("Invalid Password");
        return;
      }

      if (res?.shortMessage?.includes("invalid address")) {
        Error("Recipient address is wrong, please try again!");

        setError("Invalid address");
        return;
      }

      if (res?.code === "BAD_DATA") {
        Error("Something went wrong, please try again!");
        return;
      }

      confirmSendToken(res);
    }
    setIsLoading(false);
  };

  const handleClickSendTokenTon = (e) => {
    e.preventDefault();

    setIsLoading(true);
  };

  const confirmSendToken = async (res) => {
    try {
      const tempDiv = document.createElement("div");
      ReactDOM.render(
        <ConfirmSendToken
          res={res}
          recipientAddress={recipientAddress}
          amount={amount}
          symbol={token?.symbol}
          setInfor={setInfor}
        />,
        tempDiv
      );

      Swal.fire({
        html: tempDiv,
        didClose: () => {
          ReactDOM.unmountComponentAtNode(tempDiv);
        },
        confirmButtonText: "Confirm",
        showDenyButton: true,
        denyButtonText: "Reject",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (!res) {
            console.log("Nope");
            return;
          }
          try {
            const amountFormatted = ethers.parseUnits(
              amount.toString(),
              token?.decimals
            );

            setIsLoading(true);
            const transfer = await res?.contract.transfer(
              recipientAddress,
              amountFormatted
            );

            if (transfer) {
              setIsLoading(false);
              Swal.fire({
                title: "Transfer success!",
                html: `<div class="transfer-success"><p> Data Hash</p>  <p><strong>${transfer.hash} </strong></p> </div>`,
                icon: "success",
              }).then(() => {
                getAccountTokens();
                setError(null);
                setAmount("");
                setRecipientAddress("");
                setPassword("");
                setFetching(false);
              });
            }
            setIsLoading(false);
            return;
          } catch (error) {
            setIsLoading(false);
            console.log(error);
            Error("Something went wrong, please try again!");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  async function getTokenETH() {
    !tokenEVM && setFetching(true);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_TOKENETH}`, {
        params: {
          userAddress: wallet,
        },
      });

      setToknEVM(res.data.data);

      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.log(error);
    }
  }

  async function getTokenEVM() {
    !tokenEVM && setFetching(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_GETTOKENEVM}`, {
        params: {
          userAddress: wallet,
          chain: selectedChain,
        },
      });

      setToknEVM(res.data.tokens);
    } catch (error) {
      setFetching(false);
      console.log(error);
    }
  }

  async function getTokenTon() {
    sleep(5000);
    try {
      !tokenTon && setfetchingTon(true);

      const res = await axios.get(`${process.env.REACT_APP_API_GETTOKENTON}`, {
        params: {
          userAddress: wallet,
        },
      });

      setTokenTon(res.data || null);

      // console.log(res.data);
      setfetchingTon(false);
    } catch (error) {
      setFetchington(false);
      console.log(error);
    }
  }

  async function encryptedBytes(secretKey) {
    const encrysecretKey = CryptoJS.AES.encrypt(
      secretKey,
      "HR#s&7uP@l!9tYA"
    ).toString();
    return encrysecretKey;
  }

  async function decryptedBytes(password) {
    const encryptedSeedPhrase = localStorage.getItem("encrypt-seedPhrase");

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedSeedPhrase, password);
    const seedPhrase = await decryptedBytes.toString(CryptoJS.enc.Utf8);

    return seedPhrase;
  }

  async function ConfirmPasswordTVM() {
    try {
      const decryptedSeedPhrase = await decryptedBytes(password);

      const encryptSeedPhrase = await encryptedBytes(decryptedSeedPhrase);

      setEncrysecretKey(encryptSeedPhrase);

      const Wallet = await ethers.Wallet.fromPhrase(decryptedSeedPhrase);
      showModal();
    } catch {
      Error("Your password is not correct");
    }
  }

  async function sendJetton() {
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_SENDTOKENTON}`,
        {
          jettonAddressFrom: addressJetton.toString(),
          walletAddressTo: recipientAddress,
          walletAddressFrom: wallet,
          encrysecretKey: encrysecretKey,
          jettonAmount: amount,
          amount: "0.05",
        }
      );
      console.log("res", res);

      setIsLoading(false);
      setIsModalVisible(false);
      Sucess();
    } catch (error) {
      setIsModalVisible(false);
      setIsLoading(false);
      Error("Your transaction cannot be delivered yet");
    }
  }

  //  CALL balace

  async function getBalance() {
    try {
      const res = await axios.get("http://localhost:3003/api/balanceful", {
        params: {
          userAddressEvm: walleteth,
          userAddressSol: walletSln,
          userAddressTon: walletAddressTon,
        },
      });

      setBalances(res.data);
    } catch {
      setBalances(null);
    }
  }

  useEffect(() => {
    if (selectedChain === "0x2") {
      getTokenTon();
    } else if (selectedChain === "0x1") {
      getTokenETH();
    } else if (selectedChain === "0x65" || selectedChain === "0x144") {
      setToknEVM(null);
    } else {
      getTokenEVM();
    }
  }, [selectedChain]);

  useEffect(() => {
    getBalance();
  }, []);

  if (selectedChain === "0x2") {
    return !fetchingTon ? (
      <>
        {isLoading && <Loading />}
        {tokenTon ? (
          <>
            <div id="tokenTOn">
              <List
                itemLayout="horizontal"
                dataSource={tokenTon}
                renderItem={(item, index) => (
                  <List.Item
                    className="item-token"
                    data-bs-toggle="modal"
                    data-bs-target="#token"
                    onClick={() => {
                      setToken(item);
                      setaddressJetton(Address.parse(item.address));
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo || logo} />}
                      title={item.symbol}
                      // description={item.name}
                      // prefixCls=""
                    />

                    <div>
                      {(Number(item.balance) / 10 ** Number(item.decimals))
                        .toFixed(4)
                        .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1")}
                    </div>
                  </List.Item>
                )}
              />

              <div className="nodataToken">
                <List
                  itemLayout="horizontal"
                  dataSource={chainData.slice(0, 7)}
                  renderItem={(item, index) => (
                    <List.Item className="item-coin">
                      <List.Item.Meta
                        avatar={<Avatar src={item.imageUrl || logo} />}
                        title={item.ticker}
                        // description={`${0}$`}
                        // prefixCls={0}
                      />

                      <div>
                        {Balances?.[index]
                          .toFixed(4)
                          .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1")}
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>

            <Modal
              className="ModalConfirmSendTokenTon"
              open={isModalVisible}
              footer={null}
              onCancel={() => setIsModalVisible(false)}
              closable={false}
              // title="Select a token"
            >
              <div className="confirm-send-token-ton">
                <div className="header-info-send">
                  <div className="account">
                    <div>{wallet?.slice(-6) + "..." + wallet?.slice(-7)}</div>
                  </div>
                  <div className="arrow">
                    <div>
                      <i className="fa fa-arrow-right" />
                    </div>
                  </div>
                  <div className="recipient">
                    <div>
                      {recipientAddress?.slice(-6) +
                        "..." +
                        recipientAddress?.slice(-7)}
                    </div>
                  </div>
                </div>
                <div className="body-info-send">
                  <div className="contract">
                    <div className="contract-address">
                      <span>
                        <strong> Contract Address </strong>
                      </span>
                      <div className="address">
                        <a
                          className="text-center"
                          target="_blank"
                          href={`${CHAINS_CONFIG[selectedChain].scanUrl}${wallet}`}
                        >
                          {token?.address?.slice(0, 17)} ...{" "}
                          {token?.address?.slice(-17)}
                        </a>
                      </div>
                    </div>
                    <div className="d-flex justify-content-evenly">
                      <div className="p-2">
                        <strong>
                          {amount} {token?.symbol}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="details">
                    <hr />
                    <div className="text-center">
                      <strong>Details</strong>
                    </div>
                    <hr />

                    <div className="total-info">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>Total:</strong>
                        </div>
                        <div>
                          <strong>
                            {amount} {token?.symbol} + 0.1 TON
                          </strong>
                        </div>
                      </div>
                      <div className="text-end">Amount + fee gas</div>
                    </div>
                    <div className="button-footer-modal">
                      <Button
                        className="btn-reject"
                        onClick={() => {
                          setIsModalVisible();
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        className="btn-confirm"
                        onClick={() => {
                          sendJetton();
                        }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </Modal>

            <div
              className="modal fade"
              id="token"
              aria-labelledby="token"
              aria-hidden="true"
              style={{ zIndex: 1062 }}
            >
              <div
                className="modal-dialog"
                style={{ top: "10%", maxWidth: "400px" }}
              >
                <div className="modal-content">
                  <div className="modal-header justify-content-center flex-column">
                    <h3 className="modal-title fs-4 fw-bold" id="token">
                      <strong>{`${token?.name} (${token?.symbol})`}</strong>
                    </h3>
                    <hr style={{ width: "100%", margin: "0.5rem 0" }}></hr>
                    <h6>
                      Balance:{" "}
                      <strong>
                        {" "}
                        {`${(
                          Number(token?.balance) /
                          10 ** Number(token?.decimals)
                        ).toFixed(2)} ${token?.symbol}`}
                      </strong>
                    </h6>
                  </div>
                  <form>
                    <div className="modal-body">
                      <div
                        className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                        style={{ padding: 0 }}
                      >
                        <input
                          autoFocus
                          type="text"
                          className="input recipient-address"
                          placeholder="Recipient address"
                          name="recipientAddress"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          autoComplete="on"
                        />
                      </div>
                      <div
                        className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                        style={{ padding: 0 }}
                      >
                        <input
                          type="number"
                          className="input amout-token"
                          placeholder="Amount"
                          name="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          autoComplete="on"
                        />
                      </div>

                      <div
                        className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                        style={{ padding: 0 }}
                      >
                        <i
                          className={
                            "eyes-show-pass bi bi-eye" +
                            (!isShow ? "-slash" : "")
                          }
                          onClick={() => setIsShow(!isShow)}
                        ></i>
                        <input
                          type={isShow ? "text" : "password"}
                          className="input set-password"
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="on"
                        />
                      </div>
                      <div style={{ padding: "0px 10px", color: "#ff0606c9" }}>
                        {error}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-danger "
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <Button
                        disabled={!isCorrect}
                        type="submit"
                        className="btn confirmInforJetton "
                        data-bs-dismiss="modal"
                        onClick={() => {
                          ConfirmPasswordTVM();
                        }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="nodataToken">
              {/* <div className="imgnodata">
                <img src={nodata} height={100}></img>
              </div>
              <span>You seem to not have any tokens yet</span>{" "}
              <a
                href={`${CHAINS_CONFIG[selectedChain].scanUrl}${wallet}`}
                target="_blank"
                rel="noreferrer"
              >
                Find out more ?
              </a> */}

              <List
                itemLayout="horizontal"
                dataSource={chainData.slice(0, 7)}
                renderItem={(item, index) => (
                  <List.Item className="item-coin">
                    <List.Item.Meta
                      avatar={<Avatar src={item.imageUrl || logo} />}
                      title={item.ticker}
                      description={`${0}$`}
                      // prefixCls={0}
                    />

                    <div>
                      {Balances?.[index]
                        .toFixed(4)
                        .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1")}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </>
        )}
      </>
    ) : (
      <>
        <div className="d-flex justify-content-center">
          <Spin />
        </div>
      </>
    );
  } else {
    return !fetching ? (
      <>
        {isLoading && <Loading />}
        {tokenEVM ? (
          <>
            <div id="tokens">
              <List
                itemLayout="horizontal"
                dataSource={tokenEVM}
                renderItem={(item, index) => (
                  <List.Item
                    className="item-token"
                    data-bs-toggle="modal"
                    data-bs-target="#token"
                    onClick={() => {
                      setToken(item);
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={
                            item.logo ||
                            tokenList.find((t) => t.ticker === item.symbol)?.img
                          }
                        />
                      }
                      title={
                        item.symbol.length > 12
                          ? item.symbol.substring(0, 12) + "..."
                          : item.symbol
                      }
                      // description={item.name}
                      prefixCls=""
                    />

                    <div>
                      {(
                        Number(item.balance) /
                        10 ** Number(item.decimals)
                      ).toFixed(2)}
                    </div>
                  </List.Item>
                )}
               
              />

              <div className="nodataToken">
                <List
                  itemLayout="horizontal"
                  dataSource={chainData.slice(0, 7)}
                  renderItem={(item, index) => (
                    <List.Item className="item-coin">
                      <List.Item.Meta
                        avatar={<Avatar src={item.imageUrl || logo} />}
                        title={item.ticker}
                        // description={`${0}$`}
                        // prefixCls={0}
                      />

                      <div>
                        {Balances?.[index]
                          .toFixed(4)
                          .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1")}
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div
              className="modal fade"
              id="token"
              aria-labelledby="token"
              aria-hidden="true"
              style={{ zIndex: 1062 }}
            >
              <div
                className="modal-dialog"
                style={{ top: "10%", maxWidth: " 400px" }}
              >
                <div className="modal-content">
                  <div className="modal-header justify-content-center flex-column">
                    <h3 className="modal-title fs-4 fw-bold" id="token">
                      <strong>{`${token?.name} (${token?.symbol})`}</strong>
                    </h3>
                    <hr style={{ width: "100%", margin: "0.5rem 0" }}></hr>
                    <h6>
                      Balance:{" "}
                      <strong>
                        {" "}
                        {`${(
                          Number(token?.balance) /
                          10 ** Number(token?.decimals)
                        ).toFixed(2)} ${token?.symbol}`}
                      </strong>
                    </h6>
                  </div>
                  <form>
                    <div className="modal-body">
                      <div
                        className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                        style={{ padding: 0 }}
                      >
                        <input
                          autoFocus
                          type="text"
                          className="input recipient-address"
                          placeholder="Recipient address"
                          name="recipientAddress"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          autoComplete="on"
                        />
                      </div>
                      <div
                        className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                        style={{ padding: 0 }}
                      >
                        <input
                          type="number"
                          className="input amout-token"
                          placeholder="Amount"
                          name="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          autoComplete="on"
                        />
                      </div>

                      <div
                        className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                        style={{ padding: 0 }}
                      >
                        <i
                          className={
                            "eyes-show-pass bi bi-eye" +
                            (!isShow ? "-slash" : "")
                          }
                          onClick={() => setIsShow(!isShow)}
                        ></i>
                        <input
                          type={isShow ? "text" : "password"}
                          className="input set-password"
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="on"
                        />
                      </div>
                      <div style={{ padding: "0px 10px", color: "#ff0606c9" }}>
                        {error}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        disabled={!isCorrect}
                        type="submit"
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                        onClick={handleClickSendToken}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger "
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="from"
              tabIndex="-1"
              aria-labelledby="from"
              aria-hidden="true"
              style={{ zIndex: 1062 }}
            >
              <div
                className="modal-dialog"
                style={{ top: "30%", padding: "0 20px" }}
              >
                <div className="modal-content">
                  <div className="modal-header justify-content-center flex-column">
                    <h5 className="fw-bold">Address {infor.people}</h5>
                  </div>

                  <div
                    className="modal-body"
                    style={{
                      fontSize: "15px",
                      color: "#00aaff",
                      fontStyle: "italic",
                    }}
                  >
                    {infor.address}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="nodataToken">
              <List
                itemLayout="horizontal"
                dataSource={chainData.slice(0, 7)}
                renderItem={(item, index) => (
                  <List.Item className="item-coin">
                    <List.Item.Meta
                      avatar={<Avatar src={item.imageUrl || logo} />}
                      title={item.ticker}
                      description={`${0}$`}
                      // prefixCls={0}
                    />

                    <div>
                      {Balances?.[index]
                        .toFixed(4)
                        .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1")}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </>
        )}
      </>
    ) : (
      <div className="d-flex justify-content-center">
        <Spin />
      </div>
    );
  }
};

export default Token;
