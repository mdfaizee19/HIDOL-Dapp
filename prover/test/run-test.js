// test/run-test.js
import fs from "fs";
import path from "path";
import { generateProof } from "../src/index.js";

async function main() {
  const samplePath = path.join(process.cwd(), "test", "sample.json");
  const raw = JSON.parse(fs.readFileSync(samplePath, "utf8"));
  const out = await generateProof(raw);
  console.log("=== Prover Output ===");
  console.log(JSON.stringify(out, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
