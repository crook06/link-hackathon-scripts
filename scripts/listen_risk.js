const {
  ResponseListener,
  decodeResult,
  ReturnType,
} = require("@chainlink/functions-toolkit");

require("@chainlink/env-enc").config("../.env.enc");

const { networks } = require("./networks.js"); //network_risk.js
const { provider } = require("./connection.js"); //connection_risk.js

const NETWORK = "ethereumSepolia";
const subscriptionId = "718"; // "1761"

const responseListener = new ResponseListener({
  provider,
  functionsRouterAddress: networks[NETWORK].functionsRouter,
});

console.log("\nListening....");
responseListener.listenForResponses(subscriptionId, response => {
  if (!response.errorString) {
    console.log(
      "\nFunctions response decodes to a string value of:  ",
      decodeResult(response.responseBytesHexstring, ReturnType.string)
    );
  } else {
    console.log("\nError during functions execution:  ", response.errorString);
  }
});

// Remove existing listener
process.on("SIGINT", ()=>{
    console.log("Removing Listeners...")
    responseListener.stopListeningForResponses();
})
