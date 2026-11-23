// Live smoke test against https://api.wsystem.dev. Run: WSYSTEM_LIVE=1 WSYSTEM_API_KEY=... node test/live.smoke.mjs  (the key is never printed)
import assert from "node:assert/strict";
import { WSystem } from "../index.mjs";
if (process.env.WSYSTEM_LIVE !== "1") { console.log("skipped (set WSYSTEM_LIVE=1)"); process.exit(0); }
const ws = new WSystem();
assert.equal((await ws.verifyVat("BE0403170701")).status, "valid");
const sample = await ws.einvoiceSample({ type: "credit_note" });
assert.ok(sample);
const res = await ws.createEinvoice({ ...sample, format: "zugferd" });
assert.equal(res.valid, true); assert.ok(res.pdf_base64);
console.log("live smoke ok");
