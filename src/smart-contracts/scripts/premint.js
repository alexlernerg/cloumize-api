const contractJson = require("../build/Test.json");
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
const contract = new web3.eth.Contract(
  contractJson.abi,
  contractJson.networks[networkId].address
);

// Accounts to mint to.
const wallet1 = "0xC967FDc1af9E0E93FF252D86650FF9B820a8f290";
const wallet2 = "0xEf9FaE4Cb7408EecCEB44De52B80B9D35971f6C6";
const accounts = [];

const run = async () => {
  
  for (let i = 0; i < 30; i++) {
    if (i<25) {
      accounts.push(wallet1);
    } else {  accounts.push(wallet2); }
  }

  console.log("Minting " + accounts.length + " tokens with the following distribution ");
  await new Promise((r) => setTimeout(r, 1000 * 10));
  console.log('Founders accounts: ', accounts);
  console.log("Minting starts in 60 seconds, press CTRL+C to abort.");
  await new Promise((r) => setTimeout(r, 1000 * 60));
  // mint tokens
  for (let i = 0; i < accounts.length; i++) {
    // Sleep()
    console.log("⌛ Minting to: " + accounts[i]);
    //await new Promise((r) => setTimeout(r, 1000 * 10));
    const price = await web3.eth.getGasPrice();
    const tx = {
      from: process.env.PUBLIC_KEY,
      to: contractJson.networks[networkId].address,
      gas: 5500000,
      gasPrice: price,
      data: contract.methods.safeMint(accounts[i]).encodeABI(),
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
    console.log("✅ Succesfully minted to: " + accounts[i]);
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
        (accounts.length - 1 - i) +
        " " +
        "itereations left"
    );
  }
  console.log("Finished minting");
};

run();
