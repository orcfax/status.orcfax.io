<script lang="ts">
	import NotificationCard from './NotificationCard.svelte';
	import type { RSSFeedItem } from '$lib/types';

	export let data: { incidents: RSSFeedItem[] } | undefined;
	export let error: Error | null = null;
	export let isLoading = false;

	$: incidents = data?.incidents ?? [];
	$: activeIncidents = incidents.filter((n: RSSFeedItem) => n.status !== 'resolved');
	$: pastIncidents = incidents.filter((n: RSSFeedItem) => n.status === 'resolved');

	const getStatusClass = (status: string | undefined) => {
		if (!status) return 'bg-gray-100 text-gray-800'; // Default style for empty/undefined status
		return status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
	};
</script>

<section id="incidents" class="w-full">
	<h2 class="text-2xl font-bold mb-4">Active Incidents</h2>
	<div class="border border-neutral rounded-lg overflow-y-auto max-h-[400px]">
		{#if error}
			<p class="text-red-600 p-4">Error loading incidents: {error.message}</p>
		{:else if isLoading}
			<div class="space-y-4 p-4">
				{#each Array(2) as _}
					<div class="border border-neutral rounded-lg p-4 w-full animate-pulse">
						<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
						<div class="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				{/each}
			</div>
		{:else if activeIncidents.length === 0}
			<p class="text-gray-600 p-4">No active incidents</p>
		{:else}
			<div class="space-y-4 p-4">
				{#each activeIncidents ?? [] as incident}
					<NotificationCard notification={incident} statusClass={getStatusClass(incident.status)} />
				{/each}
			</div>
		{/if}
	</div>

	<h2 class="text-2xl font-bold mb-4 mt-8">Past Incidents</h2>
	<div class="border border-neutral rounded-lg overflow-y-auto max-h-[400px]">
		{#if error}
			<p class="text-red-600 p-4">Error loading incidents: {error.message}</p>
		{:else if isLoading}
			<div class="space-y-4 p-4">
				{#each Array(2) as _}
					<div class="border border-neutral rounded-lg p-4 w-full animate-pulse">
						<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
						<div class="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				{/each}
			</div>
		{:else if pastIncidents.length === 0}
			<p class="text-gray-600 p-4">No past incidents</p>
		{:else}
			<div class="space-y-4 p-4">
				{#each pastIncidents ?? [] as incident}
					<NotificationCard notification={incident} statusClass={getStatusClass(incident.status)} />
				{/each}
			</div>
		{/if}
	</div>
</section>
