import { json } from '@sveltejs/kit';
import { FiveGSMM } from '$lib/server/smm';
import { createSupabaseServerClient } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    const supabase = createSupabaseServerClient(event);

    // Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await event.request.json();
    const { service, link, quantity, service_name, charge } = body;

    // Validation
    if (!service || !link || !quantity) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const smm = new FiveGSMM();

        // 1. Call 5gsmm API
        const orderResponse = await smm.addOrder(service, link, quantity);

        if (!orderResponse || orderResponse.error) {
            return json({ error: orderResponse?.error || 'Failed to place order on SMM provider' }, { status: 400 });
        }

        const smmOrderId = orderResponse.order;

        // 2. Save to Supabase
        const { error: dbError } = await supabase
            .from('orders')
            .insert({
                user_id: session.user.id,
                smm_order_id: smmOrderId,
                service_id: service,
                service_name: service_name || 'Unknown Service',
                link: link,
                quantity: quantity,
                charge: charge || 0, // Should calculate from rate, but for now accept from client or 0
                status: 'Pending'
            });

        if (dbError) {
            console.error('Failed to save order to DB:', dbError);
            // We don't rollback the SMM order here (complex), just warn
            return json({
                success: true,
                order: smmOrderId,
                warning: 'Order placed but failed to save history'
            });
        }

        return json({ success: true, order: smmOrderId });

    } catch (error) {
        console.error('Order processing error:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
