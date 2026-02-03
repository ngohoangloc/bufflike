
import { createBrowserClient, isBrowser, parse, serialize } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth')

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch,
        },
        cookies: {
            getAll() {
                if (!isBrowser()) {
                    return data.session ? [
                        { name: 'sb-' + new URL(PUBLIC_SUPABASE_URL).hostname.split('.')[0] + '-auth-token', value: JSON.stringify(data.session) }
                    ] : []
                }
                const cookies = parse(document.cookie)
                return Object.keys(cookies).map(name => ({ name, value: cookies[name] }))
            },
            setAll(cookiesToSet) {
                if (!isBrowser()) return;

                cookiesToSet.forEach(({ name, value, options }) => {
                    document.cookie = serialize(name, value, options)
                })
            },
        },
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const {
        data: { user },
    } = await supabase.auth.getUser()


    return { supabase, session, user }
}
