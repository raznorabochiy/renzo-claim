import cli from "cli";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { getTxLink, loadFromFile } from "./utils";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  PROOF_URL,
  PROXY_FILENAME,
  RPC_URL,
} from "./constants";
import { ProofDataResponse } from "./types";

const provider = new JsonRpcProvider(RPC_URL);
const [proxy] = await loadFromFile(PROXY_FILENAME);
const agent = proxy ? new HttpsProxyAgent(`http://${proxy}`) : undefined;

export async function getProofData(address: string) {
  cli.spinner("Get proof data");
  const url = PROOF_URL.replace(/{address}/g, address);

  const response = await fetch(url, {
    headers: {
      "accept": "application/json, text/plain, */*",
      "sec-ch-ua": '"Chromium";v="124", "Brave";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "Referer": "https://renzo.liquifi.finance/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
    agent,
  });

  const data = await response.json() as ProofDataResponse;
  cli.spinner("Get proof data: Done", true);

  return data;
}

export async function claim(key: string, data: ProofDataResponse) {
  const wallet = new Wallet(key, provider);
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
  const [event] = data.events;

  if (!event) {
    console.log("Proof data is empty");
    return;
  }

  const txArgs = [
    [event.beneficiary],
    [event.awardAmount],
    [event.awardAmount],
    [event.releaseTime],
    [0],
    [event.proofs],
  ];

  const gasLimit = await contract.batchClaimTokens.estimateGas(...txArgs);

  const unsignedTx = await contract.batchClaimTokens.populateTransaction(
    ...txArgs,
  );

  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

  cli.spinner("Send transaction");

  const tx = await wallet.sendTransaction({
    ...unsignedTx,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  await provider.waitForTransaction(tx.hash);

  cli.spinner(getTxLink(tx.hash), true);
}
