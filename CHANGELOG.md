# Changelog
## 0.3.0
- All 57 API operations, one method per OpenAPI `operationId` (platform, mandates, inbox, shop, KSeF, billing, e-invoice send/preflight/extract/check/sample, ...). `OPERATIONS` lists them. 0.2 method names still work.
- `einvoiceCreatePdf()` (ZUGFeRD / Factur-X PDF) and `decodePdf()`; credit notes via `type_code: "381"` with `preceding_invoice` and `preceding_invoice_date`; `einvoiceSample({ type })`.
- Per-call options: `requestId` (X-Request-Id), `idempotencyKey` (Idempotency-Key), `headers`, `timeoutMs`, `maxRetries`. Client options `maxRetries` (default 2), `headers`. Retries with backoff and Retry-After on network errors, 429, 502, 503, 504 (GET/PUT/DELETE; POST only with an idempotency key).
- Typed errors: `WSystemError` base with `status`, `body`, `code`, `docsUrl`, `requestId`; `BadRequestError`, `AuthenticationError`, `PaymentRequiredError`, `NotFoundError`, `ConflictError`, `RateLimitError`, `ServerError`, `WSystemConnectionError`, `WSystemTimeoutError`.
- Raw XML (string) and PDF (bytes) request bodies. Offline test suite (`npm test`).
## 0.2.0
- `einvoiceParse(xml, {base64?})`: POST /einvoice/parse reads incoming UBL, CII, XRechnung and ZUGFeRD/Factur-X (PDF as base64) invoices as normalized JSON.
## 0.1.1
- metadata refresh
## 0.1.0
- Initial release.
