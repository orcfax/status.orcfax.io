import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/public';

export const handle = async ({ event, resolve }) => {
	const url = env.PUBLIC_DB_HOST;
	event.locals.pb = new PocketBase(url);
	event.locals.pb.autoCancellation(false);
	const response = await resolve(event);
	return response;
};
