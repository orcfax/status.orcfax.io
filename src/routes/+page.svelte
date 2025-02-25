<script lang="ts">
	import NetworkNotifications from '$lib/components/NetworkNotifications.svelte';
	import NetworkSummary from '$lib/components/NetworkSummary.svelte';
	import NavigationButtons from '$lib/components/NavigationButtons.svelte';
	import RssSubscription from '$lib/components/RSSSubscription.svelte';
</script>

<div class="flex flex-col w-full items-center gap-16 p-8 pt-0">
	<div class="flex flex-col items-center lg:flex-row gap-16">
		<NetworkSummary />
		<NavigationButtons />
	</div>
	<NetworkNotifications />
	<RssSubscription />
</div>
