import { json } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    const supabase = createSupabaseServerClient(event);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json(orders);
};
