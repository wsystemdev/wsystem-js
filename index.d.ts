export interface WSystemOptions {
  /** Monthly-plan or free key (X-API-Key). Defaults to process.env.WSYSTEM_API_KEY. Without a key: free tier (20 calls/day/IP). */
  apiKey?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
}
export declare class WSystemError extends Error {
  status: number;
  body: unknown;
}
type Json = any;
export declare class WSystem {
  constructor(opts?: WSystemOptions);
  request(method: "GET" | "POST", path: string, init?: { query?: Record<string, unknown>; body?: unknown }): Promise<Json>;
  verifyVat(vat: string, opts?: { requester?: string; nocache?: boolean; fallback?: boolean }): Promise<Json>;
  verifyVatBatch(vats: string[], opts?: { requester?: string }): Promise<Json>;
  viesStatus(): Promise<Json>;
  verifyEori(eori: string): Promise<Json>;
  verifyEoriBatch(eoris: string[]): Promise<Json>;
  companySearch(q: string, opts?: { country?: string; limit?: number }): Promise<Json>;
  companyBatch(queries: unknown[], opts?: { limit?: number }): Promise<Json>;
  sanctionsScreen(name: string, opts?: { threshold?: number; birth_year?: number; country?: string; lists?: string }): Promise<Json>;
  sanctionsScreenBatch(names: string[], opts?: { threshold?: number }): Promise<Json>;
  kybCheck(company: unknown, opts?: { requester?: string; threshold?: number }): Promise<Json>;
  ddReport(company: unknown, opts?: { country?: string; threshold?: number }): Promise<Json>;
  /** "Can I e-invoice this company?" VAT + Peppol + country mandate. id = VAT number or Peppol id. */
  einvoiceRoute(id: string, opts?: { requester?: string }): Promise<Json>;
  einvoiceValidate(xml: string, opts?: { rules?: string; base64?: boolean }): Promise<Json>;
  einvoiceCreate(invoice: Record<string, unknown>): Promise<Json>;
  einvoiceSample(): Promise<Json>;
  frPaRegistry(opts?: { name?: string; website?: string; limit?: number }): Promise<Json>;
  usage(): Promise<Json>;
  plans(): Promise<Json>;
}
export default WSystem;
