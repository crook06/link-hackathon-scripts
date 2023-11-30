 const { Contract } = require("ethers");
const fs = require("fs");
const path = require("path");
const { Location } = require("@chainlink/functions-toolkit");
require("@chainlink/env-enc").config(); // env-enc with our secret objects
// require('dotenv').config()

const { signer } = require("../connection.js");
const { abi } = require("../contracts/abi/RiskFunctionsConsumer.json"); // our contract is RiskFunctionsConsumer.sol, so  RiskFunctionsConsumer.json

const consumerAddress = "0x01568F134A64b8c525E468908a3850B6c6A55F54"; // deployed RiskFunctionsConsumer.sol public address - we need to change that onr
const subscriptionId = "718"; // 1761 is our
const encryptedSecretsRef = "0xa266736c6f744964006776657273696f6e1a65540efa";

const sendRequest = async () => {
  if (!consumerAddress || !encryptedSecretsRef || !subscriptionId) {
    throw Error("Missing required environment variables.");
  }
  const functionsConsumer = new Contract(consumerAddress, abi, signer);

  const source = fs
    .readFileSync(path.resolve(__dirname, "../source.js"))
    .toString();

  const prompt = "Describe what a blockchain is in 15 words or less"; // change
  // const tokenContractAddress = "Submit token contract address" 
  const args = [prompt]; // remove "prompt"and place "tokenContractAddress"
  const callbackGasLimit = 300_000;

  console.log("\n Sending the Request....")
  const requestTx = await functionsConsumer.sendRequest(
    source,
    Location.DONHosted,
    encryptedSecretsRef,
    args,
    [], // bytesArgs can be empty
    subscriptionId,
    callbackGasLimit
  );

  const txReceipt = await requestTx.wait(1);
  const requestId = txReceipt.events[2].args.id;
  console.log(
    `\nRequest made.  Request Id is ${requestId}. TxHash is ${requestTx.hash}`
  );
};

sendRequest().catch(err => {
  console.log("\nError making the Functions Request : ", err);
});
