// Generated from the W System OpenAPI 0.3.130 by growth/sdk/gen.py. Do not edit by hand.
export type Params = Record<string, string | number | boolean | undefined | null>;
export interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  maxRetries?: number;
  /** Sent as X-Request-Id. */
  requestId?: string;
  /** Sent as Idempotency-Key; POST requests are only retried when this is set. */
  idempotencyKey?: string;
}
export interface WSystemOptions {
  /** Monthly-plan or free key (X-API-Key). Defaults to process.env.WSYSTEM_API_KEY. Without a key: free tier (20 calls/day/IP). */
  apiKey?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
  /** Retries for GET/PUT/DELETE (and POST with an idempotency key) on network errors, 429, 502, 503, 504. Default 2. */
  maxRetries?: number;
  headers?: Record<string, string>;
  sleep?: (ms: number) => Promise<void>;
}
export declare const VERSION: string;
export declare const OPERATIONS: ReadonlyArray<readonly [operationId: string, method: string, path: string]>;
export declare class WSystemError extends Error {
  status?: number;
  body?: unknown;
  headers: Record<string, string>;
  requestId?: string;
  code?: string;
  docsUrl?: string;
}
export declare class WSystemConnectionError extends WSystemError {}
export declare class WSystemTimeoutError extends WSystemConnectionError {}
export declare class BadRequestError extends WSystemError {}
export declare class AuthenticationError extends WSystemError {}
export declare class PaymentRequiredError extends WSystemError {}
export declare class NotFoundError extends WSystemError {}
export declare class ConflictError extends WSystemError {}
export declare class ServerError extends WSystemError {}
export declare class RateLimitError extends WSystemError { retryAfter?: number }
type Json = any;
export declare class Operations {
  /** Monthly API-key plans (GET /billing/plans) */
  billingPlans(params?: Params, options?: RequestOptions): Promise<any>;
  /** Your API key's plan, monthly quota, units used, and paid x402 calls attributed to this key (free; no units consumed) (GET /billing/usage) */
  billingUsage(params?: Params, options?: RequestOptions): Promise<any>;
  /** Start Stripe Checkout for a monthly plan (POST /billing/checkout) */
  billingCheckout(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Get the Peppol mandate terms to show the signer (GET /einvoice/mandate-terms) */
  einvoiceMandateTerms(params?: Params, options?: RequestOptions): Promise<any>;
  /** Record a company's Peppol mandate (click-through acceptance) (POST /einvoice/mandates) */
  createPeppolMandate(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Get one of your Peppol mandate records (GET /einvoice/mandates/{mid}) */
  getPeppolMandate(mid: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Revoke a Peppol mandate (POST /einvoice/mandates/{mid}/revoke) */
  revokePeppolMandate(mid: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** LIVE: documents received over Peppol for your mandated companies (X-API-Key) (GET /einvoice/inbox) */
  einvoiceInbox(params?: Params, options?: RequestOptions): Promise<any>;
  /** LIVE: signed download link for a received document's original UBL (valid 1 hour) (GET /einvoice/inbox/{document_id}/ubl) */
  einvoiceInboxUbl(documentId: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** LIVE: delivery state of a document you sent with mode=live (TRANSIT -> SENT, or FAILED = not charged) (GET /einvoice/live/{document_id}) */
  einvoiceLiveStatus(documentId: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** List the client companies under your key: onboarding stage, live readiness and per-company live document counts (GET /platform/companies) */
  listPlatformCompanies(params?: Params, options?: RequestOptions): Promise<any>;
  /** One client company under your key: onboarding stage, next step and live document counts (GET /platform/companies/{mandate_id}) */
  getPlatformCompany(mandateId: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Set or replace your webhook URL for company.stage_changed (signing secret returned once) (POST /platform/webhook) */
  setPlatformWebhook(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Your webhook URL and its recent deliveries (the secret is never shown again) (GET /platform/webhook) */
  getPlatformWebhook(params?: Params, options?: RequestOptions): Promise<any>;
  /** Remove your webhook (DELETE /platform/webhook) */
  deletePlatformWebhook(params?: Params, options?: RequestOptions): Promise<any>;
  /** Send a signed webhook.test event to your URL now and return the delivery result (POST /platform/webhook/test) */
  testPlatformWebhook(params?: Params, options?: RequestOptions): Promise<any>;
  /** Platform plan: this month's checked documents, Peppol documents, active companies and cost estimate (free) (GET /platform/usage) */
  getPlatformUsage(params?: Params, options?: RequestOptions): Promise<any>;
  /** Platform plan: set or remove an optional monthly spend cap in EUR (calls that would exceed it get 429, nothing charged) (PUT /platform/spend-cap) */
  setPlatformSpendCap(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Check a received invoice before paying it: e-invoice rules, supplier VAT + sanctions, amounts, IBAN, duplicates, bank-detail changes -> ok / review / hold (POST /einvoice/check) */
  checkReceivedInvoice(body: string | Uint8Array | ArrayBuffer | Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Your checked received invoices, newest first (free) (GET /inbox/invoices) */
  listInboxInvoices(params?: Params, options?: RequestOptions): Promise<any>;
  /** One checked invoice with its full check result (free) (GET /inbox/invoices/{iid}) */
  getInboxInvoice(iid: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Delete one invoice from your inbox history (free) (DELETE /inbox/invoices/{iid}) */
  deleteInboxInvoice(iid: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Your own email intake address: forward supplier invoices there (free) (GET /inbox/address) */
  getInboxAddress(params?: Params, options?: RequestOptions): Promise<any>;
  /** Issue a new intake address; the old one stops working (free) (POST /inbox/address/rotate) */
  rotateInboxAddress(params?: Params, options?: RequestOptions): Promise<any>;
  /** Poland KSeF connector: what works, environment, how to connect (free) (GET /einvoice/ksef) */
  ksefInfo(params?: Params, options?: RequestOptions): Promise<any>;
  /** Connect a company's KSeF account (TEST, or DEMO if enabled): store its KSeF token encrypted after a sign-in check (POST /einvoice/ksef/connections) */
  ksefConnect(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** List the KSeF connections (companies) under your API key (GET /einvoice/ksef/connections) */
  ksefConnections(params?: Params, options?: RequestOptions): Promise<any>;
  /** Create a fictitious company in KSeF TEST (random NIP) and connect it, to try KSeF sending end to end (POST /einvoice/ksef/test-company) */
  ksefTestCompany(body?: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Start certificate sign-in: get a KSeF challenge and the unsigned AuthTokenRequest XML to sign externally (POST /einvoice/ksef/auth/challenge) */
  ksefAuthChallenge(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Finish certificate sign-in: accept the signed AuthTokenRequest, enroll a KSeF Authentication certificate, store it encrypted (POST /einvoice/ksef/auth/complete) */
  ksefAuthComplete(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Revoke a KSeF connection: the stored KSeF token is deleted at once (DELETE /einvoice/ksef/connections/{cid}) */
  ksefDisconnect(cid: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** KSeF status of a sent invoice: processing / accepted (KSeF number) / rejected (code and reason) (free) (GET /einvoice/ksef/invoices/{sid}) */
  ksefInvoiceStatus(sid: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** UPO (official KSeF receipt, XML signed by the Ministry of Finance) of an accepted invoice (free) (GET /einvoice/ksef/invoices/{sid}/upo) */
  ksefInvoiceUpo(sid: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** List invoices sent to KSeF under your API key (newest first, free) (GET /einvoice/ksef/invoices) */
  ksefInvoices(params?: Params, options?: RequestOptions): Promise<any>;
  /** Liveness check (GET /health) */
  health(params?: Params, options?: RequestOptions): Promise<any>;
  /** VIES availability per member state (free, cached 5 min) (GET /vies/status) */
  viesStatus(params?: Params, options?: RequestOptions): Promise<any>;
  /** Validate one EU VAT number (VIES) (GET /verify) */
  verifyVat(vat: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Validate up to 100 EU VAT numbers (POST /verify/batch) */
  verifyVatBatch(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Look up a company in official EU business registers (GET /company) */
  lookupCompany(q: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Batch company-registry lookup (max 25 queries) (POST /company/batch) */
  lookupCompanyBatch(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Screen a name against EU, UN, OFAC and UK sanctions lists (GET /sanctions/screen) */
  screenSanctions(name: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Batch sanctions screening (max 50 names) (POST /sanctions/screen/batch) */
  screenSanctionsBatch(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** One-call KYB: VAT + registry + sanctions -> verdict (POST /kyb/check) */
  kybCheck(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Validate one EU EORI number (EC EOS) (GET /eori) */
  verifyEori(eori: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Validate up to 100 EU EORI numbers (POST /eori/batch) */
  verifyEoriBatch(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Validate an EU e-invoice (EN 16931, XRechnung; UBL, CII, ZUGFeRD/Factur-X PDF) (POST /einvoice/validate) */
  validateEinvoice(body: string | Uint8Array | ArrayBuffer | Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Read an incoming EU e-invoice (UBL, CII, ZUGFeRD/Factur-X PDF) into JSON (POST /einvoice/parse) */
  parseEinvoice(body: string | Uint8Array | ArrayBuffer | Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Create a valid EU e-invoice (UBL 2.1, CII, ZUGFeRD/Factur-X PDF) from simple JSON (POST /einvoice/create) */
  createEinvoice(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** "Can I e-invoice this company?" VAT + Peppol + country mandate lookup (GET /einvoice/route) */
  einvoiceRoute(id: string | number, params?: Params, options?: RequestOptions): Promise<any>;
  /** Counterparty due-diligence report (VAT, register, sanctions, EORI, LEI, Peppol) with risk flags (POST /ddreport) */
  ddReport(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Is this platform on France's official list of Plateformes Agréées (PA)? (free) (GET /fr/pa-registry) */
  frPaRegistry(params?: Params, options?: RequestOptions): Promise<any>;
  /** AI draft from a plain PDF invoice -> EN 16931 / XRechnung (for review) (POST /einvoice/extract) */
  extractEinvoiceFromPdf(body?: string | Uint8Array | ArrayBuffer | Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Example JSON body for POST /einvoice/create (free) (GET /einvoice/sample) */
  einvoiceSample(params?: Params, options?: RequestOptions): Promise<any>;
  /** SANDBOX: verify buyer -> create -> validate -> route -> transmit (mock or partner Peppol sandbox) -> signed evidence receipt (POST /einvoice/send) */
  sendEinvoice(body: Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Safe send: check the buyer and the invoice before sending (VAT, Peppol, sanctions, EN 16931) -> ok / warn / block (POST /einvoice/preflight) */
  preflightEinvoice(body: string | Uint8Array | ArrayBuffer | Record<string, any>, params?: Params, options?: RequestOptions): Promise<any>;
  /** Public key (JWK) for verifying /einvoice/send evidence receipts (free) (GET /einvoice/evidence-key) */
  einvoiceEvidenceKey(params?: Params, options?: RequestOptions): Promise<any>;
  /** Aggregate e-invoice usage counts for the current UTC month (free; no PII) (GET /einvoice/usage) */
  einvoiceUsage(params?: Params, options?: RequestOptions): Promise<any>;
}
export declare class WSystem extends Operations {
  constructor(opts?: WSystemOptions);
  request(method: string, path: string, init?: RequestOptions & { query?: Record<string, unknown>; body?: unknown }): Promise<Json>;
  // 0.2 convenience signatures
  verifyVatBatch(vats: string[], opts?: { requester?: string }, options?: RequestOptions): Promise<Json>;
  verifyEoriBatch(eoris: string[], options?: RequestOptions): Promise<Json>;
  companySearch(q: string, opts?: { country?: string; limit?: number }, options?: RequestOptions): Promise<Json>;
  companyBatch(queries: unknown[], opts?: { limit?: number }, options?: RequestOptions): Promise<Json>;
  sanctionsScreen(name: string, opts?: Params, options?: RequestOptions): Promise<Json>;
  sanctionsScreenBatch(names: string[], opts?: { threshold?: number }, options?: RequestOptions): Promise<Json>;
  kybCheck(company: unknown, opts?: Record<string, unknown>, options?: RequestOptions): Promise<Json>;
  ddReport(company: unknown, opts?: Record<string, unknown>, options?: RequestOptions): Promise<Json>;
  einvoiceValidate(xml: string, opts?: { rules?: string; base64?: boolean }, options?: RequestOptions): Promise<Json>;
  einvoiceParse(xml: string, opts?: { base64?: boolean }, options?: RequestOptions): Promise<Json>;
  einvoiceCreate(invoice: Record<string, unknown>, options?: RequestOptions): Promise<Json>;
  usage(options?: RequestOptions): Promise<Json>;
  plans(options?: RequestOptions): Promise<Json>;
  /** Create a ZUGFeRD / Factur-X PDF; resolves to the PDF bytes. */
  einvoiceCreatePdf(invoice: Record<string, unknown>, options?: RequestOptions): Promise<Uint8Array>;
}
export declare function decodePdf(result: { pdf_base64?: string }): Uint8Array;
export default WSystem;
