export const RPC_URL = "https://eth-mainnet.public.blastapi.io";

export const DELAY_FROM_SEC = 1000;
export const DELAY_TO_SEC = 2000;

export const MAX_GAS_GWEI = 10;

// Перемешивать ключи, чтобы запускать аккаунты в случайном порядке
export const SHUFFLE_KEYS = false;

export const CONTRACT_ADDRESS = "0x2e1a7ef12d0adeebf6009f0aa964cf686364b01f";

export const CONTRACT_ABI = [
  "function batchClaimTokens(address[] _beneficiaries, uint256[] _awardAmounts, uint256[] _claimAmounts, uint32[] _releaseTimes, uint32[] _unlockTimes, bytes32[][] _proofs)",
];

export const TX_SCAN = "https://etherscan.io/tx/";

export const KEYS_FILENAME = "keys.txt";

export const PROXY_FILENAME = "proxy.txt";

const MERKLE_ROOT =
  "0x70aa49832d3c4541d455059639a3f745a033b8f42dc4b63fa9ac64acd52b58c8";

export const PROOF_URL =
  `https://airdrop-data-liquifi.s3.us-west-2.amazonaws.com/{address}/${MERKLE_ROOT}-{address}.json`;
