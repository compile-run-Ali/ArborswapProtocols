import { Contract } from 'ethers'
import LockFactoryAbi from 'config/abi/LockFactory.json'

import { FACTORY_ADDRESS } from 'config/constants/address'
import { DEFAULT_CHAIN } from 'config/constants/misc'
import Web3 from 'web3'

async function getFeeInfo() {
  try {
  await window.ethereum.enable();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(LockFactoryAbi, FACTORY_ADDRESS[DEFAULT_CHAIN]);
  const info = await contract.methods.fee().call();
  console.log(info, "info")
  return info;
  }catch(e){
    console.log(e, "error")
  }
}

export default getFeeInfo
