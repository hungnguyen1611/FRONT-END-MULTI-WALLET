import React, { Suspense } from "react";
import Loading from "./Loading";
import { Outlet } from "react-router-dom";
import Header from "../Layouts/Header";
import HeaderWallet from "../Layouts/HeaderWallet";

import { useLocation } from "react-router-dom";

const Layout = ({ selectedChain, setSelectedChain }) => {
  const location = useLocation();

  const isWalletPage =
    location.pathname === "/" ||
    location.pathname === "/my-wallet" ||
    location.pathname === "/enter-password" ||
    location.pathname === "/set-password";

  return (
    <>
      {isWalletPage ? (
        <HeaderWallet
          setSelectedChain={setSelectedChain}
          selectedChain={selectedChain}
        />
      ) : (
        <Header
          setSelectedChain={setSelectedChain}
          selectedChain={selectedChain}
        /> // Header mặc định cho các trang khác
      )}
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default Layout;
