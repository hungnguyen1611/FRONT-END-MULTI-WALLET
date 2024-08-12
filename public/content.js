window.addEventListener("DOMContentLoaded", (event) => {
  // Lắng nghe sự kiện click trên nút "Connect Wallet"
  const el = document.querySelector("#connect-wallet-button");
  el.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "connectWallet" });
  });
});
window.addEventListener("eth_requestAccounts", () => {
  console.log("hungnguyen");
});
