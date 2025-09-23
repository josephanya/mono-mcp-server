import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Mono } from 'mono-node';

const secretKey: string = process.env.MONO_SECRET_KEY;

const monoClient = new Mono({ secretKey });

export function registerTools(server: McpServer) {
    server.registerTool(
        'get_wallet_balance',
        {
            title: 'Get Wallet Balance',
            description: 'This allows you to check the available balance in your Mono wallet',
            inputSchema: {},
        },
        async () => {
            try {
                const results = await monoClient.user.walletBalance();
                return {
                    content: [{ type: "text", text: results }]
                };
            } catch (error) {
                console.error(error);
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }]
                };
            }
        }
    );

    server.registerTool(
        'get_account_information',
        {
            title: 'Get Account Information',
            description: 'This returns the account details for a linked account',
            inputSchema: { accountId: z.string() },
        },
        async ({ accountId }) => {
            try {
                const results = await monoClient.account.getAccountInformation({ accountId });
                return {
                    content: [{ type: "text", text: results }]
                };
            } catch (error) {
                console.error(error);
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }]
                };
            }
        }
    );

    server.registerTool(
        'get_income_information',
        {
            title: 'Get Account Information',
            description: 'This returns income information for a linked account',
            inputSchema: { accountId: z.string() },
        },
        async ({ accountId }) => {
            try {
                const results = await monoClient.account.getIncome({ accountId });
                return {
                    content: [{ type: "text", text: results }]
                };
            } catch (error) {
                console.error(error);
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }]
                };
            }
        }
    );

    server.registerTool(
        'get_transaction_history',
        {
            title: 'Get Transaction History',
            description: 'This returns the transaction history for a linked account',
            inputSchema: {
                accountId: z.string(),
                startDate: z.string().optional().describe('The beginning date for transaction consideration eg. 01-10-2020'),
                endDate: z.string().optional().describe('The concluding date for transaction consideration, ensuring it comes after the provided start date. If start date is supplied, end date must also be supplied. eg. 07-10-2020'),
                type: z.enum(['debit', 'credit']).optional().describe('Filters transactions by debit or credit')
            },
        },
        async ({ accountId, startDate, endDate, type }) => {
            try {
                const results = await monoClient.account.getAccountTransactions({ accountId, start: startDate, end: endDate, type, paginate: false });
                return {
                    content: [{ type: "text", text: results }]
                };
            } catch (error) {
                console.error(error);
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }]
                };
            }
        }
    );
}
