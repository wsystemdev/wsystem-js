// W System API client: EU VAT (VIES), EORI, company registers, sanctions,
// KYB and EU e-invoicing (EN 16931, XRechnung, ZUGFeRD / Factur-X, Peppol). Zero dependencies, Node 18+ / browsers / Deno / Bun.
import { Operations, OPERATIONS } from "./operations.mjs";

export { OPERATIONS };
export const VERSION = "0.3.0";
const DEFAULT_BASE = "https://api.wsystem.dev";
const RETRY_STATUS = new Set([429, 502, 503, 504]);
const IDEMPOTENT = new Set(["GET", "HEAD", "PUT", "DELETE", "OPTIONS"]);

/** Base class of everything this SDK throws. Status errors carry status, body, code, requestId, docsUrl. */
export class WSystemError extends Error {
  constructor(message, status, body, headers) {
    super(message);
    this.name = "WSystemError";
    this.status = status;
    this.body = body;
    this.headers = headers ?? {};
    this.requestId = this.headers["x-request-id"];
    const d = body && typeof body === "object" ? body : {};
    this.code = (d.detail && typeof d.detail === "object" ? d.detail.code : undefined) ?? (typeof d.error === "string" ? d.error : undefined) ?? d.code;
    this.docsUrl = d.docs_url ?? d.docs;
  }
}
export class WSystemConnectionError extends WSystemError { constructor(m) { super(m); this.name = "WSystemConnectionError"; } }
export class WSystemTimeoutError extends WSystemConnectionError { constructor(m) { super(m); this.name = "WSystemTimeoutError"; } }
export class BadRequestError extends WSystemError { constructor(...a) { super(...a); this.name = "BadRequestError"; } }
export class AuthenticationError extends WSystemError { constructor(...a) { super(...a); this.name = "AuthenticationError"; } }
export class PaymentRequiredError extends WSystemError { constructor(...a) { super(...a); this.name = "PaymentRequiredError"; } }
export class NotFoundError extends WSystemError { constructor(...a) { super(...a); this.name = "NotFoundError"; } }
export class ConflictError extends WSystemError { constructor(...a) { super(...a); this.name = "ConflictError"; } }
export class RateLimitError extends WSystemError { constructor(...a) { super(...a); this.name = "RateLimitError"; const r = parseFloat(this.headers["retry-after"]); this.retryAfter = Number.isFinite(r) ? r : undefined; } }
export class ServerError extends WSystemError { constructor(...a) { super(...a); this.name = "ServerError"; } }

function errorFor(status) {
  if (status === 400 || status === 422) return BadRequestError;
  if (status === 401 || status === 403) return AuthenticationError;
  if (status === 402) return PaymentRequiredError;
  if (status === 404) return NotFoundError;
  if (status === 409) return ConflictError;
  if (status === 429) return RateLimitError;
  if (status >= 500) return ServerError;
  return WSystemError;
}

const isPdf = (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46;
function encodeBody(body) {
  if (body === undefined || body === null) return [undefined, undefined];
  if (typeof body === "string") return [body, body.startsWith("%PDF") ? "application/pdf" : "application/xml"];
  if (body instanceof ArrayBuffer) body = new Uint8Array(body);
  if (ArrayBuffer.isView(body)) {
    const u = new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
    return [u, isPdf(u) ? "application/pdf" : "application/xml"];
  }
  return [JSON.stringify(body), "application/json"];
}
const backoff = (attempt, retryAfter) =>
  retryAfter !== undefined ? Math.min(Math.max(retryAfter, 0), 30) * 1000 : Math.min(500 * 2 ** attempt, 8000) * (0.75 + Math.random() / 2);

export class WSystem extends Operations {
  /**
   * @param {{apiKey?: string, baseUrl?: string, fetch?: typeof fetch, timeoutMs?: number, maxRetries?: number, headers?: Record<string,string>, sleep?: (ms:number)=>Promise<void>}} [opts]
   */
  constructor(opts = {}) {
    super();
    const env = typeof process !== "undefined" ? process.env ?? {} : {};
    this.apiKey = opts.apiKey ?? (env.WSYSTEM_API_KEY || undefined);
    this.baseUrl = (opts.baseUrl ?? (env.WSYSTEM_BASE_URL || DEFAULT_BASE)).replace(/\/+$/, "");
    this._fetch = opts.fetch ?? globalThis.fetch.bind(globalThis);
    this.timeoutMs = opts.timeoutMs ?? 30000;
    this.maxRetries = opts.maxRetries ?? 2;
    this.defaultHeaders = opts.headers ?? {};
    this._sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  }

  /**
   * Call any endpoint. Per-request options: headers, timeoutMs, maxRetries, requestId (X-Request-Id), idempotencyKey (Idempotency-Key).
   */
  async request(method, path, { query, body, headers: extra, timeoutMs, maxRetries, requestId, idempotencyKey } = {}) {
    const url = new URL(this.baseUrl + path);
    if (query) for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    const headers = { Accept: "application/json", "User-Agent": `wsystem-js/${VERSION}`, ...this.defaultHeaders };
    if (this.apiKey) headers["X-API-Key"] = this.apiKey;
    const [payload, ctype] = encodeBody(body);
    if (ctype) headers["Content-Type"] = ctype;
    if (requestId) headers["X-Request-Id"] = requestId;
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
    Object.assign(headers, extra ?? {});
    const retries = maxRetries ?? this.maxRetries;
    // POST is only retried with an Idempotency-Key: otherwise a retry could repeat the work
    const canRetry = IDEMPOTENT.has(method) || Object.keys(headers).some((k) => k.toLowerCase() === "idempotency-key");
    for (let attempt = 0; ; attempt++) {
      const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
      const ms = timeoutMs ?? this.timeoutMs;
      const timer = ctl ? setTimeout(() => ctl.abort(), ms) : null;
      let res, text;
      try {
        res = await this._fetch(url, { method, headers, body: payload, signal: ctl?.signal });
        text = await res.text();
      } catch (e) {
        const err = e?.name === "AbortError" ? new WSystemTimeoutError(`W System API request timed out after ${ms} ms`) : new WSystemConnectionError(`W System API request failed: ${e?.message ?? e}`);
        if (canRetry && attempt < retries) { await this._sleep(backoff(attempt)); continue; }
        throw err;
      } finally {
        if (timer) clearTimeout(timer);
      }
      const rh = {};
      res.headers?.forEach?.((v, k) => { rh[k.toLowerCase()] = v; });
      if (RETRY_STATUS.has(res.status) && canRetry && attempt < retries) {
        const ra = parseFloat(rh["retry-after"]);
        await this._sleep(backoff(attempt, Number.isFinite(ra) ? ra : undefined));
        continue;
      }
      const ct = rh["content-type"] ?? "";
      let data = text;
      if (text && (ct.includes("json") || !ct)) { try { data = JSON.parse(text); } catch { data = text; } }
      else if (!text) data = null;
      if (!res.ok) {
        const msg = res.status === 402
          ? "Free tier used up (HTTP 402). Get a free key (500 units/month) at https://api.wsystem.dev/account/free-key or a plan at https://wsystem.dev/pricing"
          : `W System API HTTP ${res.status}: ${typeof data === "object" && data ? (data.detail ?? data.message ?? data.error ?? JSON.stringify(data)) : text}`;
        throw new (errorFor(res.status))(typeof msg === "string" ? msg : JSON.stringify(msg), res.status, data, rh);
      }
      return data;
    }
  }

  // --- 0.2 convenience signatures (kept; every operation is also available under its OpenAPI operationId) ---
  verifyVatBatch(vats, opts = {}, options) { return this.request("POST", "/verify/batch", { body: { vats, ...opts }, ...options }); }
  verifyEoriBatch(eoris, options) { return this.request("POST", "/eori/batch", { body: { eoris }, ...options }); }
  companySearch(q, opts = {}, options) { return this.lookupCompany(q, opts, options); }
  companyBatch(queries, opts = {}, options) { return this.request("POST", "/company/batch", { body: { queries, ...opts }, ...options }); }
  sanctionsScreen(name, opts = {}, options) { return this.screenSanctions(name, opts, options); }
  sanctionsScreenBatch(names, opts = {}, options) { return this.request("POST", "/sanctions/screen/batch", { body: { names, ...opts }, ...options }); }
  kybCheck(company, opts = {}, options) { return this.request("POST", "/kyb/check", { body: { company, ...opts }, ...options }); }
  ddReport(company, opts = {}, options) { return this.request("POST", "/ddreport", { body: { company, ...opts }, ...options }); }
  einvoiceValidate(xml, opts = {}, options) {
    const { rules, base64 } = opts;
    return this.request("POST", "/einvoice/validate", { query: { rules }, body: base64 ? { base64: xml } : { xml }, ...options });
  }
  einvoiceParse(xml, opts = {}, options) { return this.request("POST", "/einvoice/parse", { body: opts.base64 ? { base64: xml } : { xml }, ...options }); }
  einvoiceCreate(invoice, options) { return this.createEinvoice(invoice, {}, options); }
  usage(options) { return this.billingUsage({}, options); }
  plans(options) { return this.billingPlans({}, options); }

  /** Create a ZUGFeRD / Factur-X PDF (format "zugferd"); returns the PDF bytes. */
  async einvoiceCreatePdf(invoice, options) {
    const res = await this.createEinvoice({ format: "zugferd", ...invoice }, {}, options);
    return decodePdf(res);
  }
}

/** PDF bytes from a POST /einvoice/create answer made with format zugferd / zugferd-xrechnung. */
export function decodePdf(result) {
  const b64 = result?.pdf_base64;
  if (!b64) throw new Error("answer has no pdf_base64 (use format 'zugferd')");
  return Uint8Array.from(typeof Buffer !== "undefined" ? Buffer.from(b64, "base64") : atob(b64), (c) => (typeof c === "number" ? c : c.charCodeAt(0)));
}

export default WSystem;
