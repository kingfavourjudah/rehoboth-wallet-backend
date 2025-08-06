import { swaggerSpec } from "../src/config/swagger";
import fs from "fs";
import path from "path";

// Ensure the docs directory exists
const docsDir = path.join(__dirname, "../docs");
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Write the spec to the file
fs.writeFileSync(path.join(docsDir, "swagger.json"), JSON.stringify(swaggerSpec, null, 2));

console.log("Congratulations, the current swagger spec exported to docs/swagger.json");
