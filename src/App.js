import "bootstrap";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import EnterPassword from "./components/EnterPassword";
import ImportWallet from "./components/ImportWallet";
import Layout from "./components/Layouts/Layout";
import SetPassword from "./components/SetPassword";
import NFT from "./components/Views/NFT";
import Swap from "./components/Views/Swap";
import Token from "./components/Views/Token";
import Transaction from "./components/Views/Transaction";
import Wallet from "./components/Views/Wallet";
import Activity from "./components/Views/Activity";
import Bridge from "./components/Views/Bridge";
import Home from "./components/Views/Home";
import HelpUsImprove from "./components/Views/HelpUsImprove";
import CreatePassword from "./components/CreatePassword";
import SecretKey from "./components/Views/SecretKey";
import ConfirmSecretKey from "./components/Views/ConfirmSecretKey";
import Congratulation from "./components/Views/Congratulation";

function App() {
  const [wallet, setWallet] = useState(localStorage.getItem("wallet") ?? null);
  const [seedPhrase, setSeedPhrase] = useState(
    localStorage.getItem("encrypt-seedPhrase") ?? null
  );
  const [seedPhraseTwo, setseedPhraseTwo] = useState("");

  const chain = localStorage.getItem("selectedChain");

  if (!chain) {
    localStorage.setItem("selectedChain", "0x1");
  }
  const [selectedChain, setSelectedChain] = useState(chain || "0x1");

  return (
    <div className="body-extension">
      <header>
        <Layout
          setSelectedChain={setSelectedChain}
          selectedChain={selectedChain}
        />
      </header>
      {seedPhrase ? (
        <Routes>
          <Route
            path="/"
            element={
              <Wallet setWallet={setWallet} setSeedPhrase={setSeedPhrase} />
            }
          />
          <Route
            path="/my-wallet"
            element={
              <Wallet
                // wallet={wallet}
                // setWallet={setWallet}
                // seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                // selectedChain={selectedChain}
              />
            }
          >
            {/* <Route path="" element={<Token />} /> */}

            <Route path="Tokens" element={<Token />} />
            <Route path="NFTs" element={<NFT />} />
            <Route path="Ativity" element={<Activity />} />
            <Route
              path="Tranfer"
              element={<Transaction selectedChain={selectedChain} />}
            />
            <Route path="Swap" element={<Swap />} />
            <Route
              path="Bridge"
              element={<Bridge seedPhrase={seedPhrase || seedPhraseTwo} />}
            />
          </Route>
          {localStorage.getItem("encrypt-seedPhrase") ? (
            <Route
              path="/enter-password"
              element={
                <EnterPassword
                  setSeedPhrase={setSeedPhrase || setseedPhraseTwo}
                />
              }
            />
          ) : (
            <Route
              path="/set-password"
              element={
                <SetPassword seedPhrase={seedPhrase} setWallet={setWallet} />
              }
            />
          )}
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/help-us-improve" element={<HelpUsImprove />} />

          <Route
            path="/review-recovery-key"
            element={<SecretKey setSeedPhrase={setseedPhraseTwo} />}
          />

          <Route
            path="/create-password"
            element={
              <CreatePassword
                seedPhrase={seedPhraseTwo}
                setWallet={setWallet}
              />
            }
          />
          <Route
            path="/confirm-recovery-key"
            element={<ConfirmSecretKey seedPhrase={seedPhraseTwo} />}
          />
          <Route path="/create-wallet-success" element={<Congratulation />} />
          <Route
            path="/my-wallet"
            element={
              <Wallet setWallet={setWallet} setSeedPhrase={setseedPhraseTwo} />
            }
          />
          <Route
            path="/import-wallet"
            element={
              <ImportWallet setSeedPhrase={setSeedPhrase || setseedPhraseTwo} />
            }
          />

          <Route
            path="/set-password"
            element={
              <SetPassword seedPhrase={seedPhraseTwo} setWallet={setWallet} />
            }
          />

          <Route
            path="/enter-password"
            element={
              <EnterPassword
                setSeedPhrase={setSeedPhrase || setseedPhraseTwo}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
}
export default App;
