import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error, event }) => {
    console.error('SERVER ERROR:', error);

    // Log error to file for agent reading
    try {
        const fs = await import('node:fs');
        const errString = error instanceof Error ? error.stack || error.message : JSON.stringify(error);
        fs.writeFileSync('error.txt', `URL: ${event.url.toString()}\nERROR: ${errString}\nTIME: ${new Date().toISOString()}\n\n`);
    } catch (e) {
        console.error('Failed to log error to file', e);
    }

    return {
        message: 'Internal Server Error',
        code: 'UNKNOWN'
    };
};
