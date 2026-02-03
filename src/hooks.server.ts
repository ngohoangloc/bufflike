import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, event }) => {
    console.error('SERVER ERROR:', error);
    console.error('URL:', event.url.toString());

    return {
        message: 'Internal Server Error',
        code: 'UNKNOWN'
    };
};
