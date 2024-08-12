import { Spin } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import nodata from "./img/nodata.png";
import { CHAINS_CONFIG } from "./chains";
import { sleep } from "zksync-web3/build/src/utils";
import { calc } from "antd/es/theme/internal";

const NFT = ({ fetching, wallet, selectedChain }) => {
  // const wallet = localStorage.getItem("wallet");
  // const selectedChain = localStorage.getItem("selectedChain");
  const [NFTS, setnfts] = useState(null);
  const [checkNft, setCheckNft] = useState(false);
  // console.log(wallet);

  const check = async () => {
    if (
      selectedChain === "0x144" ||
      selectedChain === "0x2" ||
      selectedChain === "0x65"
    ) {
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_NFTETH}`, {
        params: {
          userAddress: "0x91b51c173a4bdaa1a60e234fc3f705a16d228740",
          // userAddress: wallet,
          chain: selectedChain,
        },
      });

      if (res) {
        const nfts = await res?.data?.data?.nfts?.slice(0, 10);
        setnfts(nfts || null);
      } else {
        setnfts(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    selectedChain != "0x144" ||
      selectedChain != "0x65" ||
      (selectedChain != "0x2" && check());
  }, [selectedChain]);

  return !fetching ? (
    <>
      {NFTS && NFTS.length > 0 ? (
        <div id="nfts" className="imgNFT">
          {NFTS.map((e, i) => {
            return (
              <>
                {e && (
                  <img
                    key={i}
                    className="nftImage"
                    height={150}
                    width={180}
                    style={{
                      margin: "4px 0",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    src={e}
                    // onError={setCheckNft(true)}
                  />
                )}
              </>
            );
          })}
        </div>
      ) : (
        <>
          <div className="nodataToken">
            <div className="imgnodata">
              <img src={nodata} height={100}></img>
            </div>
            <span>Looks like you don't have any NFTS yet</span>{" "}
            <a
              href={`${CHAINS_CONFIG[selectedChain].scanUrl}${wallet}`}
              target="_blank"
              rel="noreferrer"
            >
              Find out more ?
            </a>
          </div>
        </>
      )}
    </>
  ) : (
    <div className="d-flex justify-content-center">
      <Spin />
    </div>
  );
};

export default NFT;
