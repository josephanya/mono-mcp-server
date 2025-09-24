import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'node:crypto';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

export async function runHttpTransport(server: McpServer, port: number) {
    console.error(`Starting MCP server (HTTP) on port ${port}`);
    const app = express();

    app.use(cors({
        origin: true,
        credentials: true,
        exposedHeaders: ['Mcp-Session-Id'],
        allowedHeaders: ['Content-Type', 'mcp-session-id'],
    }));
    app.use(express.json());

    app.get('/health', (req, res) => {
        res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    const transports: Record<string, StreamableHTTPServerTransport> = {};

    app.post('/mcp', async (req, res) => {
        try {
            const sessionId = req.headers['mcp-session-id'] as string | undefined;
            let transport: StreamableHTTPServerTransport;

            if (sessionId && transports[sessionId]) {
                transport = transports[sessionId];
            } else if (!sessionId && isInitializeRequest(req.body)) {
                transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => randomUUID(),
                    onsessioninitialized: (id) => { transports[id] = transport; },
                    enableDnsRebindingProtection: true,
                    allowedHosts: ['127.0.0.1', 'localhost'],
                });
                transport.onclose = () => { if (transport.sessionId) delete transports[transport.sessionId]; };
                await server.connect(transport);
            } else {
                res.status(400).json({ error: 'Bad Request: No valid session ID' });
                return;
            }
            await transport.handleRequest(req, res, req.body);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    const handleSession = async (req: Request, res: Response) => {
        const sessionId = req.headers['mcp-session-id'] as string;
        const transport = transports[sessionId];
        if (!sessionId || !transport) {
            res.status(400).send('Invalid or missing session ID');
            return;
        }
        await transport.handleRequest(req, res);
    };

    app.get('/mcp', handleSession);
    app.delete('/mcp', handleSession);

    const httpServer = app.listen(port, '0.0.0.0', () => {
        console.error(`MCP server running at http://0.0.0.0:${port}`);
    });

    process.on('SIGINT', () => {
        console.error('Shutting down server...');
        httpServer.close(() => process.exit(0));
    });

    return httpServer;
}
