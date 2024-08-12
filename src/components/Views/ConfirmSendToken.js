import React from "react";
import Swal from "sweetalert2";

const ConfirmSendToken = ({
  res,
  recipientAddress,
  amount,
  symbol,
  setInfor,
}) => {
  const addressSender = res?.contract?.runner?.address;

  const handleCopy = () => {
    navigator.clipboard.writeText(res?.txhash);
  };

  const onClose = () => {
    Swal.close();
  };

  return (
    <>
      <div className="confirm-send-token">
        <div className="header-info-send">
          <div className="account">
            <div
              data-bs-toggle="modal"
              data-bs-target="#from"
              onClick={() =>
                setInfor({ address: addressSender, people: "Sending" })
              }
            >
              {addressSender?.slice(-6) + "..." + addressSender?.slice(-7)}
            </div>
          </div>
          <div className="arrow">
            <div>
              <i className="fa fa-arrow-right" />
            </div>
          </div>
          <div className="recipient">
            <div
              data-bs-toggle="modal"
              data-bs-target="#from"
              onClick={() =>
                setInfor({ address: recipientAddress, people: "Recieving" })
              }
            >
              {recipientAddress?.slice(-6) +
                "..." +
                recipientAddress?.slice(-7)}
            </div>
          </div>
        </div>
        <div className="body-info-send">
          <div className="contract">
            <div>
              <span>
                <strong> Contract Address </strong>
              </span>
              <div className="address">
                <a
                  className="text-center"
                  target="_blank"
                  href={`https://bscscan.com/token/${res?.contract?.target}`}
                >
                  {res?.contract?.target}
                </a>
              </div>
            </div>
            <div className="d-flex justify-content-evenly">
              <div className="p-2">Logo</div>
              <div className="p-2">
                <strong>{`${amount} ${symbol}`}</strong>
              </div>
            </div>
          </div>
          <div className="details">
            <hr />
            <div className="text-center">
              <strong>Details</strong>
            </div>
            <hr />

            <div className="tx-hash">
              <div className="mb-3">
                <strong>HEX DATA</strong>
              </div>
              <div className="fst-italic">
                <span onClick={handleCopy}>
                  {res?.txhash.slice(0, 10)} ... {res?.txhash.slice(-10)}
                </span>
              </div>
            </div>
            <div className="total-info">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>Total:</strong>
                </div>
                <div>
                  <strong>
                    {amount} {symbol} + {res?.estimatedGasCost} BNB
                  </strong>
                </div>
              </div>
              <div className="text-end">Amount + fee gas</div>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default ConfirmSendToken;
