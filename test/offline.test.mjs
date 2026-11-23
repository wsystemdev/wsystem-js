import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { WSystem, OPERATIONS, decodePdf, BadRequestError, AuthenticationError, PaymentRequiredError, NotFoundError, ConflictError, RateLimitError, ServerError, WSystemError, WSystemTimeoutError, WSystemConnectionError } from "../index.mjs";

const require = createRequire(import.meta.url);
const cjs = require("../index.cjs");

const res = (status, obj, headers = {}) => new Response(typeof obj === "string" ? obj : JSON.stringify(obj), { status, headers: { "content-type": typeof obj === "string" ? "application/xml" : "application/json", ...headers } });
function mk(responses = [res(200, {})], opts = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url: String(url), ...init });
    const r = responses.length > 1 ? responses.shift() : responses[0];
    if (r instanceof Error) throw r;
    return r.clone();
  };
  return [new WSystem({ apiKey: "k_test", fetch, sleep: async () => {}, ...opts }), calls];
}

test("all 57 operations exist and route with the right method and path depth", async () => {
  assert.equal(OPERATIONS.length, 57);
  for (const [id, method, path] of OPERATIONS) {
    const [ws, calls] = mk([res(200, { ok: true })]);
    const fn = ws[id];
    assert.equal(typeof fn, "function", id);
    const nargs = path.split("{").length - 1;
    const needsBody = /^(POST|PUT)$/.test(method);
    const args = Array.from({ length: nargs }, () => "x1");
    // required query params are positional too: probe by arity (fn.length counts params without defaults)
    const total = fn.length;
    while (args.length < total) args.push(needsBody && args.length === total - 1 ? { a: 1 } : "x1");
    const out = await fn.apply(ws, args);
    assert.deepEqual(out, { ok: true }, id);
    assert.equal(calls[0].method, method, id);
    assert.equal(new URL(calls[0].url).pathname.split("/").length, path.split("/").length, id);
    assert.equal(calls[0].headers["X-API-Key"], "k_test");
  }
});

test("path and query encoding", async () => {
  const [ws, calls] = mk();
  await ws.verifyVat("BE0403170701", { nocache: true, requester: undefined });
  assert.equal(calls[0].url, "https://api.wsystem.dev/verify?vat=BE0403170701&nocache=true");
  await ws.getPeppolMandate("a/b c");
  assert.ok(calls[1].url.endsWith("/einvoice/mandates/a%2Fb%20c"));
});

test("json, xml and pdf bodies", async () => {
  const [ws, calls] = mk();
  await ws.createEinvoice({ format: "zugferd" });
  assert.equal(calls[0].headers["Content-Type"], "application/json");
  await ws.validateEinvoice("<Invoice/>");
  assert.equal(calls[1].headers["Content-Type"], "application/xml");
  await ws.validateEinvoice(new TextEncoder().encode("%PDF-1.7"));
  assert.equal(calls[2].headers["Content-Type"], "application/pdf");
});

test("zugferd create, credit note, sample, pdf helper", async () => {
  const pdf = Buffer.from("%PDF-1.7 test");
  const [ws, calls] = mk([res(200, { valid: true, pdf_base64: pdf.toString("base64") })]);
  const out = await ws.einvoiceCreatePdf({ type_code: "381", preceding_invoice: "RE-1", preceding_invoice_date: "2026-11-01" });
  assert.deepEqual(Buffer.from(out), pdf);
  const body = JSON.parse(calls[0].body);
  assert.equal(body.format, "zugferd"); assert.equal(body.type_code, "381"); assert.equal(body.preceding_invoice, "RE-1");
  await ws.einvoiceSample({ type: "credit_note" });
  assert.ok(calls[1].url.endsWith("/einvoice/sample?type=credit_note"));
  assert.throws(() => decodePdf({ valid: true }));
});

test("request id and idempotency key pass through", async () => {
  const [ws, calls] = mk([res(200, {})], { headers: { "X-App": "a" } });
  await ws.sendEinvoice({ x: 1 }, {}, { requestId: "req-1", idempotencyKey: "idem-1", headers: { "X-Trace": "t" } });
  const h = calls[0].headers;
  assert.equal(h["X-Request-Id"], "req-1"); assert.equal(h["Idempotency-Key"], "idem-1"); assert.equal(h["X-Trace"], "t"); assert.equal(h["X-App"], "a");
  assert.match(h["User-Agent"], /^wsystem-js\//);
});

test("typed errors", async () => {
  const cases = [[400, BadRequestError], [422, BadRequestError], [401, AuthenticationError], [403, AuthenticationError], [402, PaymentRequiredError], [404, NotFoundError], [409, ConflictError], [500, ServerError]];
  for (const [status, cls] of cases) {
    const [ws] = mk([res(status, { detail: "nope", docs_url: "https://api.wsystem.dev/docs#x" }, { "x-request-id": "srv-9" })], { maxRetries: 0 });
    await assert.rejects(ws.verifyVat("x"), (e) => e instanceof cls && e instanceof WSystemError && e.status === status && e.requestId === "srv-9" && !!e.docsUrl);
  }
  const [ws] = mk([res(402, { detail: "x" })]);
  await assert.rejects(ws.verifyVat("x"), /free-key/);
});

test("retries: GET on 503/429 with Retry-After; POST only with idempotency key", async () => {
  const sleeps = [];
  const [ws, calls] = mk([res(503, { detail: "d" }), res(429, { detail: "s" }, { "retry-after": "2" }), res(200, { ok: 1 })], { sleep: async (ms) => sleeps.push(ms) });
  assert.deepEqual(await ws.viesStatus(), { ok: 1 });
  assert.equal(calls.length, 3); assert.equal(sleeps[1], 2000);
  const [w2, c2] = mk([res(503, { detail: "d" }), res(200, { ok: 1 })]);
  await assert.rejects(w2.sendEinvoice({ a: 1 }), ServerError); assert.equal(c2.length, 1);
  const [w3, c3] = mk([res(503, { detail: "d" }), res(200, { ok: 1 })]);
  assert.deepEqual(await w3.sendEinvoice({ a: 1 }, {}, { idempotencyKey: "k" }), { ok: 1 }); assert.equal(c3.length, 2);
  const [w4] = mk([res(429, { detail: "s" }, { "retry-after": "3" })], { maxRetries: 1 });
  await assert.rejects(w4.viesStatus(), (e) => e instanceof RateLimitError && e.retryAfter === 3);
});

test("timeout and connection errors", async () => {
  const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
  const [ws, calls] = mk([abort], { maxRetries: 1 });
  await assert.rejects(ws.viesStatus(), WSystemTimeoutError); assert.equal(calls.length, 2);
  const [w2] = mk([new TypeError("fetch failed")], { maxRetries: 0 });
  await assert.rejects(w2.viesStatus(), (e) => e instanceof WSystemConnectionError && !(e instanceof WSystemTimeoutError));
});

test("0.2 convenience methods still work", async () => {
  const [ws, calls] = mk();
  await ws.companySearch("acme", { country: "DE" });
  assert.ok(calls[0].url.includes("/company?q=acme&country=DE"));
  await ws.verifyVatBatch(["BE0403170701"]);
  assert.deepEqual(JSON.parse(calls[1].body), { vats: ["BE0403170701"] });
  await ws.einvoiceValidate("<x/>", { rules: "xrechnung" });
  assert.ok(calls[2].url.endsWith("/einvoice/validate?rules=xrechnung"));
  await ws.usage();
  assert.ok(calls[3].url.endsWith("/billing/usage"));
});

test("xml responses and the CommonJS build", async () => {
  const [ws] = mk([res(200, "<Invoice/>")]);
  assert.equal(await ws.einvoiceSample(), "<Invoice/>");
  assert.equal(cjs.OPERATIONS.length, 57);
  assert.equal(typeof new cjs.WSystem().verifyVat, "function");
  assert.equal(cjs.VERSION, "0.3.0");
});

test("current API error shape: error / message / docs", async () => {
  const [ws] = mk([res(400, { error: "missing_input", message: "needs input", docs: "https://api.wsystem.dev/docs" })], { maxRetries: 0 });
  await assert.rejects(ws.validateEinvoice({}), (e) => e instanceof BadRequestError && e.code === "missing_input" && /needs input/.test(e.message) && e.docsUrl === "https://api.wsystem.dev/docs" && e.requestId === undefined);
});
