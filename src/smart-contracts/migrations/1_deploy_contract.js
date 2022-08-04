/* eslint-disable no-undef */
const Test = artifacts.require('../contracts/Test.sol');

module.exports = async function (deployer) {
  await deployer.deploy(Test);
};
