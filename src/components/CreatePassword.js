import React, { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Wallet } from "zksync-web3";
import CryptoJS from "crypto-js";
import logo from "../pays.png";

import { Keypair } from "@solana/web3.js";

import { Buffer } from "buffer";

import { generateMnemonic, mnemonicToSeedSync, mnemonicToSeed } from "bip39";

window.Buffer = Buffer;

const SetPassword = ({ seedPhrase, setWallet }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [formPass, setFormPass] = useState({
    password: "",
    confirmPassword: "",
  });
  const [match, setMatch] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const { password, confirmPassword } = formPass;
  const encryptAndStoreSeedPhrase = (seedPhrase, password) => {
    const encryptedText = CryptoJS.AES.encrypt(
      seedPhrase?.toString(),
      password
    );

    return encryptedText;
  };

  const decryptSeedPhrase = (password) => {
    const encryptedSeedPhrase = localStorage.getItem("encrypt-seedPhrase");
    if (encryptedSeedPhrase) {
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedSeedPhrase,
        password
      );
      const decryptedSeedPhrase = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decryptedSeedPhrase;
    }
    return null;
  };

  const onChange = useCallback(
    (e) => {
      setFormPass({ ...formPass, [e.target.name]: e.target.value });
    },
    [password, confirmPassword, formPass]
  );

  useEffect(() => {
    if (
      password != confirmPassword ||
      !isChecked ||
      password == "" ||
      confirmPassword == ""
    ) {
      setIsDisabled(true);
    } else setIsDisabled(false);
  });

  const setPassword = async () => {
    const encryptSeedPhrase = encryptAndStoreSeedPhrase(seedPhrase, password);

    localStorage.setItem("encrypt-seedPhrase", encryptSeedPhrase);

    const decrypt = decryptSeedPhrase(password);
    const zksyncwallet = Wallet.fromMnemonic(decrypt);
    setWallet(zksyncwallet.address);
    localStorage.setItem("wallet", zksyncwallet.address);

    const seed = await mnemonicToSeedSync(seedPhrase);

    const keypair = Keypair.fromSeed(seed.slice(0, 32));

    const publicKey = keypair.publicKey.toString();

    localStorage.setItem("WalletSln", publicKey);

    navigate("/create-wallet-success");
    return;
  };

  return (
    <>
      <div className="start-come-to-wallet">
        <div className="onboarding-flow__wrapper">
          <div
            className="create-password__wrapper"
            data-testid="create-password"
          >
            <div className="box box--margin-bottom-4 box--flex-direction-row">
              <ul className="progressbar">
                <li className="active complete">Secure wallet</li>
                <li className="active complete">
                  Confirm secret recovery phrase
                </li>
                <li className="active">Create password</li>
              </ul>
            </div>
            <h2
              className="text-center fw-bold box--margin-top-1"
              style={{ marginBottom: "10px" }}
            >
              Create password
            </h2>
            <h4
              className="text-center typography--h4 box--margin-top-1"
              style={{ fontSize: "1.15rem", lineHeight: "140%" }}
            >
              This password will unlock your Multi wallet only on this device.
              Multi can not recover this password.
            </h4>
            <div className="d-flex justify-content-center box--margin-top-1">
              <form className="create-password__form">
                <div className="form-field box--margin-top-1">
                  <label className="mm-box">
                    <div
                      className="d-flex justify-content-between"
                      style={{ fontSize: "0.87rem", paddingBottom: "5px" }}
                    >
                      <div className="mm-box form-field__heading-title mm-box--display-flex mm-box--align-items-baseline">
                        <h6
                          className="fw-bold box--margin-top-1"
                          style={{ fontSize: "0.87rem" }}
                          tag="label"
                        >
                          New password (8 characters min)
                        </h6>
                      </div>
                      <div className="mm-box form-field__heading-detail mm-box--margin-right-2 mm-box--text-align-end">
                        <h6 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h7 typography--weight-normal typography--style-normal typography--color-text-default">
                          <a
                            data-testid="show-password"
                            className="create-password__form--password-button"
                            style={{ fontSize: "0.87rem" }}
                            onClick={() => setIsShow(!isShow)}
                          >
                            {!isShow ? "Show" : "Hide"}
                          </a>
                        </h6>
                      </div>
                    </div>
                    <input
                      className="form-field__input"
                      type={isShow ? "text" : "password"}
                      value={password}
                      name="password"
                      onChange={onChange}
                    />
                  </label>
                </div>
                <div className="form-field box--margin-top-1">
                  <label className="mm-box">
                    <div className="form-field__heading box--margin-top-1">
                      <div className="mm-box form-field__heading-title mm-box--display-flex mm-box--align-items-baseline">
                        <h6
                          className="fw-bold box--margin-top-1"
                          tag="label"
                          style={{ fontSize: "0.87rem" }}
                        >
                          Confirm password
                        </h6>
                      </div>
                    </div>
                    <input
                      className="form-field__input"
                      type={isShow ? "text" : "password"}
                      data-testid="create-password-confirm"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={onChange}
                    />
                  </label>
                </div>
                <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-space-between box--align-items-center box--display-flex box--margin-top-1">
                  <label className="create-password__form__terms-label d-flex">
                    <input
                      className="check-box far fa-square"
                      readOnly=""
                      data-testid="create-password-terms"
                      type="checkbox"
                      value={isChecked}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        fontWeight: 400,
                        cursor: "pointer",
                      }}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <h5 className="box box--margin-top-1 box--margin-bottom-1 box--margin-left-3 box--flex-direction-row typography typography--h5 typography--weight-normal typography--style-normal typography--color-text-default">
                      <span>
                        {" "}
                        I understand that Multi cannot recover this password for
                        me.{" "}
                        <a
                          href="https://Prominer.zendesk.com/hc/en-us/articles/4404722782107"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="create-password__link-text">
                            Learn more
                          </span>
                        </a>{" "}
                      </span>
                    </h5>
                  </label>
                </div>
                <button
                  disabled={isDisabled}
                  className="btn btn-primary btn-custom"
                  onClick={() => setPassword()}
                  style={{ padding: "12px 0", marginTop: "22px" }}
                >
                  Create a new wallet
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetPassword;
