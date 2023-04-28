import { Addresses } from "@/shared/addresses";
import { prepareWriteContract, writeContract, getAccount, readContract } from "@wagmi/core";
import { ethers } from 'ethers';

const abiFile = require("./abi/AddWhitelist.json");

export const checkWhitelisted = async () => {
  const account = getAccount();
  console.log("Cur account:", account);
  const data = await readContract({
    address: Addresses.WHITELIST_ADDR,
    abi: abiFile,
    functionName: 'verifyUser',
    args: [account.address]
  });

  console.log("Verify data:", data);
  
  return data; 
}

export const addWhitelistTransaction = async (
  proof: any,
  userId: any,
  emailSuffix: any
) => {

  console.log("abi:", abiFile, Addresses.WHITELIST_ADDR);

  try{
    proof = ethers.utils.toUtf8Bytes(proof);
    emailSuffix = ethers.utils.formatBytes32String(emailSuffix);
    const config = await prepareWriteContract({
      address: Addresses.WHITELIST_ADDR,
      abi: abiFile,
      functionName: "addToWhitelist",
      args: [proof, userId, emailSuffix],
    });
  
    // Execute the transaction
    const writeResult = await writeContract(config);
  
    // Wait for the transaction block to be mined
    const txResult = await writeResult.wait();
    return txResult.transactionHash;
  }catch(err){
    console.log("addWhitelistTransaction err2:", err);
  }
};
