import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export async function runStdioTransport(server: McpServer) {
    console.error('Starting MCP server with stdio transport...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP server running with stdio transport');
}