import { Server } from "stellar-sdk";
import { config } from "../config/env";

export const horizon = new Server(config.stellar.horizonUrl);