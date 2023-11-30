const { abi, bytecode } = require("../contracts/abi/RiskFunctionsConsumer.json");
const { wallet, signer } = require("../connection.js");
const { networks } = require("../networks.js");
const { ContractFactory, utils } = require("ethers");

const NETWORK = "ethereumSepolia";

const routerAddress = networks[NETWORK].functionsRouter;
const donIdBytes32 = utils.formatBytes32String(networks[NETWORK].donId);

const deployRiskFunctionsConsumerContract = async () => {
  const contractFactory = new ContractFactory(abi, bytecode, wallet);

  console.log(
    `\nDeploying RiskFunctionsConsumer contract on network ${NETWORK}...`
  );
  const riskFunctionsConsumerContract = await contractFactory
    .connect(signer)
    .deploy(routerAddress, donIdBytes32);

  await riskFunctionsConsumerContract.deployed();
  console.log(`\nDeployed at address ${riskFunctionsConsumerContract.address}`)
};

deployRiskFunctionsConsumerContract().catch(err => {
  console.log("Error deploying the Consumer Contract ", err);
});
