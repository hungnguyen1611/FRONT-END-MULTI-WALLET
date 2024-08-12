import React, { useState } from "react";
import bird from "./img/blockchainworld (1).png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [checkAgree, setCheckAgree] = useState(true);
  return (
    <>
      <div className="start-come-to-wallet">
        {/* <div className="">
          <h2 className="text-center" style={{ fontWeight: "550" }}>
            Let's get started
          </h2>
          <p className="text-center my-3 mx-3">
            Trusted by millions, Prominer is a secure wallet making the world of
            web3 accessible to all.
          </p>
          <div className="text-center">
            <img src={logo} alt="img" height={120} />
          </div>
        </div> */}

        <div className="text-center box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex image-enter">
          <img src={bird} height={190} />
        </div>

        <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
          <h3
            className="text-center box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h2 typography--weight-bold typography--style-normal typography--color-text-default"
            style={{ fontFamily: "cursive", marginBottom: "10px" }}
          >
            {/* 🎊 Welcome back! 🎊 */}
            Opening up your Web3 world
          </h3>
        </div>
        <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
          <p
            className="text-center box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default"
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              marginBottom: "10px",
              marginTop: "40px",
            }}
          >
            <marquee>Wallet - NFT - Token - Transaction</marquee>
          </p>
        </div>

        <div className="text-center mt-4">
          <div className="d-flex align-items-center justify-content-center">
            <input
              className="check-box onboarding__terms-checkbox far fa-square"
              id="onboarding__terms-checkbox"
              readOnly=""
              data-testid="onboarding-terms-checkbox"
              type="checkbox"
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
                fontWeight: 400,
                cursor: "pointer",
              }}
              checked={!checkAgree}
              onChange={() => setCheckAgree(!checkAgree)}
            />
            <label
              className="onboarding__terms-label"
              htmlFor="onboarding__terms-checkbox"
            >
              <span
                className="box mm-text mm-text--body-md box--margin-left-2 box--flex-direction-row box--color-text-default"
                style={{ fontFamily: "serif", fontSize: "18px" }}
              >
                <span>
                  I agree to Prominer'{"  "}
                  <a
                    className="create-new-vault__terms-link"
                    href="https://metamask.io/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of use
                  </a>
                </span>
              </span>
            </label>
          </div>
          <div
            className="my-3"
            // style={{ paddingTop: "50px" }}
          >
            {/* <div className="btn-create-wallet"> */}
            <button
              disabled={checkAgree}
              className="btn btn-primary btn-create-wallet btn-custom"
              onClick={() => navigate("/help-us-improve")}
            >
              Create a new wallet
            </button>
            {/* </div> */}
            {/* <div className="btn-import-wallet"> */}
            <button
              disabled={checkAgree}
              className="btn btn-outline-primary btn-import-wallet btn-custom"
              onClick={() => navigate("/import-wallet")}
            >
              Import an existing wallet
            </button>
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
