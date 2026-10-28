"use strict";
// W System API client: EU VAT (VIES), EORI, company registers, sanctions,
// KYB and EU e-invoicing (EN 16931 / Peppol). Zero dependencies, Node 18+ / browsers / Deno / Bun.
const DEFAULT_BASE = "https://api.wsystem.dev";

class WSystemError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "WSystemError";
    this.status = status;
    this.body = body;
  }
}

class WSystem {
  /**
   * @param {{apiKey?: string, baseUrl?: string, fetch?: typeof fetch, timeoutMs?: number}} [opts]
   */
  constructor(opts = {}) {
    this.apiKey = opts.apiKey ?? (typeof process !== "undefined" ? process.env?.WSYSTEM_API_KEY : undefined);
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE).replace(/\/+$/, "");
    this._fetch = opts.fetch ?? globalThis.fetch.bind(globalThis);
    this.timeoutMs = opts.timeoutMs ?? 30000;
  }

  async request(method, path, { query, body } = {}) {
    const url = new URL(this.baseUrl + path);
    if (query) for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    const headers = { Accept: "application/json", "User-Agent": "wsystem-js/0.1.0" };
    if (this.apiKey) headers["X-API-Key"] = this.apiKey;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), this.timeoutMs) : null;
    let res;
    try {
      res = await this._fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: ctl?.signal });
    } finally {
      if (timer) clearTimeout(timer);
    }
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const msg = res.status === 402
        ? "Free tier used up (HTTP 402). Get a free key (500 units/month) at https://api.wsystem.dev/account/free-key or a plan at https://wsystem.dev/pricing"
        : `W System API HTTP ${res.status}: ${typeof data === "object" && data ? (data.detail ?? data.error ?? JSON.stringify(data)) : text}`;
      throw new WSystemError(typeof msg === "string" ? msg : JSON.stringify(msg), res.status, data);
    }
    return data;
  }

  // VAT (VIES)
  verifyVat(vat, opts = {}) { return this.request("GET", "/verify", { query: { vat, ...opts } }); }
  verifyVatBatch(vats, opts = {}) { return this.request("POST", "/verify/batch", { body: { vats, ...opts } }); }
  viesStatus() { return this.request("GET", "/vies/status"); }
  // EORI
  verifyEori(eori) { return this.request("GET", "/eori", { query: { eori } }); }
  verifyEoriBatch(eoris) { return this.request("POST", "/eori/batch", { body: { eoris } }); }
  // Company registers, sanctions, KYB
  companySearch(q, opts = {}) { return this.request("GET", "/company", { query: { q, ...opts } }); }
  companyBatch(queries, opts = {}) { return this.request("POST", "/company/batch", { body: { queries, ...opts } }); }
  sanctionsScreen(name, opts = {}) { return this.request("GET", "/sanctions/screen", { query: { name, ...opts } }); }
  sanctionsScreenBatch(names, opts = {}) { return this.request("POST", "/sanctions/screen/batch", { body: { names, ...opts } }); }
  kybCheck(company, opts = {}) { return this.request("POST", "/kyb/check", { body: { company, ...opts } }); }
  ddReport(company, opts = {}) { return this.request("POST", "/ddreport", { body: { company, ...opts } }); }
  // E-invoicing
  einvoiceRoute(id, opts = {}) { return this.request("GET", "/einvoice/route", { query: { id, ...opts } }); }
  einvoiceValidate(xml, opts = {}) {
    const { rules, base64 } = opts;
    return this.request("POST", "/einvoice/validate", { query: { rules }, body: base64 ? { base64: xml } : { xml } });
  }
  einvoiceParse(xml, opts = {}) {
    // Read an incoming UBL / CII / XRechnung / ZUGFeRD (base64 PDF) invoice as normalized JSON
    return this.request("POST", "/einvoice/parse", { body: opts.base64 ? { base64: xml } : { xml } });
  }
  einvoiceCreate(invoice) { return this.request("POST", "/einvoice/create", { body: invoice }); }
  einvoiceSample() { return this.request("GET", "/einvoice/sample"); }
  frPaRegistry(opts = {}) { return this.request("GET", "/fr/pa-registry", { query: opts }); }
  // Account
  usage() { return this.request("GET", "/billing/usage"); }
  plans() { return this.request("GET", "/billing/plans"); }
}

module.exports = WSystem;
module.exports.WSystem = WSystem;
module.exports.WSystemError = WSystemError;
module.exports.default = WSystem;
