<script lang="ts">
	import type { RSSFeedItem } from '$lib/types';

	export let notification: RSSFeedItem;
	export let statusClass = ''; // For custom status colors

	// Convert status text from snake_case to Title Case
	function formatStatus(status: string): string {
		return status
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<div class="border border-neutral rounded-lg p-4 w-full bg-base-100">
	<h3 class="font-semibold">{notification.title}</h3>
	<p class="text-base-content text-sm mt-1">{notification.description}</p>
	<div class="mt-2 flex gap-2 items-center">
		{#if notification.status}
			<span class="text-xs {statusClass} px-2 py-1 rounded">
				{formatStatus(notification.status)}
			</span>
		{/if}
		<span class="text-xs text-base-content opacity-60">
			Published {new Date(notification.publish_date).toLocaleDateString()}
		</span>
		{#if notification.link}
			<a
				href={notification.link}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary underline text-sm ml-auto"
			>
				View full details →
			</a>
		{/if}
	</div>
</div>
