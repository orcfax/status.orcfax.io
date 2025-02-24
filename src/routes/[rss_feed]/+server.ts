import { Feed } from 'feed';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { Category } from 'feed/lib/typings';
import { RSSFeedParamsSchema, type RSSFeedItem } from '$lib/types';

const VALID_FORMATS = {
	'rss.xml': {
		type: 'application/rss+xml',
		formatter: (feed: Feed) => feed.rss2()
	},
	'atom.xml': {
		type: 'application/atom+xml',
		formatter: (feed: Feed) => feed.atom1()
	},
	'rss.json': {
		type: 'application/json',
		formatter: (feed: Feed) => feed.json1()
	}
};

export const GET: RequestHandler = async ({ params, url, fetch }) => {
	const format = VALID_FORMATS[params.rss_feed as keyof typeof VALID_FORMATS];
	const { include } = RSSFeedParamsSchema.parse({ include: url.searchParams.get('include') });
	const baseUrl = `${url.origin}`;

	if (!format) {
		throw error(404, 'Feed format not found');
	}

	const response = await fetch(`/api/rss?include=${include}`);
	const items = await response.json();

	const feed = new Feed({
		title: 'Orcfax Network Status',
		description: 'Realtime status updates from the Orcfax Network',
		id: `${baseUrl}/`,
		link: `${baseUrl}/`,
		language: 'en-us',
		favicon: `${baseUrl}/favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()}`,
		updated: new Date(),
		generator: 'Feed for Node.js',
		author: {
			name: 'Orcfax',
			link: 'https://orcfax.io/'
		},
		feedLinks: {
			rss2: `${baseUrl}/rss.xml`,
			json: `${baseUrl}/rss.json`,
			atom: `${baseUrl}/atom.xml`
		}
	});

	feed.addCategory('incident_reports');
	feed.addCategory('network_updates');
	feed.addCategory('blog_posts');

	items.forEach((item: RSSFeedItem) => {
		const itemUrl = item.link || `${baseUrl}/rss/${item.id}`;
		feed.addItem({
			title: item.title,
			id: itemUrl,
			link: itemUrl,
			description: item.description,
			content: `Type: ${item.type}${item.status ? `\nStatus: ${item.status}` : ''}`,
			date: new Date(item.publish_date),
			category: [{ name: item.type, term: item.type } as Category],
			author: [{ name: 'Orcfax', link: 'https://orcfax.io/' }]
		});
	});

	return new Response(format.formatter(feed), {
		headers: {
			'Content-Type': format.type
		}
	});
};
