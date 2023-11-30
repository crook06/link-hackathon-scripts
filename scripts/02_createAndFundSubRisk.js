const { SubscriptionManager } = require("@chainlink/functions-toolkit");
const { utils } = require("ethers");

const { signer } = require("../connection");
const { networks } = require("../networks");

const NETWORK = "ethereumSepolia";

const functionsRouterAddress = networks[NETWORK].functionsRouter;
const linkTokenAddress = networks[NETWORK].linkToken;
const consumerAddress = "0x01568F134A64b8c525E468908a3850B6c6A55F54"; // RiskFunctionsConsumer.sol public address - must use sub ID
const LINK_AMOUNT = "5"

const createAndFundSubRisk = async () => {
  const subscriptionManager = new SubscriptionManager({
    signer,
    linkTokenAddress,
    functionsRouterAddress,
  });

  await subscriptionManager.initialize();

  // Create Subscription
  const subscriptionId = await subscriptionManager.createSubscription();
  console.log(`\n Subscription ${subscriptionId} created.`);

  // add consumer to subscription
  const receipt = await subscriptionManager.addConsumer({
    subscriptionId, // 4-digit subsrciption ID
    consumerAddress, // RiskFunctionsConsumer.sol public address
  });

  console.log(
    `\n Subscription ${subscriptionId} now has ${consumerAddress} as a consumer.)`
  );

    // Fund Subscription
    const juelsAmount = utils.parseUnits(LINK_AMOUNT, 18).toString()
    subscriptionManager.fundSubscription({
        subscriptionId,
        juelsAmount
    })

    console.log(`\n Subscription ${subscriptionId} funded with ${LINK_AMOUNT} LINK.`)
};

createAndFundSubRisk().catch(err => {
  console.log("Error creating/funding Subscription ", err);
});
