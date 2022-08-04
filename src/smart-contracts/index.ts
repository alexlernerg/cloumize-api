import contractJson from './build/Test.json'

export const networkId = Object.keys(contractJson.networks)[0]

export const _contract = {
  abi: contractJson.abi,
  address: contractJson.networks[networkId].address
};