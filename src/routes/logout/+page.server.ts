import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const actions = {
    default: async (event) => {
        const supabase = createSupabaseServerClient(event);
        await supabase.auth.signOut();
        throw redirect(303, '/login');
    }
};
