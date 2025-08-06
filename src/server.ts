import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enable CORS (see next section for options)
app.use(cors());

// Body parser
app.use(express.json());

// Load HTTPS credentials
const key = fs.readFileSync(path.join(__dirname, '../cert/server.key'));
const cert = fs.readFileSync(path.join(__dirname, '../cert/server.cert'));

const server = https.createServer({ key, cert }, app);

const PORT = process.env.PORT || 443;

server.listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
});
