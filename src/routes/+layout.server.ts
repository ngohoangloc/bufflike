
import { createSupabaseServerClient } from '$lib/server/supabase'

export const load = async (event) => {
    try {
        const supabase = createSupabaseServerClient(event)

        const {
            data: { session },
            error: sessionError
        } = await supabase.auth.getSession()

        if (sessionError) {
            console.error('Auth Session Error:', sessionError)
        }

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError) {
            // It's normal to have no user if not logged in, but logging just in case of weird errors
            // console.error('Auth User Error:', userError) 
        }

        return {
            session,
            user,
        }
    } catch (err) {
        console.error('Layout Load Error:', err)
        return {
            session: null,
            user: null
        }
    }
}
