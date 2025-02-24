<script lang="ts">
	import Incidents from './Incidents.svelte';
	import NetworkUpdates from './NetworkUpdates.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { RSSFeedItem } from '$lib/types';

	$: notificationsStore = createQuery({
		queryKey: ['network-notifications'],
		queryFn: async () => {
			const res = await fetch('/api/rss?category=incident_reports,network_updates');
			const data = await res.json();

			return {
				incidents: data.filter((item: RSSFeedItem) => item.type === 'incident_reports'),
				updates: data.filter((item: RSSFeedItem) => item.type === 'network_updates')
			};
		}
	});

	$: ({ data, error, isLoading } = $notificationsStore);
</script>

<div class="space-y-6">
	<h2 class="text-2xl font-bold">Network Notifications</h2>
	<section class="border border-neutral rounded-lg p-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<Incidents {data} {error} {isLoading} />
			<NetworkUpdates {data} {error} {isLoading} />
		</div>
	</section>
</div>
