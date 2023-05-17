import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { privateToAddress } from "@ethereumjs/util";
import * as secp256k1 from '@noble/secp256k1';
import { sha256 as jsSha256 } from 'js-sha256';

export function generateEmailSuffix(email: string): string | null {
  const atIndex = email.indexOf('@');
  const dotIndex = email.indexOf('.');

  if (atIndex === -1 || dotIndex === -1) {
    console.error("Invalid email address: missing '@' or '.'.");
    return null;
  }

  const suffixWithSameLength = email.slice(0, atIndex + 1).replace(/./g, String.fromCharCode(0)) + email.slice(atIndex + 1);
  return suffixWithSameLength;
}

export function bigint_to_array(n: number, k: number, x: bigint) {
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

export function getCircuitInputWithAddrAndSig(input: string) {
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

export function getCircuitInput(
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
export function getAddrAndSig(privateKey: string) {
  const privKeyBuffer = Buffer.from(privateKey, "hex");
  const addr = "0x" + privateToAddress(privKeyBuffer).toString("hex");

  const addrHash = jsSha256(addr)
  secp256k1.etc.hmacSha256Sync = (k, ...m) => hmac(sha256, k, secp256k1.etc.concatBytes(...m))
  const addrSig = secp256k1.sign(addrHash, privateKey).toCompactHex()

  const result = [
    addr,
    addrSig
  ]

  return JSON.stringify(result)
}

export function isASCII(str: string): boolean {
  return /^[\x00-\x7F]*$/.test(str);
}

export function padEmailTo2032Bits(email: string): string | null {
  if (!isASCII(email)) {
    console.error("The email address contains non-ASCII characters.");
    return null;
  }

  const emailBytes = new TextEncoder().encode(email);
  const bitSize = emailBytes.length * 8;

  if (bitSize > 2032) {
    console.error("The email address is larger than 2032 bits.");
    return null;
  }

  const paddedEmailBytes = new Uint8Array(2032 / 8);
  paddedEmailBytes.set(emailBytes);

  const paddedEmail = Array.from(paddedEmailBytes)
    .map(byte => String.fromCharCode(byte))
    .join('');

  return paddedEmail;
}

export function stringToBitArray(input: string): number[] {
  const bitArray = input
    .split('')
    .flatMap(char => {
      const byte = char.charCodeAt(0);
      return Array.from({ length: 8 }, (_, j) => (byte >> (7 - j)) & 1);
    });
  return bitArray;
}

export function bitArrayToBigInt(bitArray: number[]): bigint {
  return bitArray.reduce(
    (acc, bit, index) =>
      acc + (BigInt(bit) * (BigInt(2) ** BigInt(index))), BigInt(0)
  );
}

export function getEmailSuffixStartingIndexInBitArray(input: string): number {
  // Find the index of the '@' symbol in the input string
  const atIndex = input.indexOf('@');

  // Check if the '@' symbol is found in the input string
  if (atIndex === -1) {
    throw new Error("Invalid email address: missing '@' symbol");
  }

  // Convert the index of the '@' symbol in the input string to the corresponding index in the bit array
  const atIndexInBitArray = atIndex * 8;

  return atIndexInBitArray;
}

export function bitArray2buffer(a: number[]) {
  const len = Math.floor((a.length - 1) / 8) + 1;
  const b = Buffer.alloc(len);

  for (let i = 0; i < a.length; i++) {
    const p = Math.floor(i / 8);
    b[p] = b[p] | (Number(a[i]) << (7 - (i % 8)));
  }
  return b;
}

export function setupDirectories(pathToCircom: string) {
  // Get the repository root directory using the 'git' command
  const repoRoot = path.resolve(execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim());

  // Create a 'tmp' directory in the root of the repository if it doesn't exist
  const tmpDir = path.join(repoRoot, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  // Extract the directory name from pathToCircom variable
  const circomDirName = path.parse(pathToCircom).name;

  // Create a directory with the extracted name inside the 'tmp' directory
  const multiplier2Dir = path.join(tmpDir, circomDirName);
  if (!fs.existsSync(multiplier2Dir)) {
    fs.mkdirSync(multiplier2Dir);
  }

  return multiplier2Dir;
}

export function extractLeastSignificantBits(hexString: string, bits: number): bigint {
  const fullNumber = BigInt(`0x${hexString}`);
  const mask = (BigInt(2) ** BigInt(bits)) - BigInt(1);
  return fullNumber & mask;
}

export function ethAddressToBigInt(ethAddress: string): bigint {
  const hexString = ethAddress.startsWith("0x") ? ethAddress.slice(2) : ethAddress;
  return BigInt(`0x${hexString}`);
}

/**
 * @param n - number of bits per element
 * @param k - number of elements
 * @param str - input string
 * @returns bit array of length n * k
 * @description
 * This function takes in a string and returns a bit array of length n * k
 * where n is the number of bits per element and k is the number of elements
 * if the string length is less than the (n*k)*8 then fill the rest with 0s
 */
export function string_to_bitarray(n: number, k: number, str: string) {
  // check if the string is ascii
  if (!isASCII(str)) {
    console.error("Input string is not ascii");
    return null;
  }

  // convert the string to bytes
  const strBytes = Array.from(new TextEncoder().encode(str));

  // convert the bytes to bits
  const bitArray: number[] = strBytes
    .map((byte: number) => {
      return Array.from({ length: 8 }, (_, j) => (byte >> (7 - j)) & 1);
    })
    .flat();

  const bitArrayLength = bitArray.length;
  if (bitArrayLength < (n * k)) {
    const paddingLength = (n * k) - bitArrayLength;
    const padding = new Array(paddingLength).fill(0);
    bitArray.push(...padding);
    return bitArray;
  } else if (bitArrayLength > (n * k)) {
    console.error("Input string is larger than (n * k) bits");
    return null;
  }
}

/**
 * @param n - number of bits in bigint for each array item
 * @param k - number of array items
 * @param str - input string
 * @returns array of n-bit bigints of length k
 * 
 * This function takes an ASCII string and returns an array of BigInts, where each BigInt 
 * is composed of concatenated reversed binary representations of the characters in the string.
 * The least significant bit of the first BigInt corresponds to the first bit in the reversed 
 * binary representation of the first character in the string.
 * 
 * For example, if the first three characters of the string are 'abc' (whose binary representations 
 * are '01100001', '01100010', and '01100011'), the first BigInt will be formed by concatenating 
 * their reversed binary representations ('10000110', '01000110', '11000110') in the same order 
 * as the characters in the string:
 * '11000110' (reversed 'c') + '01000110' (reversed 'b') + '10000110' (reversed 'a') 
 * = '110001100100011010000110'.
 * 
 * This process continues for the rest of the string. If the string's length is less than (n*k)/8, 
 * the remaining bits in the last BigInt are filled with 0s. If the string's length is more than (n*k)/8, 
 * an error is thrown.
 */
export function stringToNBitBigIntArray(n: number, k: number, str: string) {
  // check if the string is ascii
  if (!/^[\x00-\x7F]*$/.test(str)) {
    console.error("Input string is not ascii");
    return null;
  }

  // check if n is divisible by 8
  if (n % 8 !== 0) {
    console.error("n should be divisible by 8");
    return null;
  }

  // convert the string to bytes
  const strBytes = new TextEncoder().encode(str);
  const numBytes = n / 8; // number of bytes per array item

  // check if input string is larger than (n*k)/8
  if (strBytes.length > numBytes * k) {
    console.error("Input string is larger than (n * k) / 8 bytes");
    return null;
  }

  // Pre-fill bigintArray with zeros
  const bigintArray = new Array(k).fill(BigInt(0));

  // convert bytes to n-bit bigints and fill with 0s if necessary
  for (let i = 0; i < strBytes.length; i++) {
    // Reverse the bits in each byte
    const reversedByte = parseInt(
      strBytes[i].toString(2).padStart(8, '0').split('').reverse().join(''),
      2
    );
    // Calculate the corresponding index and offset in the bigintArray
    const index = Math.floor(i / numBytes);
    const offset = (i % numBytes) * 8;
    // Update the corresponding bigint
    bigintArray[index] |= BigInt(reversedByte) << BigInt(offset);
  }

  return bigintArray;
}
