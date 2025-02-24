<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import Search from '$lib/icons/Search.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { LicenseHolderSummary } from '$lib/types';
	import LicenseHolderRow from '$lib/components/LicenseHolderRow.svelte';

	export let licenseHolders: LicenseHolderSummary[];

	let marker: HTMLDivElement;
	let isBackToTopButtonVisible = false;

	onMount(() => {
		let lastScrollY = window.scrollY;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const currentScrollY = window.scrollY;
					const targetIsAbove = entry.boundingClientRect.top < 0;
					const scrolledUpPastTarget =
						!entry.isIntersecting && currentScrollY < lastScrollY && targetIsAbove;

					// Show button if the target is above the viewport and user scrolled up past it
					isBackToTopButtonVisible =
						scrolledUpPastTarget || (!entry.isIntersecting && targetIsAbove);

					lastScrollY = currentScrollY; // Update the last scroll position
				});
			},
			{ rootMargin: '0px', threshold: 0.1 }
		);

		observer.observe(marker);

		return () => observer.disconnect();
	});

	let searchQuery = '';
	$: filteredHolders = filterRows(searchQuery, licenseHolders);

	let innerWidth = 0;
	let innerHeight = 0;
	$: isSmall = innerWidth < 769;

	function filterRows(query: string, rows: LicenseHolderSummary[]) {
		if (query === '') {
			return rows;
		}
		const filtered = rows.filter((row) => {
			const stakeAddress = row.stakeAddress;
			const paymentAddress = row.paymentAddress;

			return (
				(stakeAddress !== null && stakeAddress.includes(query)) || paymentAddress.includes(query)
			);
		});

		return filtered;
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="w-min">
	<div
		class="flex flex-col relative w-full items-center justify-center gap-4 lg:flex-row lg:justify-between lg:gap-0"
	>
		<div bind:this={marker}>
			<h1 class="font-bold text-center text-3xl text-base-100-content opacity-60">
				Validator License Holders
			</h1>
		</div>
		<div class="flex w-full lg:w-[22rem] rounded-md shadow-sm bg-secondary">
			<input
				type="text"
				bind:value={searchQuery}
				name="tableSearchInput"
				id="tableSearchInput"
				class="block w-full rounded-none rounded-l-md border border-gray-200 py-2.5 pl-4 bg-secondary text-secondary-content placeholder:text-secondary-content/50"
				placeholder="Wallet Address"
			/>
			{#if searchQuery !== ''}
				<button
					type="button"
					on:click={() => (searchQuery = '')}
					class="inline-flex rounded-md bg-secondary p-1.5 text-secondary-content hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-secondary"
				>
					<span class="sr-only">Clear</span>
					<svg class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						/>
					</svg>
				</button>
			{:else}
				<button
					type="button"
					class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-secondary-content ring-1 ring-inset ring-secondary-content/20 hover:bg-secondary-content/10"
				>
					<Search />
				</button>
			{/if}
		</div>
	</div>
	<div class="mt-4 flow-root xl:min-w-full">
		<div class="flex justify-center mx-0 sm:-mx-4 -my-2 md:-mx-6 lg:-mx-8">
			<div
				class="inline-block min-w-max py-2 align-middle shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
			>
				<table class="min-w-full border-separate border-spacing-0">
					<thead class="bg-secondary table-head">
						<tr>
							<th
								scope="col"
								class="sticky top-0 z-10 border-b border-gray-300 bg-opacity-75 py-3.5 px-1 pl-2 sm:px-3 text-left text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter"
							>
								License(s)
							</th>
							<th
								scope="col"
								class="sticky hidden top-0 z-10 border-b border-gray-300 bg-opacity-75 px-1 sm:px-3 py-3.5 text-left text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter lg:table-cell"
							>
								Stake Address
							</th>
							<th
								scope="col"
								class="sticky hidden top-0 z-10 border-b border-gray-300 bg-opacity-75 px-1 sm:px-3 py-3.5 text-left text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter"
							>
								{isSmall ? 'Address' : 'Payment Address'}
							</th>
							<th
								scope="col"
								class="sticky hidden top-0 z-10 border-b border-gray-300 bg-opacity-75 px-1 sm:px-3 py-3.5 text-center md:text-left text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter xs:table-cell"
							>
								<div
									class="tooltip tooltip-bottom isolate z-20 w-[4rem] lg:w-max"
									data-tip="Current amount of $FACT held in the wallet."
								>
									$FACT Held
								</div>
							</th>
							<th
								scope="col"
								class="sticky top-0 z-10 border-b border-gray-300 bg-opacity-75 px-1 sm:px-3 py-3.5 text-center text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter"
							>
								<div
									class="tooltip tooltip-bottom isolate z-20 w-[4rem] lg:w-max"
									data-tip="Average amount of $FACT held in the wallet since the ITN Multiplier start date."
								>
									Avg. $FACT Held
								</div>
							</th>
							<th
								scope="col"
								class="sticky hidden top-0 z-10 border-b border-gray-300 bg-opacity-75 px-1 sm:px-3 py-3.5 text-left text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter sm:table-cell"
							>
								<div
									class="tooltip tooltip-bottom isolate z-20 w-[4rem] lg:w-max"
									data-tip="Maintain continuous possession of your NFT license from the multiplier start date until the ITN start date to earn this 5% multiplier."
								>
									License Mult. %
								</div>
							</th>
							<th
								scope="col"
								class="sticky hidden top-0 z-10 border-b border-gray-300 bg-opacity-75 px-1 sm:px-3 py-3.5 text-center text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter sm:table-cell"
							>
								<div
									class="tooltip tooltip-bottom isolate z-20 w-[4rem] lg:w-max"
									data-tip="Maintain a minimum of 250,000 $FACT from the multiplier start date until the ITN start date to qualify for an additional 10% multiplier."
								>
									Min. $FACT Mult. %
								</div>
							</th>
							<th
								scope="col"
								class="sticky top-0 z-10 border-b border-gray-300 bg-opacity-75 px-1 sm:px-3 py-3.5 text-center text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter"
							>
								<div
									class="tooltip tooltip-bottom isolate z-20 w-[4rem] lg:w-max"
									data-tip="Daily calculation from multiplier start to ITN start. Multiplier % activates once average is above 250,000 $FACT, maxing at 20% for 1,500,000 $FACT."
								>
									Avg. $FACT Mult. %
								</div>
							</th>
							<th
								scope="col"
								class="sticky top-0 z-10 border-2 border-primary border-b border-b-gray-300 border-opacity-40 bg-opacity-75 bg-primary px-1 pr-2 sm:px-3 py-3.5 text-left text-sm font-semibold text-secondary-content backdrop-blur backdrop-filter"
							>
								<div
									class="tooltip tooltip-bottom isolate z-20"
									data-tip="Total of all multiplier %. Maxes out at 35%."
								>
									Total Mult. %
								</div>
							</th>
						</tr>
					</thead>
					<tbody class="bg-secondary divide-y divide-gray-200">
						{#if filteredHolders.length === 0}
							<tr>
								<td
									colspan="8"
									class="text-center py-4 text-sm font-medium text-secondary-content lg:min-w-[60rem]"
								>
									<Loading size="sm" />
								</td>
							</tr>
						{:else}
							{#each filteredHolders as licenseHolder (licenseHolder.id)}
								<tr id={licenseHolder.paymentAddress}>
									<LicenseHolderRow {licenseHolder} />
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

{#if isBackToTopButtonVisible}
	<button
		transition:fade|global={{ delay: 250, duration: 300 }}
		on:click={() => {
			const element = document.getElementsByClassName('table-head');
			if (element[0]) element[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}}
		class="top bg-primary font-bold"
	>
		Back to Top &#8593;
	</button>
{/if}

<style>
	.tooltip::before {
		overflow-wrap: break-word;
		max-width: 10rem;
		isolation: isolate;
		z-index: 40;
	}

	.top {
		place-self: end;
		position: sticky;
		bottom: 20px;
		margin-right: 20px;
		isolation: isolate;
		z-index: 60;

		/* visual styling */
		text-decoration: none;
		padding: 10px;
		padding-left: 14px;
		color: #fff;
		border-radius: 100px;
		white-space: nowrap;
	}
</style>
