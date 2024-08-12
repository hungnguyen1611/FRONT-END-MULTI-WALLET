import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const SecretKey = ({ setSeedPhrase }) => {
  const [mnemonic, setmnemonic] = useState("");

  function CreateSecretKey() {
    const mnemonic =
      "city finish level original shiver magnet mosquito good gorilla patient sign divorce";
    // const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setmnemonic(mnemonic);
  }

  const [isShowSecretKey, setIsShowSecretKey] = useState(false);

  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  function setSecretKey() {
    setSeedPhrase(mnemonic);

    navigate("/confirm-recovery-key");
  }

  useEffect(() => {
    CreateSecretKey();
  }, []);

  return (
    <>
      <div className="start-come-to-wallet">
        <div className="onboarding-flow__wrapper">
          <div className="recovery-phrase" data-testid="recovery-phrase">
            <div className="box box--flex-direction-row">
              <ul className="progressbar">
                {/* <li className="active complete">Create password</li>
                <li className="active">Secure wallet</li>
                <li className="">Confirm secret recovery phrase</li> */}
                <li className="active">Secure wallet</li>
                <li className="">Confirm secret recovery phrase</li>
                <li className="">Create password</li>
              </ul>
            </div>
            <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h2 className="text-center fw-bold box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography recovery-phrase__header typography--h2 typography--weight-bold typography--style-normal typography--color-text-default">
                Write down your Secret Recovery Phrase
              </h2>
            </div>
            <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default text-center">
                Write down this 12-word Secret Recovery Phrase and save it in a
                place that you trust and only you can access.
              </h4>
            </div>
            <div className="box recovery-phrase__tips box--margin-bottom-4 box--flex-direction-row box--text-align-left">
              <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-bold typography--style-normal typography--color-text-default">
                Tips:
              </h4>
              <ul>
                <li>
                  <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                    Save in a password manager
                  </h4>
                </li>
                <li>
                  <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                    Store in a safe deposit box
                  </h4>
                </li>
                <li>
                  <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                    Write down and store in multiple secret places
                  </h4>
                </li>
              </ul>
            </div>
            <div className="box recovery-phrase__secret box--margin-bottom-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1 text-center">
              <div
                className={
                  isShowSecretKey ? "" : "recovery-phrase__chips--hidden"
                }
              >
                <div className="input-confirm-secret-key">{mnemonic}</div>
              </div>
              <div
                hidden={isShowSecretKey}
                className="recovery-phrase__secret-blocker"
              >
                <i className="bi bi-eye" />
                Make sure nobody can see it..
              </div>
            </div>
            <div className="recovery-phrase__footer">
              <div className="recovery-phrase__footer__copy-and-hide">
                <div className="recovery-phrase__footer__copy-and-hide__area">
                  <a
                    className="button btn-link recovery-phrase__footer__copy-and-hide__button recovery-phrase__footer__copy-and-hide__button__hide-seed"
                    style={{ width: "max-content" }}
                    role="button"
                    onClick={() => setIsShowSecretKey(!isShowSecretKey)}
                  >
                    <span className="button__icon">
                      <i
                        className={
                          "bi " + (!isShowSecretKey ? "bi-eye" : "bi-eye-slash")
                        }
                        color="var(--color-primary-default)"
                      />
                    </span>
                    {!isShowSecretKey
                      ? "Reveal seed phrase"
                      : "Hide seed phrase"}
                  </a>
                  <div>
                    <a
                      className="button btn-link recovery-phrase__footer__copy-and-hide__button recovery-phrase__footer__copy-and-hide__button__copy-to-clipboard"
                      style={{ width: "max-content" }}
                      role="button"
                      tabIndex={0}
                      onClick={handleCopy}
                      hidden={!isShowSecretKey}
                    >
                      <span className="button__icon">
                        <i className="bi bi-copy"></i>
                      </span>
                      {!copied ? "Copy to clipboard" : "Copied"}
                    </a>
                  </div>
                </div>
                <button
                  className="button btn--rounded btn-primary recovery-phrase__footer--button btn-custom"
                  style={{
                    maxWidth: "300px",
                    backgroundColor: "var(--color-primary-default)",
                    alignSelf: "center",
                  }}
                  onClick={() => setSecretKey()}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecretKey;
