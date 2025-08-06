import express from "express";
import { Transaction, Keypair } from "stellar-sdk";

const router = express.Router();

const SIGNING_KEY = process.env.CLIENT_DOMAIN_SECRET!; // Secure this

router.post("/sign", (req, res) => {
  const { transaction: xdr, network_passphrase } = req.body;

  try {
    const txn = new Transaction(xdr, network_passphrase);

    if (Number.parseInt(txn.sequence, 10) !== 0) {
      return res.status(400).send("Transaction sequence value must be '0'");
    }

    const signerKeypair = Keypair.fromSecret(SIGNING_KEY);
    txn.sign(signerKeypair);

    return res.status(200).json({
      transaction: txn.toEnvelope().toXDR("base64"),
      network_passphrase,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
