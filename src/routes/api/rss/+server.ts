import { z } from 'zod';
import PocketBase from 'pocketbase';
import type { RequestHandler } from '@sveltejs/kit';
import { type RSSFeedItem, RSSFeedItemSchema } from '$lib/types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const include = url.searchParams.get('include');

	const items = await getRSSFeedItems(locals.pb, include ?? undefined);

	return new Response(JSON.stringify(items), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

async function getRSSFeedItems(
	db: PocketBase,
	include: string | undefined
): Promise<RSSFeedItem[]> {
	const includeBlogPosts = include?.includes('blog_posts');

	const records = await db.collection('rss').getFullList();
	const parsedItems = z.array(RSSFeedItemSchema).parse(records);

	// Filter for default types (network_updates and incident_reports)
	const defaultTypes = ['network_updates', 'incident_reports'];
	let filteredItems = parsedItems.filter((item) => defaultTypes.includes(item.type));

	// If blog_posts are requested, include them in the results
	if (includeBlogPosts) {
		const blogPosts = parsedItems.filter((item) => item.type === 'blog_posts');
		filteredItems = [...filteredItems, ...blogPosts];
	}

	return filteredItems;
}
