import { getContractInfo } from "@/utils/contracts";
import {
  prepareWriteContract,
  writeContract,
  readContract,
  getNetwork,
} from "@wagmi/core";
import { utils, BigNumber } from "ethers";

export const checkWhitelisted = async (address: string) => {
  const { chain } = getNetwork();
  const { contractAddress, abi } = getContractInfo(chain?.id);

  // console.log("Current account:", address);
  const data = await readContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    functionName: "verifyUser",
    args: [address],
  });

  // console.log("Verifying status:", data);

  if (data) {
    return true;
  }
  return false;
};

export const addWhitelistTransaction = async (
  a: string[],
  b: string[],
  c: string[],
  input: string[],
  userId: string,
  emailSuffix: string
) => {
  try {
    const { chain } = getNetwork();
    const { contractAddress, abi } = getContractInfo(chain?.id);
    emailSuffix = utils.formatBytes32String(emailSuffix);
    const config = await prepareWriteContract({
      address: contractAddress as `0x${string}`,
      abi: abi,
      functionName: "addToWhitelist",
      args: [userId, emailSuffix, a, b, c, input],
      overrides: {
        gasLimit: BigNumber.from(1_000_000),
      },
    });

    // Execute the transaction
    const writeResult = await writeContract(config);

    // Wait for the transaction block to be mined
    const txResult = await writeResult.wait();
    return txResult.transactionHash;
  } catch (err) {
    console.log("addWhitelistTransaction err2:", err);
  }
};
