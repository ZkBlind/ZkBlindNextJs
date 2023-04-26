.env file:

```bash
GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/{}
PRIVATE_KEY=
```

to deploy contract on goerli:
`forge script script/SimpleMultiplier.s.sol SimpleMultiplierScript --broadcast --verify --rpc-url goerli`

to deploy contract on mantle testnet:
`forge script script/SimpleMultiplier.s.sol SimpleMultiplierScript --broadcast --verify --rpc-url mantle --legacy`
