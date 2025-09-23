import { MonoMCPServer } from './server/mono_mcp.server';
import { handleGlobalErrors } from './utils/error.handler';
import dotenv from 'dotenv';

dotenv.config();

handleGlobalErrors();

if (!process.env.MONO_SECRET_KEY) {
    console.error(
        'MONO_SECRET_KEY is not set. Please set it in your environment or .env file.'
    );
    process.exit(1);
}

async function main() {
    const server = new MonoMCPServer();

    const args = process.argv.slice(2);
    const mode = args[0] || 'stdio';

    switch (mode) {
        case 'stdio':
            await server.runStdio();
            break;

        case 'http':
            const port = parseInt(args[1] || '3000', 10);
            await server.runHTTP(port);
            break;

        default:
            console.error('Usage: node index.js [stdio|http] [port]');
            process.exit(1);
    }
}

if (require.main === module) {
    main().catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}