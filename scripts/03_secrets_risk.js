const { SecretsManager } = require("@chainlink/functions-toolkit");
const fs = require("fs");
const path = require("path");

const { signer } = require("../connection.js");
const { networks } = require("../networks.js");

require("@chainlink/env-enc").config();
// require('dotenv').config()

const NETWORK = "ethereumSepolia"; //we will use Sepolia

const functionsRouterAddress = networks[NETWORK].functionsRouter;
const donId = networks[NETWORK].donId;

const encryptAndUploadSecrets = async () => {
  const secretsManager = new SecretsManager({
    signer,
    functionsRouterAddress,
    donId,
  });

  await secretsManager.initialize();

  if (!process.env.API_KEY) { // I delete GPT because we will use API endpoints, and only 1 or 2 with API keys
    throw Error("API_KEY not found in .env.enc file"); // deleted GPT
  }

  const secrets = {
    apiKey: process.env.API_KEY, // deleted API key
  };

  const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

  const gatewayUrls = networks[NETWORK].gatewayUrls;
  const slotId = 0;
  const minutesUntilExpiration = 75;

  const {
    version, // Secrets version number (corresponds to timestamp when encrypted secrets were uploaded to DON)
    success, // Boolean value indicating if encrypted secrets were successfully uploaded to all nodes connected to the gateway
  } = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls,
    slotId,
    minutesUntilExpiration,
  });

  if (success){
    console.log("\nUploaded secrets to DON...")
    const encryptedSecretsReference =  secretsManager.buildDONHostedEncryptedSecretsReference({
        slotId,
        version
    })

    console.log(`\nMake a note of the encryptedSecretsReference: ${encryptedSecretsReference} `)
  }

};

encryptAndUploadSecrets().catch(err => {
  console.log("Error encrypting and uploading secrets:  ", err);
});
