import React, { useState, useEffect } from "react";
import { CHAINS_CONFIG } from "./chains";
import { Input, Spin, Modal } from "antd";
import axios from "axios";

const Transaction = ({
  sendTransaction,
  balance,
  selectedChain,
  hash,
  fetching,
  sendSol,
  TransactionTon,
  sendZksync,
}) => {
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [password, setPassword] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [invalid, setinvalid] = useState(false);
  const [isOpenThree, setisOpenThree] = useState(false);
  const [PriceBalance, setPriceBalance] = useState(null);

  function openModalThree() {
    setisOpenThree(true);
  }
  function onCancelModalThree() {
    setisOpenThree(false);
    setPassword(null);
    setinvalid(false);
  }

  async function getPriceAccountTokens() {
    
    setPriceBalance(null);

    try {
      const price = await axios.get(
        "http://localhost:3003/api/price/tokenAccount",
        {
          params: {
            idApi: CHAINS_CONFIG[selectedChain].idApi,
          },
        }
      );
      setPriceBalance(price.data);
    } catch {
      setPriceBalance(null);
    }
  }

  useEffect(() => {
    setAmountToSend(null);
    setSendToAddress(null);
    getPriceAccountTokens();
  }, [selectedChain]);

  return !fetching ? (
    <>
      <h4
        style={{ fontFamily: "serif", display: "grid", justifyItems: "center" }}
      >
        Native Balance{" "}
      </h4>
      <h2
        style={{ fontFamily: "serif", display: "grid", justifyItems: "center" }}
      >
        {balance
          ? balance?.toFixed(4).replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1")
          : 0}{" "}
        {CHAINS_CONFIG[selectedChain]?.ticker}
      </h2>

      <div className="price_balance">
        {balance && PriceBalance ? (balance * PriceBalance).toFixed(2) : 0} $
      </div>

      <div className="sendRow">
        <p style={{ fontFamily: "serif", textAlign: "left", marginBottom: 5 }}>
          {" "}
          To:
        </p>
        <Input
          value={sendToAddress}
          onChange={(e) => {
            setSendToAddress(e.target.value);
          }}
          placeholder="Address"
        />
      </div>
      <div className="sendRow">
        <p
          style={{
            fontFamily: "serif",
            textAlign: "left",
            margin: "15px 0 5px",
          }}
        >
          {" "}
          Amount:
        </p>
        <Input
          value={amountToSend}
          onChange={(e) => setAmountToSend(e.target.value)}
          placeholder="Native tokens you wish to send..."
        />
      </div>

      <center>
        <button
          className="codepro-custom-btn codepro-btn-15"
          style={{ marginTop: "40px", width: "100%" }}
          target="blank"
          title="Code Pro"
          onClick={openModalThree}
        >
          Send
        </button>
      </center>

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
              onChange={(e) => setPassword(e.target.value)}
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
              onClick={() => {
                if (selectedChain === "0x65") {
                  sendSol(sendToAddress, amountToSend, password);
                } else if (selectedChain === "0x2") {
                  TransactionTon(sendToAddress, amountToSend, password);
                } else if (selectedChain === "0x144") {
                  sendZksync(sendToAddress, amountToSend, password);
                } else {
                  sendTransaction(sendToAddress, amountToSend, password);
                }
              }}
            >
              Confirm
            </button>
          </center>
        </div>
      </Modal>
    </>
  ) : (
    <div className="d-flex justify-content-center">
      <Spin />
    </div>
  );
};

export default Transaction;
