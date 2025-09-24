import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { MonoClient } from '../client/mono_client';

const secretKey: string = process.env.MONO_SECRET_KEY;

const monoClient = new MonoClient(secretKey);

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
                const results = await monoClient.getWalletBalance();
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
        'get_all_customers',
        {
            title: 'Get All Customers',
            description: 'This retrieves a comprehensive list of all customers registered within your application ecosystem. It provides an overview of your customer base, facilitating efficient management and analysis',
            inputSchema: {
                phone: z.string().optional().describe('This field allow you to filter by the customers phone number eg. 08011223366'),
                email: z.string().optional().describe('This field allow you to filter by the customers email')
            },
        },
        async ({ phone, email }) => {
            try {
                const results = await monoClient.getAllCustomers(phone, email);
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
        'get_customer_transactions',
        {
            title: 'Get Customer Transactions',
            description: 'This retrieves the transaction details associated with a specific customer. By specifying the customer ID, you can retrieve information such as transaction amounts, dates, and descriptions',
            inputSchema: {
                customerId: z.string().describe('This field expects the customers id'),
                period: z.string().describe('This field expects the time range eg. last12months'),
                page: z.string(),
                accountId: z.string().optional().describe('This field expects an account id')
            },
        },
        async ({ customerId, period, page, accountId }) => {
            try {
                const results = await monoClient.getAllCustomerTransactions(customerId, period, page, accountId);
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
        'get_all_customer_linked_accounts',
        {
            title: 'Get All Customer Linked Accounts',
            description: 'This retrieves a list of all linked accounts associated with a specific customer, enabling enhanced financial management and analysis',
            inputSchema: {
                name: z.string().optional().describe('This field expects the account name'),
                accountNumber: z.string().optional().describe('This field expects the customers account number')
            },
        },
        async ({ name, accountNumber }) => {
            try {
                const results = await monoClient.getAllCustomerLinkedAccounts(name, accountNumber);
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
        'get_account_details',
        {
            title: 'Get Account Details',
            description: 'This retrieves the account details for a specific linked account',
            inputSchema: { accountId: z.string().describe('This field expects the account id for a linked account') },
        },
        async ({ accountId }) => {
            try {
                const results = await monoClient.getAccountDetails(accountId);
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
        'get_account_identity_info',
        {
            title: 'Get Account Identity Information',
            description: 'This retrieves the identity information for a specific linked account',
            inputSchema: { accountId: z.string().describe('This field expects the account id for a linked account') },
        },
        async ({ accountId }) => {
            try {
                const results = await monoClient.getAccountIdentityInfo(accountId);
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
        'get_account_balance',
        {
            title: 'Get Account Balance',
            description: 'This retrieves the account balance for a specific linked account',
            inputSchema: { accountId: z.string().describe('This field expects the account id for a linked account') },
        },
        async ({ accountId }) => {
            try {
                const results = await monoClient.getAccountBalance(accountId);
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
            description: 'This retrieves the transaction history for a specific linked account',
            inputSchema: {
                accountId: z.string().describe('This field expects the account id for a linked account'),
                startDate: z.string().optional().describe('The beginning date for transaction consideration eg. 01-10-2020'),
                endDate: z.string().optional().describe('The concluding date for transaction consideration, ensuring it comes after the provided start date. If start date is supplied, end date must also be supplied. eg. 07-10-2020'),
                type: z.enum(['debit', 'credit']).optional().describe('Filters transactions by debit or credit'),
                narration: z.string().optional().describe('Filters all transactions by narration e.g Uber transactions'),
            },
        },
        async ({ accountId, startDate, endDate, type, narration }) => {
            try {
                const results = await monoClient.getAccountTransactions(accountId, { start: startDate, end: endDate, type, narration, paginate: 'false' });
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
        'get_account_credits',
        {
            title: 'Get Account Credits',
            description: 'This retrieves all the inflow into a specific linked account grouped by month',
            inputSchema: { accountId: z.string().describe('This field expects the account id for a linked account') },
        },
        async ({ accountId }) => {
            try {
                const results = await monoClient.getAccountCredits(accountId);
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
        'get_account_debits',
        {
            title: 'Get Account Debits',
            description: 'This retrieves all the outflow from a specific linked account grouped by month',
            inputSchema: { accountId: z.string().describe('This field expects the account id for a linked account') },
        },
        async ({ accountId }) => {
            try {
                const results = await monoClient.getAccountDebits(accountId);
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
