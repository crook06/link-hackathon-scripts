const { decodeResult, ReturnType } = require("@chainlink/functions-toolkit");
const { Contract } = require("ethers");

const { signer } = require("../connection.js"); // connection_risk.js
const { abi } = require("../contracts/abi/FunctionsConsumer.json"); // RiskFunctionsConsumer.json

const consumerAddress = "0x01568F134A64b8c525E468908a3850B6c6A55F54" // RiskFunctionsConsumer.sol deployed contract address
const readResponse = async () => {
  const functionsConsumer = new Contract(consumerAddress, abi, signer);

  const responseBytes = await functionsConsumer.s_lastResponse()
  console.log("\nResponse Bytes : ", responseBytes)

  const decodedResponse = decodeResult(responseBytes, ReturnType.string)

  console.log("\nDecoded response from OpenAI/ChatGPT:", decodedResponse) // delete OpenAI/ChatGPT and place our API
};

readResponse().catch(err => {
  console.log("Error reading response: ", err);
});
