import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  defaultChain: process.env.DEFAULT_CHAIN || "stellar",
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",

  stellar: {
    network: process.env.STELLAR_NETWORK || "testnet",
    horizonUrl: process.env.HORIZON_URL || "https://horizon-testnet.stellar.org",
    serverPublicKey: process.env.SERVER_KEY_PUBLIC || "",
    serverSecretKey: process.env.SERVER_KEY_SECRET || ""
  }
  // Future chains like Ethereum, Solana can go here
};