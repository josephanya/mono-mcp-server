import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './handlers/tools';
import { registerResources } from './handlers/resources';

export function setupHandlers(server: McpServer) {
    registerTools(server);
    registerResources(server);
}