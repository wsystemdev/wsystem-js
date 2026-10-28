# wsystem

Zero-dependency JavaScript/TypeScript client for the [W System API](https://wsystem.dev): EU VAT (VIES) and EORI validation, company-register lookup, sanctions screening, KYB, and EU e-invoicing (EN 16931 / XRechnung validation, UBL creation, Peppol routing).

Works in Node 18+, Deno, Bun, Cloudflare Workers and browsers (uses `fetch`). ESM and CommonJS. Types included.

```sh
npm install wsystem
```

## Quick start

```js
import { WSystem } from "wsystem";

const ws = new WSystem(); // no key: free tier, 20 calls/day per IP

const vat = await ws.verifyVat("BE0403170701");
console.log(vat.valid, vat.name);

// "Can I e-invoice this company?" VAT + Peppol directory + country mandate
const route = await ws.einvoiceRoute("BE0403170701");
console.log(route);
```

CommonJS:

```js
const WSystem = require("wsystem");
const ws = new WSystem({ apiKey: process.env.WSYSTEM_API_KEY });
```

## API key

- **No key**: 20 free calls/day per IP.
- **Free key**: 500 units/month, email only, no card: <https://api.wsystem.dev/account/free-key?ref=wsystem-js-github>
- **Plans**: Starter €19/month, Pro €49/month: <https://wsystem.dev/pricing>

Pass it as `new WSystem({ apiKey })` or set `WSYSTEM_API_KEY`. Check your quota with `await ws.usage()`.

## Methods

| Method | Endpoint |
|---|---|
| `verifyVat(vat, {requester?, nocache?, fallback?})` | `GET /verify` |
| `verifyVatBatch(vats[])` | `POST /verify/batch` (max 100) |
| `viesStatus()` | `GET /vies/status` (free) |
| `verifyEori(eori)` / `verifyEoriBatch(eoris[])` | `GET /eori`, `POST /eori/batch` |
| `companySearch(q, {country?, limit?})` / `companyBatch(queries[])` | `GET /company`, `POST /company/batch` |
| `sanctionsScreen(name, opts)` / `sanctionsScreenBatch(names[])` | EU, UN, OFAC, UK lists |
| `kybCheck(company)` | `POST /kyb/check`: VAT + registry + sanctions verdict |
| `ddReport(company, opts)` | `POST /ddreport` |
| `einvoiceRoute(id)` | `GET /einvoice/route`: VAT + Peppol + mandate |
| `einvoiceValidate(xml, {rules?, base64?})` | `POST /einvoice/validate` (UBL, CII, ZUGFeRD/Factur-X, XRechnung) |
| `einvoiceParse(xml, {base64?})` | `POST /einvoice/parse`: read an incoming XRechnung/ZUGFeRD/UBL/CII invoice as JSON (number, dates, seller, buyer, totals, IBAN, lines) |
| `einvoiceCreate(json)` / `einvoiceSample()` | `POST /einvoice/create`, `GET /einvoice/sample` |
| `frPaRegistry({name?, website?})` | France PA (Plateformes Agréées) list |
| `usage()` / `plans()` | account quota and plans |
| `request(method, path, {query, body})` | any other endpoint |

Errors throw `WSystemError` with `.status` and `.body`. HTTP 402 means the free tier is used up.

Full reference: [OpenAPI](https://api.wsystem.dev/openapi.json) · [Docs](https://wsystem.dev/docs) · Free tools: [Peppol ID lookup](https://wsystem.dev/peppol-id-lookup), [Bulk VAT checker](https://wsystem.dev/bulk-vat-checker), [E-invoice validator](https://wsystem.dev/e-invoice-validator)

## License

MIT
