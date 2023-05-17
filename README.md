# ZkBlind

zkBind is a solution leveraging Zero-Knowledge Proofs (ZKP) to authenticate your employment with a specific company without revealing your actual identity. Here's how you can use it:

## Step-by-step Guide:

1. Send Email: Send an email from your corporate account to your personal account. In the email body, include your Ethereum (ETH) address and its corresponding signature. 

2. Generate ZKP: Download this email from your personal account and use our provided script to generate the ZKP.

3. Registration & Validation: Fill out a form on zkBind with your ZKP, email suffix (indicating your company), ETH address, and user ID. zkBind will validate your submitted information. Upon successful validation, your user details will be registered in a smart contract.

4. Usage: You can now log in to zkBind with your ETH wallet and post messages. Despite being verified as an employee of a specific company (via your email suffix), your individual identity remains anonymous.


## Set up
Make sure your node version is 15 or above.
Run `npm i`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


## Deploy on Vercel

Deploy Next.js app using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

