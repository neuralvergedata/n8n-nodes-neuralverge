# n8n-nodes-neuralverge

This is an n8n community node. It lets you use [NeuralVerge](https://neuralverge.ai) in your n8n workflows.

NeuralVerge is a company and person business-intelligence API. It covers reverse email and phone lookup, email finding and verification, company funding data, LinkedIn and Amazon data, web search, AI extraction from any URL, and multi-step AI research.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-neuralverge`.

## Operations

The **NeuralVerge** node has 5 resources and 20 operations, one for each NeuralVerge API endpoint. It is marked `usableAsTool`, so AI Agent nodes can call it as a tool.

### Contact

| Operation | What it does | Cost |
|---|---|---|
| Find Email by Name | Find and verify a work email from first name, last name and company domain. | 10 points |
| Find Person by Email | Reverse email lookup: name, phones, location, company, position and social profiles. | 10 points |
| Find Person by Phone | Reverse phone lookup (global): name, emails, location, company and social profiles. | 10 points |
| Find Person by US Phone | US reverse phone lookup with carrier, line type and validity signals. | 100 points |
| Verify Email | Check whether an email address is deliverable (valid, risky or invalid). | 1 point |

### Company

| Operation | What it does | Cost |
|---|---|---|
| Get Company Funding | Get funding rounds, investors and firmographics from a Crunchbase organization URL. | 15 points |

### LinkedIn

| Operation | What it does | Cost |
|---|---|---|
| Find LinkedIn Profile by Name and Company | Find a LinkedIn profile URL from a full name and a company name or domain. | 10 points |
| Get LinkedIn Profile with Email | Get LinkedIn profile details plus a work email when available. | 10 points |
| List Company Employees | List employees of one or more LinkedIn companies, with optional filters. | 30 points per run + 5 points per profile |
| Search LinkedIn Companies | Search LinkedIn companies by keyword, size, industry and location. | 5 points per company |
| Search LinkedIn People | Search LinkedIn people by keyword, company, title, seniority, function and location. | 100 points per 25 results |

### Amazon

| Operation | What it does | Cost |
|---|---|---|
| Get Amazon Buy Box Offer | Get the current Buy Box offer and its seller for an ASIN. | 5 points per offer |
| Get Amazon Product | Get Amazon product details by ASIN: title, brand, price, rating, images, features and specs. | 5 points |
| Get Amazon Seller | Get an Amazon seller profile: name, rating, rating count, feedback and business details. | 5 points |
| List Amazon Seller Products | List the storefront products of an Amazon seller. | 1 point per product |
| Search Amazon Products | Search Amazon products by keyword on any supported marketplace. | 1 point per product |

### AI

| Operation | What it does | Cost |
|---|---|---|
| Extract Data from URL | Load any web page and extract structured data from it with AI. | 5 points |
| Get Research Status | Get the status and result of an AI research task by session ID. | free |
| Run AI Research | Run a multi-step AI web research task and return the report. | 20-400 points depending on depth |
| Search the Web | Search the web and get ranked results with title, URL and snippet. | 5 points |

Pricing: 1 point = $0.001. Every response includes `total_points`, the number of points actually charged.

## Credentials

1. Create a NeuralVerge account at [app.neuralverge.ai](https://app.neuralverge.ai).
2. Open **Settings → API** and copy an API key.
3. In n8n, create a **NeuralVerge API** credential and paste the key.

The node sends the key in the `x-api-key` header. `Authorization: Bearer` is not accepted by the API. When you save the credential, n8n tests it with one email verification call (`POST /functions/v1/run-email-validation`, 1 point). An invalid key returns `401 {"error":"Unauthorized"}`.

## Compatibility

Built with `@n8n/node-cli` 0.48 and `n8nNodesApiVersion` 1. Tested against `n8n-workflow` 2.x (n8n 1.x and 2.x). The node has no runtime dependencies.

## Usage

**Response shape.** Every operation returns the NeuralVerge envelope:

```json
{
  "session_id": "3c0992eb-e65d-43a3-828c-9b94488760b7",
  "kind": "email_validation",
  "email": "jane.doe@example.com",
  "human": "# Email validation\n\n- **Result:** valid",
  "machine": { "email": "jane.doe@example.com", "result": "valid", "isCatchAll": false, "provider": "GOOGLE", "confidence": "medium" },
  "total_points": 1
}
```

`human` is a Markdown summary. `machine` holds the structured data, or `null` when there is none.

**AI research is asynchronous.** *AI → Run AI Research* starts a task and then polls *Get Research Status* every 3 seconds until the status is `complete` or `failed`. It waits for up to *Options → Max Wait* seconds (540 by default). If the task is still running when that time runs out, you get the latest status with `timed_out: true`. Use *Get Research Status* with that `session_id` to fetch the result later. You can also turn off *Wait for Completion* to get the `session_id` back straight away.

**Structured extraction.** For *Extract Data from URL* and *Run AI Research*, you can pass a JSON Schema in *Output JSON Schema*. The result in `machine` then follows that schema.

**Lists.** Filter fields such as *Locations* or *Current Job Titles* take comma-separated values, for example `Amsterdam, Berlin`.

**Example workflow.** Start with a trigger that receives a lead with an email address. Add NeuralVerge *Contact → Verify Email*. Add an IF node on `machine.result = valid`. Then add NeuralVerge *Contact → Find Person by Email* and send the output to your CRM.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [NeuralVerge API documentation](https://docs.neuralverge.ai)
* [NeuralVerge website](https://neuralverge.ai)
* Support: dmitry@neuralverge.ai

## Version history

### 0.1.0

First release. Adds the NeuralVerge API credential and the NeuralVerge node with 20 operations. *Run AI Research* includes polling.
