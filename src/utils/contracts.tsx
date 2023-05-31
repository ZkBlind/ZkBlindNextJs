import WhitelistAbi from "@/lib/abi/AddWhitelist.json";

export function getContractInfo(chain?: number) {
  if (chain === 5001)
    return {
      contractAddress: "0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723",
      abi: WhitelistAbi,
    };
  if (chain === 5)
    return {
      contractAddress: "0x012bfFB750A9E900aB36853E6E7D9C53c8b6B9fb",
      abi: WhitelistAbi,
    };

  if (chain === 80001)
    return {
      contractAddress: "0x6188dF506030124Df780f62de8Aa7DFd618a5CCC",
      abi: WhitelistAbi,
    };

  return {
    contractAddress: "0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723",
    abi: WhitelistAbi,
  };
}
