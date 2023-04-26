import path from "path";
import wasm_tester from "../../../wasm_tester";
import { setupDirectories } from "../../test_utils"
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { expect } from 'chai';
import { privateToAddress } from "@ethereumjs/util";
import * as secp256k1 from '@noble/secp256k1';
import { sha256 as jsSha256 } from 'js-sha256';

const pathToCircom = "./sig_verify.circom"

function bigint_to_array(n: number, k: number, x: bigint) {
  let mod: bigint = 1n;
  for (var idx = 0; idx < n; idx++) {
    mod = mod * 2n;
  }

  let ret: bigint[] = [];
  var x_temp: bigint = x;
  for (var idx = 0; idx < k; idx++) {
    ret.push(x_temp % mod);
    x_temp = x_temp / mod;
  }
  return ret;
}

function getCircuitInputWithAddrAndSig(input: string) {
  const [msg, sigHex]: [string, string] = JSON.parse(input)

  const sig = secp256k1.Signature.fromCompact(sigHex).addRecoveryBit(0)

  const msgHash = jsSha256(msg)

  const msgHashBigInt = BigInt("0x" + msgHash)

  const recoveredPublicKey = sig.recoverPublicKey(msgHash); // Public key recovery

  return getCircuitInput(
    sig.r,
    sig.s,
    msgHashBigInt,
    recoveredPublicKey.x,
    recoveredPublicKey.y
  )
}

function getCircuitInput(
  r_bigint: bigint,
  s_bigint: bigint,
  msghash_bigint: bigint,
  pub0: bigint,
  pub1: bigint,
) {
  var r_array: bigint[] = bigint_to_array(64, 4, r_bigint);
  var s_array: bigint[] = bigint_to_array(64, 4, s_bigint);
  var msghash_array: bigint[] = bigint_to_array(64, 4, msghash_bigint);
  var pub0_array: bigint[] = bigint_to_array(64, 4, pub0);
  var pub1_array: bigint[] = bigint_to_array(64, 4, pub1);

  return {
    "r": r_array,
    "s": s_array,
    "msghash": msghash_array,
    "pubkey": [pub0_array, pub1_array]
  }
}

// example output of this function:
// ["0xefcbe272b0febe3edadc034af7a3f53ed35aaa53","9ea2c44a6c411cddd0351db03d87b127b64fd420104e0e072d39b29f6318e6302e6f6390a4f17f3f77a83c7b12aa692c1e6fae925a399e0800afe9de71ebab7c"]
function getAddrAndSig(privateKey: string) {
  const privKeyBuffer = Buffer.from(privateKey, "hex");
  const addr = "0x" + privateToAddress(privKeyBuffer).toString("hex");
  console.log("ETH Address:" + addr)

  const addrHash = jsSha256(addr)
  console.log("getAddrAndSig addrHash: ", addrHash)
  secp256k1.etc.hmacSha256Sync = (k, ...m) => hmac(sha256, k, secp256k1.etc.concatBytes(...m))
  const addrSig = secp256k1.sign(addrHash, privateKey).toCompactHex()

  const result = [
    addr,
    addrSig
  ]

  return JSON.stringify(result)
}


describe("Test sig verify", function () {
  const output = setupDirectories(pathToCircom);

  it("Checks sig verify", async function () {
    const privateKey = "f5b552f608f5b552f608f5b552f6082ff5b552f608f5b552f608f5b552f6082f"
    const addrAndSig = getAddrAndSig(privateKey)
    const input = getCircuitInputWithAddrAndSig(addrAndSig)

    const circuit = await wasm_tester(
      path.join(__dirname, pathToCircom),
      {
        output
      }
    );

    const w = await circuit.calculateWitness(input);

    // 0n means failed, 1n measn passed
    expect(w[1]).to.equal(1n);

    await circuit.checkConstraints(w);
  });

});
