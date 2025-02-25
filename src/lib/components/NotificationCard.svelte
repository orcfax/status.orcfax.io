<script lang="ts">
	import type { RSSFeedItem } from '$lib/types';
	import { marked } from 'marked';

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

{#if notification.link}
	<a
		href={notification.link}
		target="_blank"
		rel="noopener noreferrer"
		class="block no-underline hover:no-underline"
	>
		<div
			class="border border-neutral rounded-lg p-4 w-full max-w-xl bg-base-100 hover:bg-base-200/50 dark:hover:bg-base-300/50 transition-colors duration-200"
		>
			<h3 class="font-semibold">{notification.title}</h3>
			<p class="text-base-content text-sm mt-1">{@html marked(notification.description)}</p>
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
						class="text-primary underline text-sm ml-auto hover:text-primary-focus z-10 relative"
					>
						View full details →
					</a>
				{/if}
			</div>
		</div>
	</a>
{:else}
	<div class="border border-neutral rounded-lg p-4 w-full max-w-xl bg-base-100">
		<h3 class="font-semibold">{notification.title}</h3>
		<p class="text-base-content text-sm mt-1">{@html marked(notification.description)}</p>
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
{/if}
