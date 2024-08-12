import { Select } from "antd";
import { React, useEffect, useState } from "react";
import logo from "../../pays.png";
import { useNavigate } from "react-router-dom";
import { CHAINS_CONFIG } from "../Views/chains";

const HeaderWalelt = ({ selectedChain, setSelectedChain }) => {
  const chain = CHAINS_CONFIG[selectedChain];

  return (
    <div className="header">
      {/* <div className="icon_back" onClick={goBack}>
        <LeftOutlined />{" "}
      </div> */}
      <div className="logon-wallet">
        <img src={logo} height={20} />
      </div>
      <div className="network">
        <div className="logo-network">
          <img alt="noimg" src={chain?.imageUrl}></img>
        </div>

        <Select
          onChange={(val) => {
            localStorage.setItem("selectedChain", val || selectedChain);
            setSelectedChain(val);
          }}
          value={selectedChain}
          style={{ width: "170px" }}
          options={[
            {
              label: "Ethereum",
              value: "0x1",
            },
            {
              label: "ZkSync Era",
              value: "0x144",
            },
            {
              label: "Solana",
              value: "0x65",
            },
            {
              label: "Ton Network",
              value: "0x2",
            },

            {
              label: "Avalanche C-chain",
              value: "0xa86a",
            },
            {
              label: "Polygon",
              value: "0x89",
            },
            {
              label: "Binance Smart Chain",
              value: "0x38",
            },

            {
              label: "Arbitrum One",
              value: "0xa4b1",
            },
            {
              label: "Optimism",
              value: "0xa",
            },
          ]}
          className="dropdown"
        ></Select>
      </div>
    </div>
  );
};

export default HeaderWalelt;
