import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
    // Double check (meskipun sudah ada di hooks)
    if (!locals.user) {
        throw redirect(302, '/masuk');
    }

    return {
        user: locals.user
    };
};