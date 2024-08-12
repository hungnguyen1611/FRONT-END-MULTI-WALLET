import React from "react";
import { useNavigate } from "react-router-dom";

const HelpUsImprove = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="start-come-to-wallet">
        <div className="onboarding-flow__wrapper">
          <div
            className="onboarding-metametrics"
            data-testid="onboarding-metametrics"
          >
            <h4 className="text-center">Help us improve Multi</h4>

            <div className="full-content-help-us">
              <p className="text-center">
                Multi would like to gather usage data to better understand how
                our users interact with Multi. This data will be used to provide
                the service, which includes improving the service based on your
                use.
              </p>
              <p className="text-center">Multi will...</p>
              <ul className="list-rules-us">
                <li>
                  <i className="bi bi-check-lg"></i> Always allow you to opt-out
                  via Settings
                </li>
                <li>
                  <i className="bi bi-check-lg"></i>
                  Send anonymized click and pageview events
                </li>
                <li>
                  <div className="box box--flex-direction-row">
                    <i className="bi bi-x-lg"></i>
                    <span className="fw-bold">Never</span> collect information
                    we don’t need to provide the service (such as keys,
                    addresses, transaction hashes, or balances){" "}
                  </div>
                </li>
                <li>
                  <div className="box box--flex-direction-row">
                    <i className="bi bi-x-lg"></i>
                    <span className="fw-bold">Never</span> collect your full IP
                    address*{" "}
                  </div>
                </li>
                <li>
                  <div className="box box--flex-direction-row">
                    <i className="bi bi-x-lg"></i>
                    <span className="fw-bold">Never</span> sell data. Ever!{" "}
                  </div>{" "}
                </li>
              </ul>
              <div
                className="description"
                style={{ fontSize: "0.87rem", margin: "4px 0px" }}
              >
                <span className="text-justify">
                  This data is aggregated and is therefore anonymous for the
                  purposes of General Data Protection Regulation (EU) 2016/679.
                </span>
              </div>
              <div
                className="description"
                style={{ fontSize: "0.87rem", margin: "4px 0px" }}
              >
                <span className="text-justify">
                  <span>
                    {" "}
                    * When you use Infura as your default RPC provider in Multi,
                    Infura will collect your IP address and your Ethereum wallet
                    address when you send a transaction. We don’t store this
                    information in a way that allows our systems to associate
                    those two pieces of data. For more information on how Multi
                    and Infura interact from a data collection perspective, see
                    our update{" "}
                    <a
                      href="https://consensys.net/blog/news/consensys-data-retention-update/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                    . For more information on our privacy practices in general,
                    see our{" "}
                    <a
                      href="https://Prominer.io/privacy.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy here
                    </a>
                    .{" "}
                  </span>
                </span>
              </div>
            </div>

            <div className="onboarding-metametrics__buttons">
              <button
                className="btn btn-outline-primary btn-agree btn-custom"
                onClick={() => navigate("/review-recovery-key")}
              >
                I agree
              </button>
              <button
                className="btn btn-outline-primary btn-deny btn-custom"
                onClick={
                  () => navigate("/review-recovery-key")
                  // navigate("/create-password")
                }
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpUsImprove;
