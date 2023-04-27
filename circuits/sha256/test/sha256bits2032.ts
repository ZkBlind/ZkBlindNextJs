import path from "path";
import wasm_tester from "../../../wasm_tester";
import { setupDirectories } from "../../test_utils"
import { sha256 } from 'js-sha256';
import { assert } from 'chai';

const pathToCircom = "../sha256bits2032.circom"

function isASCII(str: string): boolean {
  return /^[\x00-\x7F]*$/.test(str);
}

function padEmailTo2032Bits(email: string): string | null {
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

function stringToBitArray(input: string): number[] {
  const bitArray = input
    .split('')
    .flatMap(char => {
      const byte = char.charCodeAt(0);
      return Array.from({ length: 8 }, (_, j) => (byte >> (7 - j)) & 1);
    });
  return bitArray;
}


function bitArray2buffer(a: number[]) {
  const len = Math.floor((a.length - 1) / 8) + 1;
  const b = Buffer.alloc(len);

  for (let i = 0; i < a.length; i++) {
    const p = Math.floor(i / 8);
    b[p] = b[p] | (Number(a[i]) << (7 - (i % 8)));
  }
  return b;
}


describe("Test sha256", function () {
  const output = setupDirectories(pathToCircom);

  it("test sha256", async function () {

    const email = "example@example.com";

    const paddedEmail = padEmailTo2032Bits(email);

    if (!paddedEmail) {
      throw ("The email address is not valid.");
    }

    const hash = sha256(paddedEmail);

    const inputBits = stringToBitArray(paddedEmail);

    const circuit = await wasm_tester(
      path.join(__dirname, pathToCircom),
      {
        output
      }
    );

    const w = await circuit.calculateWitness({ "in": inputBits }, true);

    const arrOut = w.slice(1, 257);
    const hash2 = bitArray2buffer(arrOut).toString("hex");

    assert.equal(hash, hash2);

    await circuit.checkConstraints(w);
  });
});
