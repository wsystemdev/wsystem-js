// Generated from the W System OpenAPI 0.3.128 by growth/sdk/gen.py. Do not edit by hand.
const enc = (v) => encodeURIComponent(String(v));
export const OPERATIONS = [
  ["billingPlans", "GET", "/billing/plans"],
  ["billingUsage", "GET", "/billing/usage"],
  ["billingCheckout", "POST", "/billing/checkout"],
  ["einvoiceMandateTerms", "GET", "/einvoice/mandate-terms"],
  ["createPeppolMandate", "POST", "/einvoice/mandates"],
  ["getPeppolMandate", "GET", "/einvoice/mandates/{mid}"],
  ["revokePeppolMandate", "POST", "/einvoice/mandates/{mid}/revoke"],
  ["einvoiceInbox", "GET", "/einvoice/inbox"],
  ["einvoiceInboxUbl", "GET", "/einvoice/inbox/{document_id}/ubl"],
  ["einvoiceLiveStatus", "GET", "/einvoice/live/{document_id}"],
  ["listPlatformCompanies", "GET", "/platform/companies"],
  ["getPlatformCompany", "GET", "/platform/companies/{mandate_id}"],
  ["setPlatformWebhook", "POST", "/platform/webhook"],
  ["getPlatformWebhook", "GET", "/platform/webhook"],
  ["deletePlatformWebhook", "DELETE", "/platform/webhook"],
  ["testPlatformWebhook", "POST", "/platform/webhook/test"],
  ["getPlatformUsage", "GET", "/platform/usage"],
  ["setPlatformSpendCap", "PUT", "/platform/spend-cap"],
  ["checkReceivedInvoice", "POST", "/einvoice/check"],
  ["listInboxInvoices", "GET", "/inbox/invoices"],
  ["getInboxInvoice", "GET", "/inbox/invoices/{iid}"],
  ["deleteInboxInvoice", "DELETE", "/inbox/invoices/{iid}"],
  ["getInboxAddress", "GET", "/inbox/address"],
  ["rotateInboxAddress", "POST", "/inbox/address/rotate"],
  ["ksefInfo", "GET", "/einvoice/ksef"],
  ["ksefConnect", "POST", "/einvoice/ksef/connections"],
  ["ksefConnections", "GET", "/einvoice/ksef/connections"],
  ["ksefTestCompany", "POST", "/einvoice/ksef/test-company"],
  ["ksefAuthChallenge", "POST", "/einvoice/ksef/auth/challenge"],
  ["ksefAuthComplete", "POST", "/einvoice/ksef/auth/complete"],
  ["ksefDisconnect", "DELETE", "/einvoice/ksef/connections/{cid}"],
  ["ksefInvoiceStatus", "GET", "/einvoice/ksef/invoices/{sid}"],
  ["ksefInvoiceUpo", "GET", "/einvoice/ksef/invoices/{sid}/upo"],
  ["ksefInvoices", "GET", "/einvoice/ksef/invoices"],
  ["health", "GET", "/health"],
  ["viesStatus", "GET", "/vies/status"],
  ["verifyVat", "GET", "/verify"],
  ["verifyVatBatch", "POST", "/verify/batch"],
  ["lookupCompany", "GET", "/company"],
  ["lookupCompanyBatch", "POST", "/company/batch"],
  ["screenSanctions", "GET", "/sanctions/screen"],
  ["screenSanctionsBatch", "POST", "/sanctions/screen/batch"],
  ["kybCheck", "POST", "/kyb/check"],
  ["verifyEori", "GET", "/eori"],
  ["verifyEoriBatch", "POST", "/eori/batch"],
  ["validateEinvoice", "POST", "/einvoice/validate"],
  ["parseEinvoice", "POST", "/einvoice/parse"],
  ["createEinvoice", "POST", "/einvoice/create"],
  ["einvoiceRoute", "GET", "/einvoice/route"],
  ["ddReport", "POST", "/ddreport"],
  ["frPaRegistry", "GET", "/fr/pa-registry"],
  ["extractEinvoiceFromPdf", "POST", "/einvoice/extract"],
  ["einvoiceSample", "GET", "/einvoice/sample"],
  ["sendEinvoice", "POST", "/einvoice/send"],
  ["preflightEinvoice", "POST", "/einvoice/preflight"],
  ["einvoiceEvidenceKey", "GET", "/einvoice/evidence-key"],
  ["einvoiceUsage", "GET", "/einvoice/usage"],
];

export class Operations {
  /** Monthly API-key plans  (GET /billing/plans) */
  billingPlans(params = {}, options = {}) { return this.request("GET", `/billing/plans`, { query: { ...params }, ...options }); }
  /** Your API key's plan, monthly quota, units used, and paid x402 calls attributed to this key (free; no units consumed)  (GET /billing/usage) */
  billingUsage(params = {}, options = {}) { return this.request("GET", `/billing/usage`, { query: { ...params }, ...options }); }
  /** Start Stripe Checkout for a monthly plan  (POST /billing/checkout) */
  billingCheckout(body, params = {}, options = {}) { return this.request("POST", `/billing/checkout`, { query: { ...params }, body, ...options }); }
  /** Get the Peppol mandate terms to show the signer  (GET /einvoice/mandate-terms) */
  einvoiceMandateTerms(params = {}, options = {}) { return this.request("GET", `/einvoice/mandate-terms`, { query: { ...params }, ...options }); }
  /** Record a company's Peppol mandate (click-through acceptance)  (POST /einvoice/mandates) */
  createPeppolMandate(body, params = {}, options = {}) { return this.request("POST", `/einvoice/mandates`, { query: { ...params }, body, ...options }); }
  /** Get one of your Peppol mandate records  (GET /einvoice/mandates/{mid}) */
  getPeppolMandate(mid, params = {}, options = {}) { return this.request("GET", `/einvoice/mandates/${enc(mid)}`, { query: { ...params }, ...options }); }
  /** Revoke a Peppol mandate  (POST /einvoice/mandates/{mid}/revoke) */
  revokePeppolMandate(mid, params = {}, options = {}) { return this.request("POST", `/einvoice/mandates/${enc(mid)}/revoke`, { query: { ...params }, ...options }); }
  /** LIVE: documents received over Peppol for your mandated companies (X-API-Key)  (GET /einvoice/inbox) */
  einvoiceInbox(params = {}, options = {}) { return this.request("GET", `/einvoice/inbox`, { query: { ...params }, ...options }); }
  /** LIVE: signed download link for a received document's original UBL (valid 1 hour)  (GET /einvoice/inbox/{document_id}/ubl) */
  einvoiceInboxUbl(documentId, params = {}, options = {}) { return this.request("GET", `/einvoice/inbox/${enc(documentId)}/ubl`, { query: { ...params }, ...options }); }
  /** LIVE: delivery state of a document you sent with mode=live (TRANSIT -> SENT, or FAILED = not charged)  (GET /einvoice/live/{document_id}) */
  einvoiceLiveStatus(documentId, params = {}, options = {}) { return this.request("GET", `/einvoice/live/${enc(documentId)}`, { query: { ...params }, ...options }); }
  /** List the client companies under your key: onboarding stage, live readiness and per-company live document counts  (GET /platform/companies) */
  listPlatformCompanies(params = {}, options = {}) { return this.request("GET", `/platform/companies`, { query: { ...params }, ...options }); }
  /** One client company under your key: onboarding stage, next step and live document counts  (GET /platform/companies/{mandate_id}) */
  getPlatformCompany(mandateId, params = {}, options = {}) { return this.request("GET", `/platform/companies/${enc(mandateId)}`, { query: { ...params }, ...options }); }
  /** Set or replace your webhook URL for company.stage_changed (signing secret returned once)  (POST /platform/webhook) */
  setPlatformWebhook(body, params = {}, options = {}) { return this.request("POST", `/platform/webhook`, { query: { ...params }, body, ...options }); }
  /** Your webhook URL and its recent deliveries (the secret is never shown again)  (GET /platform/webhook) */
  getPlatformWebhook(params = {}, options = {}) { return this.request("GET", `/platform/webhook`, { query: { ...params }, ...options }); }
  /** Remove your webhook  (DELETE /platform/webhook) */
  deletePlatformWebhook(params = {}, options = {}) { return this.request("DELETE", `/platform/webhook`, { query: { ...params }, ...options }); }
  /** Send a signed webhook.test event to your URL now and return the delivery result  (POST /platform/webhook/test) */
  testPlatformWebhook(params = {}, options = {}) { return this.request("POST", `/platform/webhook/test`, { query: { ...params }, ...options }); }
  /** Platform plan: this month's checked documents, Peppol documents, active companies and cost estimate (free)  (GET /platform/usage) */
  getPlatformUsage(params = {}, options = {}) { return this.request("GET", `/platform/usage`, { query: { ...params }, ...options }); }
  /** Platform plan: set or remove an optional monthly spend cap in EUR (calls that would exceed it get 429, nothing charged)  (PUT /platform/spend-cap) */
  setPlatformSpendCap(body, params = {}, options = {}) { return this.request("PUT", `/platform/spend-cap`, { query: { ...params }, body, ...options }); }
  /** Check a received invoice before paying it: e-invoice rules, supplier VAT + sanctions, amounts, IBAN, duplicates, bank-detail changes -> ok / review / hold  (POST /einvoice/check) */
  checkReceivedInvoice(body, params = {}, options = {}) { return this.request("POST", `/einvoice/check`, { query: { ...params }, body, ...options }); }
  /** Your checked received invoices, newest first (free)  (GET /inbox/invoices) */
  listInboxInvoices(params = {}, options = {}) { return this.request("GET", `/inbox/invoices`, { query: { ...params }, ...options }); }
  /** One checked invoice with its full check result (free)  (GET /inbox/invoices/{iid}) */
  getInboxInvoice(iid, params = {}, options = {}) { return this.request("GET", `/inbox/invoices/${enc(iid)}`, { query: { ...params }, ...options }); }
  /** Delete one invoice from your inbox history (free)  (DELETE /inbox/invoices/{iid}) */
  deleteInboxInvoice(iid, params = {}, options = {}) { return this.request("DELETE", `/inbox/invoices/${enc(iid)}`, { query: { ...params }, ...options }); }
  /** Your own email intake address: forward supplier invoices there (free)  (GET /inbox/address) */
  getInboxAddress(params = {}, options = {}) { return this.request("GET", `/inbox/address`, { query: { ...params }, ...options }); }
  /** Issue a new intake address; the old one stops working (free)  (POST /inbox/address/rotate) */
  rotateInboxAddress(params = {}, options = {}) { return this.request("POST", `/inbox/address/rotate`, { query: { ...params }, ...options }); }
  /** Poland KSeF connector: what works, environment, how to connect (free)  (GET /einvoice/ksef) */
  ksefInfo(params = {}, options = {}) { return this.request("GET", `/einvoice/ksef`, { query: { ...params }, ...options }); }
  /** Connect a company's KSeF account (TEST, or DEMO if enabled): store its KSeF token encrypted after a sign-in check  (POST /einvoice/ksef/connections) */
  ksefConnect(body, params = {}, options = {}) { return this.request("POST", `/einvoice/ksef/connections`, { query: { ...params }, body, ...options }); }
  /** List the KSeF connections (companies) under your API key  (GET /einvoice/ksef/connections) */
  ksefConnections(params = {}, options = {}) { return this.request("GET", `/einvoice/ksef/connections`, { query: { ...params }, ...options }); }
  /** Create a fictitious company in KSeF TEST (random NIP) and connect it, to try KSeF sending end to end  (POST /einvoice/ksef/test-company) */
  ksefTestCompany(body, params = {}, options = {}) { return this.request("POST", `/einvoice/ksef/test-company`, { query: { ...params }, body, ...options }); }
  /** Start certificate sign-in: get a KSeF challenge and the unsigned AuthTokenRequest XML to sign externally  (POST /einvoice/ksef/auth/challenge) */
  ksefAuthChallenge(body, params = {}, options = {}) { return this.request("POST", `/einvoice/ksef/auth/challenge`, { query: { ...params }, body, ...options }); }
  /** Finish certificate sign-in: accept the signed AuthTokenRequest, enroll a KSeF Authentication certificate, store it encrypted  (POST /einvoice/ksef/auth/complete) */
  ksefAuthComplete(body, params = {}, options = {}) { return this.request("POST", `/einvoice/ksef/auth/complete`, { query: { ...params }, body, ...options }); }
  /** Revoke a KSeF connection: the stored KSeF token is deleted at once  (DELETE /einvoice/ksef/connections/{cid}) */
  ksefDisconnect(cid, params = {}, options = {}) { return this.request("DELETE", `/einvoice/ksef/connections/${enc(cid)}`, { query: { ...params }, ...options }); }
  /** KSeF status of a sent invoice: processing / accepted (KSeF number) / rejected (code and reason) (free)  (GET /einvoice/ksef/invoices/{sid}) */
  ksefInvoiceStatus(sid, params = {}, options = {}) { return this.request("GET", `/einvoice/ksef/invoices/${enc(sid)}`, { query: { ...params }, ...options }); }
  /** UPO (official KSeF receipt, XML signed by the Ministry of Finance) of an accepted invoice (free)  (GET /einvoice/ksef/invoices/{sid}/upo) */
  ksefInvoiceUpo(sid, params = {}, options = {}) { return this.request("GET", `/einvoice/ksef/invoices/${enc(sid)}/upo`, { query: { ...params }, ...options }); }
  /** List invoices sent to KSeF under your API key (newest first, free)  (GET /einvoice/ksef/invoices) */
  ksefInvoices(params = {}, options = {}) { return this.request("GET", `/einvoice/ksef/invoices`, { query: { ...params }, ...options }); }
  /** Liveness check  (GET /health) */
  health(params = {}, options = {}) { return this.request("GET", `/health`, { query: { ...params }, ...options }); }
  /** VIES availability per member state (free, cached 5 min)  (GET /vies/status) */
  viesStatus(params = {}, options = {}) { return this.request("GET", `/vies/status`, { query: { ...params }, ...options }); }
  /** Validate one EU VAT number (VIES)  (GET /verify) */
  verifyVat(vat, params = {}, options = {}) { return this.request("GET", `/verify`, { query: { "vat": vat, ...params }, ...options }); }
  /** Validate up to 100 EU VAT numbers  (POST /verify/batch) */
  verifyVatBatch(body, params = {}, options = {}) { return this.request("POST", `/verify/batch`, { query: { ...params }, body, ...options }); }
  /** Look up a company in official EU business registers  (GET /company) */
  lookupCompany(q, params = {}, options = {}) { return this.request("GET", `/company`, { query: { "q": q, ...params }, ...options }); }
  /** Batch company-registry lookup (max 25 queries)  (POST /company/batch) */
  lookupCompanyBatch(body, params = {}, options = {}) { return this.request("POST", `/company/batch`, { query: { ...params }, body, ...options }); }
  /** Screen a name against EU, UN, OFAC and UK sanctions lists  (GET /sanctions/screen) */
  screenSanctions(name, params = {}, options = {}) { return this.request("GET", `/sanctions/screen`, { query: { "name": name, ...params }, ...options }); }
  /** Batch sanctions screening (max 50 names)  (POST /sanctions/screen/batch) */
  screenSanctionsBatch(body, params = {}, options = {}) { return this.request("POST", `/sanctions/screen/batch`, { query: { ...params }, body, ...options }); }
  /** One-call KYB: VAT + registry + sanctions -> verdict  (POST /kyb/check) */
  kybCheck(body, params = {}, options = {}) { return this.request("POST", `/kyb/check`, { query: { ...params }, body, ...options }); }
  /** Validate one EU EORI number (EC EOS)  (GET /eori) */
  verifyEori(eori, params = {}, options = {}) { return this.request("GET", `/eori`, { query: { "eori": eori, ...params }, ...options }); }
  /** Validate up to 100 EU EORI numbers  (POST /eori/batch) */
  verifyEoriBatch(body, params = {}, options = {}) { return this.request("POST", `/eori/batch`, { query: { ...params }, body, ...options }); }
  /** Validate an EU e-invoice (EN 16931, XRechnung; UBL, CII, ZUGFeRD/Factur-X PDF)  (POST /einvoice/validate) */
  validateEinvoice(body, params = {}, options = {}) { return this.request("POST", `/einvoice/validate`, { query: { ...params }, body, ...options }); }
  /** Read an incoming EU e-invoice (UBL, CII, ZUGFeRD/Factur-X PDF) into JSON  (POST /einvoice/parse) */
  parseEinvoice(body, params = {}, options = {}) { return this.request("POST", `/einvoice/parse`, { query: { ...params }, body, ...options }); }
  /** Create a valid EU e-invoice (UBL 2.1, CII, ZUGFeRD/Factur-X PDF) from simple JSON  (POST /einvoice/create) */
  createEinvoice(body, params = {}, options = {}) { return this.request("POST", `/einvoice/create`, { query: { ...params }, body, ...options }); }
  /** "Can I e-invoice this company?" VAT + Peppol + country mandate lookup  (GET /einvoice/route) */
  einvoiceRoute(id, params = {}, options = {}) { return this.request("GET", `/einvoice/route`, { query: { "id": id, ...params }, ...options }); }
  /** Counterparty due-diligence report (VAT, register, sanctions, EORI, LEI, Peppol) with risk flags  (POST /ddreport) */
  ddReport(body, params = {}, options = {}) { return this.request("POST", `/ddreport`, { query: { ...params }, body, ...options }); }
  /** Is this platform on France's official list of Plateformes Agréées (PA)? (free)  (GET /fr/pa-registry) */
  frPaRegistry(params = {}, options = {}) { return this.request("GET", `/fr/pa-registry`, { query: { ...params }, ...options }); }
  /** AI draft from a plain PDF invoice -> EN 16931 / XRechnung (for review)  (POST /einvoice/extract) */
  extractEinvoiceFromPdf(body, params = {}, options = {}) { return this.request("POST", `/einvoice/extract`, { query: { ...params }, body, ...options }); }
  /** Example JSON body for POST /einvoice/create (free)  (GET /einvoice/sample) */
  einvoiceSample(params = {}, options = {}) { return this.request("GET", `/einvoice/sample`, { query: { ...params }, ...options }); }
  /** SANDBOX: verify buyer -> create -> validate -> route -> transmit (mock or partner Peppol sandbox) -> signed evidence receipt  (POST /einvoice/send) */
  sendEinvoice(body, params = {}, options = {}) { return this.request("POST", `/einvoice/send`, { query: { ...params }, body, ...options }); }
  /** Safe send: check the buyer and the invoice before sending (VAT, Peppol, sanctions, EN 16931) -> ok / warn / block  (POST /einvoice/preflight) */
  preflightEinvoice(body, params = {}, options = {}) { return this.request("POST", `/einvoice/preflight`, { query: { ...params }, body, ...options }); }
  /** Public key (JWK) for verifying /einvoice/send evidence receipts (free)  (GET /einvoice/evidence-key) */
  einvoiceEvidenceKey(params = {}, options = {}) { return this.request("GET", `/einvoice/evidence-key`, { query: { ...params }, ...options }); }
  /** Aggregate e-invoice usage counts for the current UTC month (free; no PII)  (GET /einvoice/usage) */
  einvoiceUsage(params = {}, options = {}) { return this.request("GET", `/einvoice/usage`, { query: { ...params }, ...options }); }
}
