<script lang="ts">
	import CopyToClipboard from './CopyToClipboard.svelte';
	import validAtomImg from '$lib/images/valid-atom.png';
	import validRssImg from '$lib/images/valid-rss-rogers.png';

	const BASE_URL = 'https://status.orcfax.io';

	let selectedFormat = 'rss.xml';
	let selectedOptionalCategories: string[] = [];

	$: feedUrl = (() => {
		const url = new URL(`${BASE_URL}/${selectedFormat}`);
		if (selectedOptionalCategories.length > 0) {
			url.searchParams.set('include', selectedOptionalCategories.join(','));
		}
		return url.toString();
	})();
</script>

<section id="rss-subscription" class="w-full max-w-fit">
	<h2 class="text-2xl font-bold mb-4">Orcfax RSS Feed</h2>
	<p class="text-base-content opacity-60 mb-4">
		Stay informed about the status of the Orcfax network with incident reports, and other important
		network updates
	</p>

	<div class="bg-base-100 border border-neutral rounded-lg p-6 space-y-6 w-full">
		<div>
			<h3 class="font-semibold mb-2">RSS Feed URL Builder</h3>

			<div
				class="inline-grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-base-content/20 gap-2 sm:gap-0 mb-4"
			>
				<div class="sm:pr-6">
					<h4 class="text-sm font-medium text-base-content mb-2">Feed Format</h4>
					<div class="space-y-2">
						<label class="flex items-center">
							<input type="radio" bind:group={selectedFormat} value="rss.xml" class="mr-2" />
							<span class="text-base-content">RSS (XML)</span>
						</label>
						<label class="flex items-center">
							<input type="radio" bind:group={selectedFormat} value="atom.xml" class="mr-2" />
							<span class="text-base-content">Atom (XML)</span>
						</label>
						<label class="flex items-center">
							<input type="radio" bind:group={selectedFormat} value="rss.json" class="mr-2" />
							<span class="text-base-content">JSON</span>
						</label>
					</div>
				</div>

				<div class="sm:hidden h-px bg-base-content/20 my-4" />

				<div class="sm:pl-6">
					<h4 class="text-sm font-medium text-base-content mb-2">Content Filter</h4>
					<div class="space-y-2">
						<label class="flex items-center">
							<input type="checkbox" checked disabled class="mr-2 opacity-50" />
							<span class="text-base-content opacity-40">Incident Reports</span>
						</label>
						<label class="flex items-center">
							<input type="checkbox" checked disabled class="mr-2 opacity-50" />
							<span class="text-base-content opacity-40">Network Updates</span>
						</label>
						<label class="flex items-center">
							<input
								type="checkbox"
								bind:group={selectedOptionalCategories}
								value="blog_posts"
								class="mr-2"
							/>
							<span class="text-base-content">Blog Posts</span>
						</label>
					</div>
				</div>
			</div>

			<div class="w-full max-w-fit flex items-center gap-2 overflow-hidden">
				<code
					class="block bg-base-200 p-2 rounded border border-neutral overflow-x-auto flex-1 text-sm"
					>{feedUrl}</code
				>
				<CopyToClipboard value={feedUrl} />
			</div>
		</div>

		<div>
			<h3 class="font-semibold mb-2">How to Subscribe</h3>
			<p class="text-base-content opacity-60 mb-4">
				You can subscribe to the Orcfax RSS feed in Discord, Telegram, or any RSS reader
				application.
			</p>

			<div class="flex gap-4 mt-4">
				<a
					href={`http://validator.w3.org/feed/check.cgi?url=${encodeURIComponent(
						`${BASE_URL}/rss.xml`
					)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={validRssImg} alt="[Valid RSS]" title="Validate Orcfax RSS feed" />
				</a>
				<a
					href={`http://validator.w3.org/feed/check.cgi?url=${encodeURIComponent(
						`${BASE_URL}/atom.xml`
					)}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={validAtomImg} alt="[Valid Atom 1.0]" title="Validate Orcfax Atom 1.0 feed" />
				</a>
			</div>
		</div>
	</div>
</section>
