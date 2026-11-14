# ScamShield 🛡️ – Digital Scam & Phishing Detection System

**ScamShield** is an intelligent web application engineered to detect, analyze, and demystify potential cybersecurity threats—including phishing URLs, fraudulent SMS messages (smishing), deceptive emails, and social engineering communications.

---

## 🏗️ System Architecture & Roadmap

```
c:\deepakhack\
├── frontend/                     # React 18 + Vite + Tailwind CSS + Recharts
│   ├── src/
│   │   ├── components/           # UI, Gauge, Status badges, Recharts
│   │   ├── context/              # ScanContext (FastAPI connectivity + Local fallback)
│   │   ├── pages/                # Landing, Dashboard, URLScanner, MessageScanner, Results, History
│   │   └── utils/                # Client heuristics & defanging
│   └── package.json
│
└── backend/                      # Python + FastAPI REST Service
    ├── app/
    │   ├── api/v1/endpoints/     # /scan/url, /scan/message, /health, /history
    │   ├── core/                 # Config, PII masking, SSRF Guard, Rate Limiter
    │   ├── schemas/              # Pydantic v2 validation models
    │   └── services/             # URL lexical analyzer & Message NLP analyzer
    ├── tests/                    # 22 Comprehensive pytest unit & endpoint tests
    └── requirements.txt
```

---

## ⚡ Phase 2: Python FastAPI Backend (Delivered)

### Implemented Endpoints

| HTTP Method | Path | Description |
| :--- | :--- | :--- |
| **`GET`** | `/api/health` | Returns backend operational health, version, and active heuristic engines. |
| **`POST`** | `/api/scan/url` | Passive lexical and syntactic inspection of website URLs. |
| **`POST`** | `/api/scan/message` | Social engineering, urgency, OTP theft, and financial fraud message analysis. |
| **`GET`** | `/api/history` | Retrieves recent scan history logs with full diagnostic details. |
| **`GET`** | `/docs` | Interactive OpenAPI / Swagger UI documentation. |
| **`GET`** | `/redoc` | ReDoc API specifications. |

---

### URL Threat Inspection Engine

- **Strict Non-Execution Policy**: Never performs active HTTP connections, execution, or automated interaction with target websites.
- **SSRF Prevention**: Inspects destination hosts using Python `ipaddress` and strictly blocks loopback (`127.0.0.1`), RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud metadata (`169.254.169.254`).
- **Punycode & Homoglyph Detection**: Unmasks `xn--` Cyrillic and Greek lookalike character domains used to mimic brands.
- **Brand Impersonation**: Flags brand names in subdomains or non-official domain registrations (PayPal, Apple, Chase, Microsoft, Netflix, Amazon, etc.).
- **URL Shortener Detection**: Identifies services (`bit.ly`, `tinyurl.com`, `t.co`, etc.) commonly utilized to hide malicious hosts.
- **Deceptive Authority Tricks**: Detects embedded `@` symbols used to mask the true destination authority.
- **Shannon Entropy**: Measures character randomness to flag Domain Generation Algorithms (DGA).
- **HTTPS Truth in Security**: Explicitly informs users that **HTTPS does NOT guarantee a website is legitimate**, as modern phishing sites routinely obtain free TLS certificates.

---

### Message & Communications Threat Engine

- **Urgent & Coercive Phrasing**: Flags artificial deadlines ("immediate action required", "account locked within 24 hours").
- **Credential & OTP Theft**: Identifies solicitations for two-factor authentication codes (OTP), passwords, PINs, or SSNs.
- **Suspicious Payment & Non-Standard Transfers**: Detects demands for untraceable gift cards (Apple, Steam, Google Play), cryptocurrency, or wire transfers.
- **Fake Prize Notifications**: Flags 419 advance-fee fraud and lottery jackpot claims.
- **Brand & Authority Impersonation**: Detects impersonation of the IRS, FBI, Geek Squad, McAfee, Amazon Support, and banks.
- **Embedded Link Extraction**: Extracts hyperlinks embedded within message text and performs deep lexical analysis on each discovered link.

---

### Security & Privacy Controls

1. **PII Masking**: Credit card numbers, Social Security Numbers, phone numbers, and email addresses are automatically masked (`[REDACTED_CREDIT_CARD]`, `[REDACTED_SSN]`) before logging.
2. **Defanged Presentation**: All URLs are rendered safely (`hxxps://domain[.]com`) to eliminate accidental browser navigation.
3. **In-Memory Rate Limiting**: Enforces a sliding-window rate limit (default 60 requests/minute per client IP) returning HTTP 429 when exceeded.
4. **Security Headers**: Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 💻 Local Development Commands

### 1. Start the FastAPI Backend
From the root workspace directory:

```powershell
cd c:\deepakhack\backend
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```

- API Base: `http://localhost:8000`
- Swagger UI Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`

### 2. Run Backend Unit Tests
Execute the 22-test pytest suite:

```powershell
cd c:\deepakhack\backend
.venv\Scripts\python.exe -m pytest -v
```

### 3. Start the React Frontend
In a separate terminal:

```powershell
cd c:\deepakhack\frontend
npm run dev
```

The frontend will start at **`http://localhost:5173/`** and automatically link with the live FastAPI backend on port 8000 (with graceful fallback to client heuristics if the backend is offline).
