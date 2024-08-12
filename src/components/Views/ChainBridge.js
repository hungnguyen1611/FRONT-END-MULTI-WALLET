const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl: "https://eth.llamarpc.com",
  ticker: "ETH",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/eth.svg",
  scanUrl: "https://etherscan.io/address/",
  // imageUrl: img_ETH,
  // https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg
};

const zkSyncMainnet = {
  hex: "0x144",
  name: "zkSync Era Mainnet",
  rpcUrl: "https://mainnet.era.zksync.io",
  ticker: "ETH",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/zksync.svg",
  scanUrl: "https://explorer.zksync.io/address/",
};

export const CHAINS_CONFIG = {
  "0x1": Ethereum,
  "0x144": zkSyncMainnet,
};
