import { useState, React, useEffect } from "react";

import axios, { formToJSON } from "axios";
import { CHAINS_CONFIG } from "./chains";
import { Spin } from "antd";
import nodata from "./img/nodata.png";
import { sleep } from "zksync-web3/build/src/utils";

const Activity = ({ selectedChain, wallet, fetching, setFetching }) => {
  const [txs, setTxs] = useState(null);
  const [txsTon, setTxsTon] = useState(null);
  const [txsSol, setTxsSol] = useState(null);
  const [txsEVm, setTxsEvm] = useState(null);

  async function fetchTxs() {
    !txsEVm && setFetching(true);

    try {
      sleep(2000);
      let res = await axios.get(`${process.env.REACT_APP_API_TXS}`, {
        params: { address: wallet, chain: selectedChain },
      });

      await setTxsEvm(res.data.slice(0, 10));
      setFetching(false);
    } catch {
      setTxs(null);
      setFetching(false);
    }
  }

  async function fetchTxsSol() {
    !txsSol && setFetching(true);

    try {
      let res = await axios.get(`${process.env.REACT_APP_API_TXSSOL}`, {
        params: {
          address: wallet,
        },
      });

      setTxsSol(res.data);

      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.log(error);
    }
  }

  async function fetchTxTon() {
    !txsTon && setFetching(true);

    try {
      let urlApi = process.env.REACT_APP_API_TSXTON;

      const res = await axios.get(urlApi, {
        params: {
          address: wallet,
        },
      });

      setTxsTon(res.data);
      setFetching(false);
    } catch (error) {
      setFetching(false);

      console.log(error);
    }
  }
  async function fetchTxsZk() {
    return;
  }

  useEffect(() => {
    if (selectedChain === "0x65") {
      setTxs(txsSol);
      fetchTxsSol();
    } else if (selectedChain === "0x2") {
      setTxs(txsTon);
      fetchTxTon();
    } else if (selectedChain === "0x144") {
      setTxs(null);
      fetchTxsZk();
    } else {
      setTxs(txsEVm);
      fetchTxs();
    }
  }, [selectedChain]);

  return !fetching ? (
    <>
      <div className="activity">
        {txs && txs.length ? (
          <div className="results">
            <h4 style={{ fontFamily: "serif" }}>Native Transactions</h4>

            {txs?.map((e, i) => {
              const isSameDayAsPrevious =
                i > 0 &&
                e.block_timestamp.slice(0, 10) ===
                  txs[i - 1].block_timestamp.slice(0, 10);
              return (
                <>
                  <div className="container-activity">
                    {!isSameDayAsPrevious && (
                      <div className="block-time">
                        {e.block_timestamp.slice(0, 10)}
                      </div>
                    )}
                    <a
                      href={`${CHAINS_CONFIG[selectedChain].scanUrl}${wallet}`}
                      key={i}
                      className="tx"
                      target="_blank"
                    >
                      <div className="infor-activity">
                        {" "}
                        {e.from_address.toLowerCase() ===
                        wallet.toLowerCase() ? (
                          <>
                            <img
                              className="logo-scan"
                              src={CHAINS_CONFIG[selectedChain].imageUrl}
                              style={{ height: "30px", marginRight: "10px" }}
                            ></img>
                            <div className="target-value">
                              <span className="block-value" style={{}}>
                                <i
                                  style={{
                                    marginRight: "5px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Sent
                                </i>{" "}
                                <i className="address-activity">
                                  To {e.to_address.slice(0, 3)}...
                                  {e.to_address.slice(-3)}
                                </i>
                              </span>
                              <p
                                style={{
                                  color: "rgb(233, 95, 103)",
                                  fontSize: "14px",
                                }}
                              >
                                -{" "}
                                {e.value
                                  .toFixed(2)
                                  .replace(
                                    /(\.[0-9]*[1-9])0+$|\.0*$/,
                                    "$1"
                                  )}{" "}
                                {CHAINS_CONFIG[selectedChain].ticker}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              className="logo-scan"
                              src={CHAINS_CONFIG[selectedChain].imageUrl}
                              style={{ height: "30px", marginRight: "10px" }}
                            ></img>
                            <div className="target-value">
                              <span
                                className="block-value"
                                style={{ fontStyle: "10px" }}
                              >
                                <i
                                  style={{
                                    marginRight: "5px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Received
                                  {/* <ArrowsAltOutlined /> */}{" "}
                                </i>{" "}
                                <i className="address-activity">
                                  From {e.from_address.slice(0, 3)}...
                                  {e.from_address.slice(-3)}
                                </i>
                              </span>

                              <p
                                style={{
                                  color: "rgba(5, 177, 105)",
                                  fontSize: "14px",
                                }}
                              >
                                +{" "}
                                {e.value
                                  .toFixed(2)
                                  .replace(
                                    /(\.[0-9]*[1-9])0+$|\.0*$/,
                                    "$1"
                                  )}{" "}
                                {CHAINS_CONFIG[selectedChain].ticker}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </a>{" "}
                  </div>
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
              <span>Looks like you don't have any transactions yet</span>{" "}
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
      </div>
    </>
  ) : (
    <>
      <div className="d-flex justify-content-center">
        <Spin />
      </div>
    </>
  );
};

export default Activity;
