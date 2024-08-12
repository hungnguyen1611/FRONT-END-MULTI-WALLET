chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    console.log(message);
    if (message.type === "web3Request") {
      // Tạo một cửa sổ popup để người dùng nhập mật khẩu
      chrome.windows.create({
        url: "index.html",
        type: "popup",
        width: 496,
        height: 670,
      });
    }
  }
);
