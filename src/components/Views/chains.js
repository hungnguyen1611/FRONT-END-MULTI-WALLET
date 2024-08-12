import img_ETH from "./img/Ethereum.png";
import img_PLG from "./img/polygon.jpg";

const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl: "https://eth.llamarpc.com",
  ticker: "ETH",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/eth.svg",
  scanUrl: "https://etherscan.io/address/",
  idApi: "ethereum",
  // imageUrl: img_ETH,
  // https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg
};

const BinanceSmartChain = {
  hex: "0x38",
  name: "Binance Smart Chain",
  rpcUrl: "https://bsc-dataseed.binance.org",
  ticker: "BNB",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/bsc.svg",
  scanUrl: "https://bscscan.com/address/",
  idApi: "binancecoin",
};

const Polygon = {
  hex: "0x89",
  name: "Polygon",
  rpcUrl: "https://polygon-pokt.nodies.app",
  ticker: "MATIC",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/matic.svg",
  scanUrl: "https://polygonscan.com/address/",
  idApi: "matic-network",
};

const Avalanche = {
  hex: "0xa86a",
  name: "Avalanche C-Chain",
  rpcUrl: "https://avax.meowrpc.com",
  ticker: "AVAX",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/avax.svg",
  scanUrl: "https://avascan.info/blockchain/all/address/",
  idApi: "avalanche-2",
};

const zkSyncMainnet = {
  hex: "0x144",
  name: "zkSync Era Mainnet",
  rpcUrl: "https://mainnet.era.zksync.io",
  ticker: "ETH",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/zksync.svg",
  scanUrl: "https://explorer.zksync.io/address/",
  idApi: "ethereum",
};

const Solana = {
  hex: "0x65",
  name: "Solana",
  rpcUrl: "https://api.mainnet-beta.solana.com",
  ticker: "SOL",
  imageUrl: "https://www.ankr.com/rpc/static/media/sol.96da6f75.svg",
  scanUrl: "https://solscan.io/account/",
  idApi: "solana",
};

const Ton = {
  hex: "0x2",
  name: "Telegram Open Network",
  rpcUrl: "https://go.getblock.io/24dd466514a24138a61a75f21c5b7727",
  ticker: "TON",
  imageUrl:
    "https://storage.getblock.io/web/getblock-ui-kit/icons/coins/ton.svg",
  scanUrl: "https://tonscan.org/address/",
  idApi: "the-open-network",
};

const Arbitrum = {
  hex: "0xa4b1",
  name: "Arbitrum One",
  rpcUrl: "https://arbitrum.llamarpc.com",
  ticker: "ETH",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/arb.svg",
  scanUrl: "https://arbiscan.io/",
  idApi: "arbitrum",
};

const OP = {
  hex: "0xa",
  name: "Optimism",
  rpcUrl: "https://optimism.llamarpc.com",
  ticker: "ETH",
  imageUrl: "https://storage.getblock.io/web/web/images/coins/op.svg",
  scanUrl: "https://optimistic.etherscan.io/",
  idApi: "optimism",
};

export const CHAINS_CONFIG = {
  "0x1": Ethereum,
  "0xa86a": Avalanche,
  "0x89": Polygon,
  "0x38": BinanceSmartChain,
  "0x144": zkSyncMainnet, // Thêm mạng zkSync vào CHAINS_CONFIG với khóa là hex của nó
  "0x65": Solana,
  "0x2": Ton,
  "0xa4b1": Arbitrum,
  "0xa": OP,
};
