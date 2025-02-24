<script lang="ts">
	import type { RSSFeedItem } from '$lib/types';
	import NotificationCard from './NotificationCard.svelte';

	export let data: { updates: RSSFeedItem[] } | undefined;
	export let error: Error | null = null;
	export let isLoading = false;

	$: updates = data?.updates ?? [];
</script>

<section id="updates" class="w-full">
	<h2 class="text-2xl font-bold mb-4">Network Updates</h2>
	<div class="border border-neutral rounded-lg overflow-y-auto max-h-[400px]">
		{#if error}
			<p class="text-red-600 p-4">Error loading updates: {error.message}</p>
		{:else if isLoading}
			<div class="space-y-4 p-4">
				{#each Array(3) as _}
					<div class="border border-neutral rounded-lg p-4 w-full animate-pulse">
						<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
						<div class="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				{/each}
			</div>
		{:else if updates?.length === 0}
			<p class="text-gray-600 p-4">No recent network updates</p>
		{:else}
			<div class="space-y-4 p-4">
				{#each updates ?? [] as update}
					<NotificationCard notification={update} />
				{/each}
			</div>
		{/if}
	</div>
</section>
