pragma circom 2.0.2;

include "../ecsda-circom/ecdsa.circom";
include "../../node_modules/circomlib/circuits/sha256/sha256.circom";
include "../ecsda-circom/eth_addr_2.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";

template zkBlind() {
    signal input userEmailAddress[2032];
    signal input userEmailSuffix[16]; // 128 bits

    // signal input privkey[4];
    // signal input publickey;

    // signal input userPrivateKey[256];
    // signal input userEthAddress[2][256];

    signal input userSigR[4];
    signal input userSigS[4];
    signal input userEthAddressSha256Hash[4];
    signal input userPubKey[2][4];

    signal output userID;

    // Constraint 1: User ID is SHA-256 of the user email address
    component sha256Hash = Sha256(2032);
    for (var i = 0; i < 2032; i++) {
        sha256Hash.in[i] <== userEmailAddress[i];
    }

    component bits2num[2];

    bits2num[0] = Bits2Num(128);
    bits2num[1] = Bits2Num(128);

    for (var i = 0; i < 128; i++) {
        bits2num[0].in[i] <== sha256Hash.out[i];
    }

    for (var i = 128; i < 256; i++) {
        bits2num[1].in[i - 128] <== sha256Hash.out[i];
    }

    userID <== bits2num[1].out;

    // // Constraint 2: User email address suffix is the suffix of the user email address
    // // Assuming userEmailSuffix corresponds to the last 256 bits of userEmail
    // for (var i = 0; i < 2032; i++) {
    //     userEmailSuffix[i] === userEmailAddress[i];
    // }

    // Constraint 3: User signature of the ETH address is valid
    component ecdsaVerifyNoPubkeyCheck = ECDSAVerifyNoPubkeyCheck(64, 4);

    for (var i = 0; i < 4; i++) {
        ecdsaVerifyNoPubkeyCheck.r[i] <== userSigR[i];
        ecdsaVerifyNoPubkeyCheck.s[i] <== userSigS[i];
        ecdsaVerifyNoPubkeyCheck.msghash[i] <== userEthAddressSha256Hash[i];
    }

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 4; j++) {
            ecdsaVerifyNoPubkeyCheck.pubkey[i][j] <== userPubKey[i][j];
        }
    }

    // // Constraint 4: user private key can be converted to user ETH address
    // component privToAddr = PrivKeyToAddr(64, 4);  // 4
    
    // for (var i = 0; i < 4; i++) {
    //     privToAddr.privkey[i] <== privkey[i];
    // }
    // privToAddr.publickey <== publickey;

    // publickey === privToAddr.addr;


    // Enforce that the signature is valid
    ecdsaVerifyNoPubkeyCheck.result === 1;
}
