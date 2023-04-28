pragma circom 2.0.2;

include "./zkblind/zkblindSimplified.circom";

component main {public [userEmailSuffix]} = zkBlind();
