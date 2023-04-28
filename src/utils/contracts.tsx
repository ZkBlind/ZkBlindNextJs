import WhitelistAbi from "@/lib/abi/AddWhitelist.json";

export function getContractInfo(chain?: number) {
  if (chain === 5001)
    return {
      contractAddress: "0xdB2b8D972a65Fa812136171a32028752D4AB1EFF",
      abi: WhitelistAbi
    };
  else if (chain === 5)
    return {
      contractAddress: "0x3f815e7d299f08278c0308aE1048aa45ED12415f",
      abi: WhitelistAbi
    };

  return {
    contractAddress: "0xdB2b8D972a65Fa812136171a32028752D4AB1EFF",
    abi: WhitelistAbi,
  };
}
