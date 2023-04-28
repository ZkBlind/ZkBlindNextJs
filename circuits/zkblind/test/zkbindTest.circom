pragma circom 2.0.2;

include "../zkblind.circom";

component main {public [userEmailSuffix, privkey, publickey]} = zkBlind();
