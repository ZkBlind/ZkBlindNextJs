.env file:

```bash
GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/{}
PRIVATE_KEY=
```

to deploy contract:
`forge script script/SimpleMultiplier.s.sol SimpleMultiplierScript --broadcast --verify --rpc-url goerli`
