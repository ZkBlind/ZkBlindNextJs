
import path from "path";
import wasm_tester from "../../../wasm_tester";
import {
  setupDirectories,
  padEmailTo2032Bits,
  stringToBitArray,
  bitArray2buffer,
  getCircuitInputWithAddrAndSig,
  getAddrAndSig,
  generateEmailSuffix
} from "../../test_utils"
import { sha256 } from 'js-sha256';
import { assert } from 'chai';

const pathToCircom = "./zkbindTest.circom"

describe("Test zkblind", function () {
  const output = setupDirectories(pathToCircom);

  it("Checks zkblind", async function () {
    const email = "example@example.com";

    const paddedEmail = padEmailTo2032Bits(email);

    if (!paddedEmail) {
      throw ("The email address is not valid.");
    }

    const emailAddressInputBits = stringToBitArray(paddedEmail);

    const emailAddressSuffix = generateEmailSuffix(paddedEmail)

    if (!emailAddressSuffix) {
      throw ("The email address suffix is not valid.");
    }

    const emailAddressSuffixInputBits = stringToBitArray(emailAddressSuffix);

    const hash = sha256(paddedEmail);


    const privateKey = "f5b552f608f5b552f608f5b552f6082ff5b552f608f5b552f608f5b552f6082f"
    const addrAndSig = getAddrAndSig(privateKey)
    const sigInput = getCircuitInputWithAddrAndSig(addrAndSig)

    const circuit = await wasm_tester(
      path.join(__dirname, pathToCircom),
      {
        output
      }
    );

    const w = await circuit.calculateWitness({
      userEmailAddress: emailAddressInputBits,
      userEmailSuffix: emailAddressSuffixInputBits,
      userSigR: sigInput.r,
      userSigS: sigInput.s,
      userEthAddressSha256Hash: sigInput.msghash,
      userPubKey: sigInput.pubkey,
      "privkey": ["6862539325408419825", "7739665414899438580", "3575179427557022600", "11277760030985572954"],
      "publickey": "978617770967819762654777740949918972567359649306"

    });

    const arrOut = w.slice(1, 257);
    const hash2 = bitArray2buffer(arrOut).toString("hex");

    assert.equal(hash, hash2);

    await circuit.checkConstraints(w);
  });
});
