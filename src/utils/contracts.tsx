import WhitelistAbi from "@/lib/abi/AddWhitelist.json";

export function getContractInfo(chain?: number) {
  if (chain === 5001)
    return {
      contractAddress: "0x8C46d5ec4e97a2f074305a7b90db3dc846F481AF",
      abi: WhitelistAbi,
    };
  if (chain === 5)
    return {
      contractAddress: "0x3f815e7d299f08278c0308aE1048aa45ED12415f",
      abi: WhitelistAbi,
    };

  return {
    contractAddress: "0x8C46d5ec4e97a2f074305a7b90db3dc846F481AF",
    abi: WhitelistAbi,
  };
}
