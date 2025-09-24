interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
}

export class MonoClient {
    private baseUrl: string;
    private headers: Record<string, string>;

    constructor(secretKey: string, baseUrl: string = "https://api.withmono.com") {
        this.baseUrl = baseUrl;
        this.headers = {
            "mono-sec-key": secretKey,
            "accept": "application/json",
            "content-type": "application/json",
            "User-Agent": "Mono-Banking-MCP/1.0",
        };
    }

    private request = async (path: string, options: RequestOptions = {}): Promise<any> => {
        const { method = 'GET', body } = options;
        const fetchOptions: any = {
            method,
            headers: this.headers,
        };
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            fetchOptions.body = JSON.stringify(body);
        }
        const response = await fetch(`${this.baseUrl}${path}`, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return JSON.stringify(result, null, 2)
    }

    getWalletBalance = async () => {
        return this.request(`users/stats/wallet`);
    }

    getAllCustomers = async (phone?: string, email?: string) => {
        const params = new URLSearchParams();
        params.append("page", '1');
        if (phone) params.append("phone", phone);
        if (email) params.append("email", email);
        const endpoint = params.toString()
            ? `v2/customers?${params.toString()}`
            : `v2/customers`;
        return this.request(endpoint);
    }

    getAllCustomerTransactions = async (customerId: string, period: string, page: string, accountId?: string) => {
        const params = new URLSearchParams();
        params.append("period", period);
        params.append("page", page);
        if (accountId) params.append("account", accountId);
        const endpoint = params.toString()
            ? `v2/customers/${customerId}/transactions?${params.toString()}`
            : `v2/customers/${customerId}/transactions`;
        return this.request(endpoint);
    }

    getAllCustomerLinkedAccounts = async (name?: string, accountNumber?: string) => {
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (accountNumber) params.append("account_number", accountNumber);
        const endpoint = params.toString()
            ? `/v2/accounts?${params.toString()}`
            : `/v2/accounts`;
        return this.request(endpoint);
    }

    getAccountDetails = async (accountId: string) => {
        return this.request(`/v2/accounts/${accountId}`);
    }

    getAccountIdentityInfo = async (accountId: string) => {
        return this.request(`/v2/accounts/${accountId}/identity`);
    }

    getAccountBalance = async (accountId: string) => {
        return this.request(`/v2/accounts/${accountId}/balance`);
    }

    getAccountTransactions = async (accountId: string, options?: { type?: string; start?: string; end?: string; narration?: string; paginate?: string; }) => {
        const params = new URLSearchParams();
        if (options?.type) params.append("type", options.type);
        if (options?.narration) params.append("narration", options.narration);
        if (options?.start) params.append("start", options.start);
        if (options?.end) params.append("end", options.end);
        if (options?.paginate) params.append("paginate", options.paginate);
        const endpoint = params.toString()
            ? `v2/accounts/${accountId}/transactions?${params.toString()}`
            : `v2/accounts/${accountId}/transactions`;
        return this.request(endpoint);
    }

    getAccountCredits = async (accountId: string) => {
        return this.request(`v2/accounts/${accountId}/credits}`);
    }

    getAccountDebits = async (accountId: string) => {
        return this.request(`v2/accounts/${accountId}/debits}`);
    }

    lookupACompany = async (search: string) => {
        return this.request(`v3/lookup/cac?search=${search}`);
    }

    getCompanyShareholders = async (cacId: string) => {
        return this.request(`/v3/lookup/cac/company/${cacId}`);
    }

    getCompanyProfile = async (rcNumber: string) => {
        return this.request(`/v3/lookup/cac/profile/${rcNumber}`);
    }

    getCompanySecretary = async (cacId: string) => {
        return this.request(`/v3/lookup/cac/company/${cacId}/directors`);
    }

    getCompanyDirectors = async (cacId: string) => {
        return this.request(`/v3/lookup/cac/company/${cacId}/directors`);
    }

    verifyAddress = async (meterNumber: string, address: string) => {
        return this.request(`/v3/lookup/address`, {
            method: 'POST',
            body: {
                meter_number: meterNumber,
                address
            }
        });
    }

    verifyInternationalPassport = async (passportNumber: string, lastName: string, dob: string) => {
        return this.request(`/v3/lookup/passport`, {
            method: 'POST',
            body: {
                passport_number: passportNumber,
                last_name: lastName,
                date_of_birth: dob
            }
        });
    }

    verifyTIN = async (number: string, channel: string) => {
        return this.request(`/v3/lookup/tin`, {
            method: 'POST',
            body: { number, channel }
        });
    }

    verifyNIN = async (nin: string) => {
        return this.request(`/v3/lookup/nin`, {
            method: 'POST',
            body: { nin }
        });
    }

    verifyDriversLicense = async (licenseNumber: string, dob: string, firstName: string, lastName: string) => {
        return this.request(`/v3/lookup/driver_license`, {
            method: 'POST',
            body: {
                license_number: licenseNumber,
                date_of_birth: dob,
                first_name: firstName,
                last_name: lastName
            }
        });
    }

    getCreditHistory = async (provider: string, bvn: string) => {
        return this.request(`/v3/lookup/credit-history/${provider}`, {
            method: 'POST',
            body: { bvn }
        });
    }
}