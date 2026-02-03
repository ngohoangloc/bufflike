import { json } from '@sveltejs/kit';
import { FiveGSMM } from '$lib/server/smm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const smm = new FiveGSMM();
        const services = await smm.getServices();
        return json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return json({ error: 'Failed to fetch services' }, { status: 500 });
    }
};
