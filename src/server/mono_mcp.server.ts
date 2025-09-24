import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runStdioTransport } from './transports/stdio';
import { runHttpTransport } from './transports/http';
import { setupHandlers } from './setup_handlers';

export class MonoMCPServer {
    private server: McpServer;

    constructor() {
        this.server = new McpServer({
            name: 'mono-mcp-server',
            version: '1.0.0',
            capabilities: {
                resources: {},
                tools: {}
            }
        });

        setupHandlers(this.server);
    }

    async runStdio() {
        return runStdioTransport(this.server);
    }

    async runHTTP(port: number) {
        return runHttpTransport(this.server, port);
    }
}
