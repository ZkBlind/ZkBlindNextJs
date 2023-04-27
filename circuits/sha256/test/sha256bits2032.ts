import path from "path";
import wasm_tester from "../../../wasm_tester";
import {
  setupDirectories,
  padEmailTo2032Bits,
  stringToBitArray,
  bitArray2buffer
} from "../../test_utils"
import { sha256 } from 'js-sha256';
import { assert } from 'chai';

const pathToCircom = "../sha256bits2032.circom"

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
