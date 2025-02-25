import PocketBase from 'pocketbase';
import type { RequestHandler } from './$types';
import {
	FeedSchema,
	NetworkSchema,
	NodeSchema,
	PolicySchema,
	SourceSchema,
	type Network,
	type NetworkWithMetadata
} from '$lib/types';
import { z } from 'zod';
import { format } from 'date-fns';

export const GET: RequestHandler = async ({ locals }) => {
	const networks = await getNetworksWithMetadata(locals.pb);

	return new Response(JSON.stringify(networks), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

async function getNetworksWithMetadata(db: PocketBase): Promise<NetworkWithMetadata[]> {
	try {
		const networks = await getAllNetworks(db);

		const networksWithStats = await Promise.all(
			networks.map(async (network) => ({
				...network,
				stats: {
					totalFacts: await getAllFactsCount(db, network),
					totalFacts24Hour: await getTodaysFactsCount(db, network),
					nodes: network.nodes,
					sources: network.sources.filter((source) => source.status === 'active'),
					totalActiveFeeds: network.feeds.filter((feed) => feed.status === 'active').length
				}
			}))
		);

		return networksWithStats;
	} catch (error) {
		console.error('Error retrieving networks with metadata:', error);
		return [];
	}
}

async function getAllNetworks(db: PocketBase): Promise<Network[]> {
	try {
		const response = await db.collection('networks').getFullList({
			expand: 'policies_via_network, nodes_via_network, sources_via_network, feeds_via_network'
		});

		const networks: Network[] = response.map((networkRecord) => {
			const policies = networkRecord.expand?.policies_via_network
				? z
						.array(PolicySchema)
						.parse(networkRecord.expand.policies_via_network)
						.sort((a, b) => b.starting_slot - a.starting_slot)
				: [];
			const nodes = networkRecord.expand?.nodes_via_network
				? z.array(NodeSchema).parse(networkRecord.expand.nodes_via_network)
				: [];
			const sources = networkRecord.expand?.sources_via_network
				? z.array(SourceSchema).parse(networkRecord.expand.sources_via_network)
				: [];
			const feeds = networkRecord.expand?.feeds_via_network
				? z.array(FeedSchema).parse(networkRecord.expand.feeds_via_network)
				: [];

			return NetworkSchema.parse({
				...networkRecord,
				policies,
				nodes,
				sources,
				feeds
			});
		});

		return networks;
	} catch (error) {
		console.error(`Error retrieving network records: ${error}`);
		return [];
	}
}

async function getAllFactsCount(db: PocketBase, network: Network): Promise<number> {
	const { totalItems } = await db
		.collection('facts')
		.getList(1, 1, { filter: `network = "${network.id}"` });
	return totalItems;
}

async function getTodaysFactsCount(db: PocketBase, network: Network): Promise<number> {
	const dateFilter = format(new Date(), 'yyyy-MM-dd');

	const { totalItems } = await db.collection('facts').getList(1, 5000, {
		filter: `network = "${network.id}" && publication_date >='${dateFilter} 00:00:00.000Z'`
	});

	return totalItems;
}
