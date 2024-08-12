import React from "react";
import congrats from "./img/congrats-9.gif";
import { useNavigate } from "react-router-dom";

const Congratulation = () => {
  const navigate = useNavigate();

  // PHAO HOA

  return (
    <div className="start-come-to-wallet">
      <div className="onboarding-flow__wrapper">
        <div className="creation-successful" data-testid="creation-successful">
          <div className="box box--flex-direction-row box--text-align-center text-center">
            <h2 className="box box--margin-6 box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h2 typography--weight-bold typography--style-normal typography--color-text-default text-center">
              Wallet creation successful
            </h2>
            <img
              className="text-center"
              style={{
                height: "100px",
                width: "200px",
              }}
              src={congrats}
            />
            <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default text-center">
              You’ve successfully protected your wallet. Keep your Secret
              Recovery Phrase safe and secret -- it’s your responsibility!
            </h4>
          </div>
          <h4 className="box box--margin-top-1 box--margin-bottom-1 box--margin-left-12 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
            Remember:
          </h4>
          <ul>
            <li>
              <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                Multi can’t recover your Secret Recovery Phrase.
              </h4>
            </li>
            <li>
              <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                Multi will never ask you for your Secret Recovery Phrase.
              </h4>
            </li>
            <li>
              <h4 className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                <span>
                  {" "}
                  <span className="fw-bold">
                    Never share your Secret Recovery Phrase
                  </span>{" "}
                  with anyone or risk your funds being stolen{" "}
                </span>
              </h4>
            </li>
            <li>
              <a
                className="btn-link"
                href="https://community.Prominer.io/t/what-is-a-secret-recovery-phrase-and-how-to-keep-your-crypto-wallet-secure/3440"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </li>
          </ul>
          <div
            className="box creation-successful__actions box--margin-top-6 d-flex justify-content-center"
            style={{ width: "100%" }}
          >
            <button
              className="btn btn-primary btn-custom btn-to-home"
              onClick={() => navigate("/my-wallet")}
            >
              Got it!
            </button>

            {/* <button
              className="btn btn-primary btn-create-wallet btn-custom"
              onClick={() => navigate("/my-wallet")}
            >
              Create a new wallet
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congratulation;
