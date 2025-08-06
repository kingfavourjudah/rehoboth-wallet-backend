import express from "express";
import { getAnchorService } from "../services/anchor.service";

const router = express.Router();

// GET /anchor/sep1?domain=testanchor.stellar.org&chain=stellar
router.get("/sep1", async (req, res) => {
  const { domain, allowHttp = "false", chain = "stellar" } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Missing anchor domain" });
  }

  try {
    const anchorService = getAnchorService(chain as string);
    const sep1 = await anchorService.fetchSep1(domain as string, allowHttp === "true");
    res.json(sep1);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch SEP-1 info" });
  }
});

export default router;
