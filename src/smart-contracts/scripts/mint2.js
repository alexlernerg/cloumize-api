const contractJson = require("../build/Test2.json");
const dotenv = require("dotenv");
const prompt = require("prompt-sync")({ sigint: true });

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

// IMPORTANTE!!!, accounts debe tener el mismo tamaño que tokenUris

// Accounts to mint to.
const accounts = [
  "0xC967FDc1af9E0E93FF252D86650FF9B820a8f290",
  "0x2A6d06aaf96416b0F1aA82C637e3add7b60d3466",
  "0xEf9FaE4Cb7408EecCEB44De52B80B9D35971f6C6",
];

// Uris de los NFT.
const tokenUris = [
  "https://ipfs.io/ipfs/QmTW1vEBybzCXLtAoiWHvQf5FU5ZBFDUusoXV16bEA9ePj",
  "https://ipfs.io/ipfs/QmTW1vEBybzCXLtAoiWHvQf5FU5ZBFDUusoXV16bEA9ePj",
  "https://ipfs.io/ipfs/QmTW1vEBybzCXLtAoiWHvQf5FU5ZBFDUusoXV16bEA9ePj",
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
      for (let i = 0; i < events.length; i++) {
        const recipient = events[i].returnValues.to;
        console.log("This has token", recipient);
        !hasToken.includes(recipient) && hasToken.push(recipient);
      }
    });

  const validAddresses = accounts.filter((acc) => {
    return !hasToken.includes(acc);
  });

  console.log("original accounts", accounts);
  console.log("hasToken", hasToken);
  console.log("validAddresses", validAddresses);
  if (validAddresses.length === 0) {
    console.log("All accounts have tokens");
  }

  if (validAddresses.length < tokenUris.length) {
    console.log(
      "CUIDADO! El array de address que no tienen tokens es menor que el de tokenUris"
    );
    const keepOn = await prompt("Quieres seguir la ejecución? Y/N" + " ");
    if (keepOn === "N" || "n") {
      process.exit();
    }
  }
  if (validAddresses.length > tokenUris.length) {
    console.log(
      "TERMINANDO EL PROCESO! El array de address que no tienen tokens es mayor que el de tokenUris"
    );
    process.exit();
  }
  await new Promise((r) => setTimeout(r, 1000 * 5));

  // mint tokens
  for (let i = 0; i < validAddresses.length; i++) {
    
    console.log("Minting to: " + validAddresses[i]);
    const price = await web3.eth.getGasPrice();
    const tx = {
      from: process.env.PUBLIC_KEY,
      to: contractJson.networks[networkId].address,
      gas: 5500000,
      gasPrice: price,
      data: contract.methods
        .safeMint(validAddresses[i], tokenUris[i])
        .encodeABI(),
    };

    await new Promise(async (resolve, reject) => {
      await web3.eth.accounts
        .signTransaction(tx, process.env.PRIVATE_KEY)
        .then((signedTx) => {
          const sentTx = web3.eth.sendSignedTransaction(
            signedTx.raw || signedTx.rawTransaction
          );
          sentTx.on("receipt", (receipt) => {
            console.table(
              "Transaction receipt: " + JSON.stringify(receipt, null, 4)
            );
            resolve();
          });
          sentTx.on("error", (err) => {
            console.log("Transaction error: " + err);
          });
        })
        .catch((err) => {
          console.log("Signing error: " + err);
          reject();
        });
    });
    console.log("Successfully minted to: " + validAddresses[i]);
    await new Promise((r) => setTimeout(r, 1000 * 2));
    console.log(
      "There are: " + (validAddresses.length - 1 - i) + " " + "itereations left"
    );

    // CHECK FOR TOKEN URIS
    await new Promise(async (resolve, reject) => {
      await contract.methods
        .tokenURI(i)
        .call({ from: process.env.PUBLIC_KEY })
        .then((result)=>{
          console.log("TOKEN URI OF NFT WITH ID:" + i + " IS:" + result);
          resolve();
        })
        .catch((err)=>{
          console.log('Error getting token uri: ' + err);
          reject();
        });
    });
  }
  console.log("Finished minting");
};

run();
