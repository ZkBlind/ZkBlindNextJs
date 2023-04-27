import Whitelist from "@/lib/abi/Whitelist.json";

export function getContractInfo(chain?: number) {
  if (chain === 5001)
    return {
      contractAddress: "0xdB2b8D972a65Fa812136171a32028752D4AB1EFF",
      abi: Whitelist.abi,
    };

  return {
    contractAddress: "0xdB2b8D972a65Fa812136171a32028752D4AB1EFF",
    abi: Whitelist.abi,
  };
}
