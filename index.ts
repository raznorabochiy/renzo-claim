import cli from "cli";
import { Wallet } from "ethers";
import random from "lodash/random";
import shuffle from "lodash/shuffle";
import select from "@inquirer/select";
import {
  DELAY_FROM_SEC,
  DELAY_TO_SEC,
  KEYS_FILENAME,
  SHUFFLE_KEYS,
} from "./constants";
import { claim, getProofData } from "./claim";
import { ClaimType } from "./types";
import { delayProgress, loadFromFile, waitGas } from "./utils";

let keys = await loadFromFile(KEYS_FILENAME);

if (SHUFFLE_KEYS) {
  keys = shuffle(keys);
}

const claimType: ClaimType = await select({
  message: "Выберите тип клейма:",
  choices: [{
    name: "Основной дроп",
    value: ClaimType.Main,
  }, {
    name: "Дроп EigenLayer",
    value: ClaimType.EigenLayer,
  }],
});

for (const key of keys) {
  const { address } = new Wallet(key);
  console.log(`===== Address: ${address} ======`);

  try {
    await waitGas();
    const data = await getProofData(address, claimType);
    await claim(key, data, claimType);
  } catch (e) {
    cli.spinner("", true);
    console.log("Error:", e.message);
  }

  const delayTimeout = random(DELAY_FROM_SEC, DELAY_TO_SEC);
  await delayProgress(delayTimeout);
}
