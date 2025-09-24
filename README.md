# Mono MCP Server

The Mono Model Context Protocol (MCP) server enables AI assistants to easily interact with the Mono API. It is designed to support both local stdio transport and remote StreamableHTTP transport for flexible deployment options.

## Requirements
- Node.js 18+ (for native `fetch` and modern ESM support)
- npm v9+

## Install
```bash
npm install
```

## Configuration
Set your Mono Secret Key as an environment variable:
```bash
export MONO_SECRET_KEY="your_mono_secret_key"
```

## Run
The entrypoint is `src/index.ts`. You can run in development or after building:

### Development (auto-reload)
- Stdio (local):
```bash
npm run dev:stdio
```

- HTTP (remote):
```bash
npm run dev:http
```

Inspector (optional):
```bash
npm run dev:inspect
```

### Production (build then run)
```bash
npm run build
npm run start:stdio   # or
npm run start:http    # defaults to port 3000
```

Then visit the health endpoint at `http://0.0.0.0:3000/health` when running HTTP mode.

Notes:
- The app will exit early if `MONO_SECRET_KEY` is not set.

## HTTP Transport
When started in HTTP mode, the server exposes:
- `GET /health` – basic health check
- `POST /mcp` – client-to-server JSON-RPC (initialization and requests)
- `GET /mcp` – server-to-client notifications (requires `mcp-session-id` header)
- `DELETE /mcp` – session termination (requires `mcp-session-id` header)

Session header:
- `mcp-session-id`: Used to bind subsequent requests to the same session.

## Exposed Tools
Defined under `src/server/handlers/tools.ts` (tool identifiers in bold):

- **get_wallet_balance**
  - Returns available balance in your Mono wallet.

- **get_all_customers**
  - Inputs (optional): `phone?: string`, `email?: string`
  - Lists customers, supports filtering.

- **get_customer_transactions**
  - Inputs: `customerId: string`, `period: string`, `page: string`, `accountId?: string`
  - Returns transactions for a customer.

- **get_all_customer_linked_accounts**
  - Inputs: `name?: string`, `accountNumber?: string`
  - Lists linked accounts with filters.

- **get_account_details**
  - Inputs: `accountId: string`
  - Returns account details.

- **get_account_identity_info**
  - Inputs: `accountId: string`
  - Returns identity info for an account.

- **get_account_balance**
  - Inputs: `accountId: string`
  - Returns account balance.

- **get_transaction_history**
  - Inputs: `accountId: string`, `startDate?: string`, `endDate?: string`, `type?: 'debit' | 'credit'`, `narration?: string`
  - Returns transaction history (non-paginated by default).

- **get_account_credits**
  - Inputs: `accountId: string`
  - Returns grouped inflows for an account.

- **get_account_debits**
  - Inputs: `accountId: string`
  - Returns grouped outflows for an account.

## Using with Claude Desktop

You can connect this MCP server to Claude Desktop either via stdio (local) or HTTP (remote). Below are example configurations you can add to Claude Desktop's MCP settings.

### Stdio (local)
Run the server in stdio mode and let Claude communicate over stdio.

1) Ensure `MONO_SECRET_KEY` is set in your shell (or pass via `env`):
```bash
export MONO_SECRET_KEY="your_mono_secret_key"
```

2) Claude Desktop MCP config entry (JSON):
```json
{
  "mono-mcp-server": {
    "command": "node",
    "args": ["./dist/index.js", "stdio"],
    "env": {
      "MONO_SECRET_KEY": "${MONO_SECRET_KEY}"
    }
  }
}
```

If you prefer running directly from TypeScript in development, replace command/args with your dev runner, for example:
```json
{
  "mono-mcp-server": {
    "command": "npx",
    "args": ["tsx", "src/index.ts", "stdio"],
    "env": {
      "MONO_SECRET_KEY": "${MONO_SECRET_KEY}"
    }
  }
}
```

### HTTP (remote)
Run the server in HTTP mode and point Claude to the HTTP endpoint.

1) Start the server:
```bash
npm run dev:http
# or
npm run build && npm run start:http
```

2) Claude Desktop MCP config entry (JSON):
```json
{
  "mono-mcp-server-http": {
    "type": "http",
    "url": "http://127.0.0.1:3000/mcp",
    "headers": {
      "content-type": "application/json"
    }
  }
}
```

Notes:
- HTTP mode uses sessions. Claude will manage the `mcp-session-id` header automatically after initialization.
- Keep CORS and allowed hosts as configured in `src/server/transports/http.ts` (defaults allow `127.0.0.1` and `localhost`).

## Project Structure
```
src/
  index.ts                 # Entrypoint: parses args and starts stdio/http
  server/
    mono_mcp.server.ts     # Server wrapper
    setup_handlers.ts      # Registers tools/resources
    handlers/
      tools.ts             # Mono-backed tool implementations (see list above)
      resources.ts         # Resource handlers
    transports/
      http.ts              # Streamable HTTP transport wiring
      stdio.ts             # Stdio transport wiring
    client/
      mono_client.ts       # Minimal client around Mono HTTP API
  utils/
    error.handler.ts       # Global process error handling
```

## Environment
- `MONO_SECRET_KEY` (required): Your Mono Secret Key. The process exits if it is not set.

---

**Built with ❤️**