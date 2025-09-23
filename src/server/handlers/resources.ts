import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources(server: McpServer) {
    server.registerResource(
        'config',
        'config://settings',
        {
            title: 'Server Settings',
            description: 'Current server configuration',
            mimeType: 'application/json',
        },
        async (uri) => ({
            contents: [{
                uri: uri.href,
                mimeType: 'application/json',
                text: JSON.stringify({
                    serverName: 'mono-mcp-server',
                    version: '1.0.0',
                    uptime: process.uptime(),
                    nodeVersion: process.version,
                    timestamp: new Date().toISOString(),
                }, null, 2),
            }],
        })
    );
}
