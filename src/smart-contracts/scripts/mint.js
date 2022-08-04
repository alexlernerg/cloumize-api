import { _contract } from "../";
const dotenv = require("dotenv");
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "development") {
  const envFound = dotenv.config();
  if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

// Get web3
const Web3 = require("web3");
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/c91b3318090544299c446a05dd64bc94"
  )
);

// get contract
const networkId = Object.keys(contractJson.networks)[0];

const contract = new web3.eth.Contract(_contract);

// Accounts to mint to.
const accounts = [
  "0xC967FDc1af9E0E93FF252D86650FF9B820a8f290",
  "0x2A6d06aaf96416b0F1aA82C637e3add7b60d3466",
  "0xEf9FaE4Cb7408EecCEB44De52B80B9D35971f6C6",
];

// Accounts that own a token.
const hasToken = [];

const run = async () => {
  await contract
    .getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
    })
    .then(function (events) {
      for(let i = 0; i < events.length; i++) {
        const recipient = events[i].returnValues.to;
        console.log("⛔ This address has a token", recipient);
        !hasToken.includes(recipient) && hasToken.push(recipient);
      };
    });

  const validAddresses = accounts.filter((acc) => {
    return !hasToken.includes(acc);
  });

  console.log('original accounts', accounts);
  console.log("⛔ hasToken", hasToken);
  console.log("✅ validAddresses", validAddresses);

  if(validAddresses.length===0){
    console.log("⚠️ All accounts have tokens");
  }
  await new Promise((r) => setTimeout(r, 1000 * 2));

  // mint tokens
  for (let i = 0; i < validAddresses.length; i++) {
    // Sleep()
    console.log("⌛ Minting to: " + validAddresses[i]);
    //await new Promise((r) => setTimeout(r, 1000 * 10));
    const price = await web3.eth.getGasPrice();
    const tx = {
      from: process.env.PUBLIC_KEY,
      to: contractJson.networks[networkId].address,
      gas: 5500000,
      gasPrice: price,
      data: contract.methods.safeMint(validAddresses[i]).encodeABI(),
    };
    // Sleep()
    // await new Promise((r) => setTimeout(r, 1000 * 60));
    await new Promise(async (resolve, reject) => {
      await web3.eth.accounts
        .signTransaction(tx, process.env.PRIVATE_KEY)
        .then((signedTx) => {
          const sentTx = web3.eth.sendSignedTransaction(
            signedTx.raw || signedTx.rawTransaction
          );
          sentTx.on("receipt", (receipt) => {
            console.table(
              "✅ Transaction receipt: " + JSON.stringify(receipt, null, 4)
            );
            resolve();
          });
          sentTx.on("error", (err) => {
            console.log("❌ Transaction error: " + err);
          });
        })
        .catch((err) => {
          console.log("❌ Signing error: " + err);
          reject();
        });
    });
    console.log("✅ Succesfully minted to: " + validAddresses[i]);
    await new Promise((r) => setTimeout(r, 1000 * 2));

    // CHECK FOR TOKEN URIS
    await new Promise(async (resolve, reject) => {
      await contract.methods
        .tokenURI(i)
        .call({ from: process.env.PUBLIC_KEY })
        .then((result) => {
          console.log("✅ Token URI for ID " + i + ":" + result);
          resolve();
        })
        .catch((err) => {
          console.log("❌ Error getting token uri: " + err);
          reject();
        });
    });

    await new Promise((r) => setTimeout(r, 1000 * 2));
    console.log(
      "🔁 There are: " +
        (validAddresses.length - 1 - i) +
        " " +
        "itereations left"
    );
  }
  console.log("Finished minting");
};

run();
