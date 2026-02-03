import { SMM_API_KEY } from '$env/static/private';

export class FiveGSMM {
    private apiUrl = 'https://5gsmm.com/api/v2';
    private apiKey: string;

    constructor() {
        this.apiKey = SMM_API_KEY;
        if (!this.apiKey) {
            console.warn('SMM_API_KEY is not set!');
        }
    }

    private async request(action: string, data: Record<string, any> = {}) {
        const params = new URLSearchParams();
        params.append('key', this.apiKey);
        params.append('action', action);

        for (const [key, value] of Object.entries(data)) {
            params.append(key, String(value));
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('5gsmm API Request Failed:', error);
            throw error;
        }
    }

    async getServices() {
        return this.request('services');
    }

    async getBalance() {
        return this.request('balance');
    }

    async addOrder(service: number | string, link: string, quantity: number, options: Record<string, any> = {}) {
        return this.request('add', {
            service,
            link,
            quantity,
            ...options
        });
    }

    async getOrderStatus(orderId: number) {
        return this.request('status', { order: orderId });
    }

    async getMultiStatus(orderIds: number[]) {
        return this.request('status', { orders: orderIds.join(',') });
    }
}
