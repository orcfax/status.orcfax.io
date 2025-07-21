<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { time } from '$lib/stores/time';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import AppFooter from '$lib/components/AppFooter.svelte';

	$time;

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<!-- Setup Privacy-preserving Umami Analytics -->
<svelte:head>
	<script
		async
		defer
		data-website-id="19e9527d-2fc1-4905-a49b-024bc39e2ca5"
		src="https://analytics.server.orcfax.io/umami.js"
	></script>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="flex flex-col w-full h-full min-h-full justify-between">
		<AppHeader />
		<div class="bg-base-100 mb-10 mt-6">
			<slot />
		</div>
		<AppFooter />
	</div>
	<SvelteQueryDevtools />
</QueryClientProvider>
