import { json } from '@sveltejs/kit';
import { FiveGSMM } from '$lib/server/smm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const smm = new FiveGSMM();
        const balance = await smm.getBalance();
        return json(balance);
    } catch (error) {
        return json({ error: 'Failed to fetch balance' }, { status: 500 });
    }
};
