// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { adminUsers } from '$lib/server/database/schema';
import type { InferSelectModel } from 'drizzle-orm';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: InferSelectModel<typeof adminUsers> | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};