<script lang="ts">
	import ValidatorTimeline from '$lib/components/ValidatorTimeline.svelte';
	import type { ValidatorSummary } from '$lib/types';
	import DoughnutChart from '$lib/components/DoughnutChart.svelte';
	import { blur } from 'svelte/transition';

	export let summary: ValidatorSummary;

	$: segments = [
		{
			label: 'Held',
			value: summary.licensesHeldCount,
			backgroundColor: 'rgb(74 222 128)',
			hoverColor: 'rgb(134 239 172)'
		},
		{
			label: 'For Sale',
			value: summary.licensesForSaleCount,
			backgroundColor: 'rgb(250 204 21)',
			hoverColor: 'rgb(253 224 71)'
		}
	];

	let innerWidth = 0;
	let innerHeight = 0;

	function handleSegmentClick(label: unknown) {
		let element: Element | null = null;

		if (label === 'Held') {
			element = document.getElementsByClassName('table-head')[0];
		} else if (label === 'For Sale') {
			window.open(
				'https://www.jpg.store/collection/orcfaxvalidatorlicenses?tab=items&listingTypes=SINGLE_ASSET&saleType=buy-now',
				'_blank'
			);
		}

		if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	$: isLegendBottom = innerWidth < 769 || innerWidth > 1023;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<section class="flex flex-col gap-y-1 w-11/12 max-w-3xl">
	<h1
		class="sr-only font-bold text-center md:text-left px-4 text-3xl text-base-100-content opacity-60 pb-2"
	>
		Validator License Summary
	</h1>
	<div
		class="flex flex-col justify-center items-center p-8 shadow-sm border border-neutral rounded-lg bg-secondary gap-4"
	>
		<h2 class="text-3xl text-center text-primary font-bold">Phase 1 of the Orcfax ITN is live!</h2>
		<a
			class="text-base font-bold underline text-center"
			href="https://medium.com/@orcfax/orcfax-itn-phase-1-a-guide-for-validators-5b35d81e189d"
			target="_blank"
		>
			Phase 1 guide →
		</a>
		<a
			class="text-base font-bold underline text-center"
			href="https://docs.orcfax.io/itn-overview"
			target="_blank"
		>
			ITN Docs →
		</a>
		<a
			class="text-base font-bold underline text-center"
			href="https://itn.0.orcfax.io/diagnostics"
			target="_blank"
		>
			ITN Diagnostics →
		</a>

		<ValidatorTimeline />

		<div class="divider" />

		<div class="flex flex-col lg:flex-row lg:w-full lg:justify-evenly">
			<div class="flex flex-col gap-10 justify-center items-center w-full lg:w-1/2">
				<div
					class="text-base-100-content opacity-80 font-bold text-2xl md:ml-[-8rem] md:-mb-20 lg:ml-0 lg:-mb-4"
				>
					Validator Licenses:
				</div>
				<div class="w-full flex justify-center items-center max-w-[25rem] max-h-min">
					<DoughnutChart
						{segments}
						centerText={'100'}
						legendPosition={isLegendBottom ? 'bottom' : 'right'}
						onSegmentClick={handleSegmentClick}
					/>
				</div>
			</div>

			<div class="divider md:-mt-10" />

			<div
				class="stats flex flex-col md:flex-row lg:flex-col lg:justify-center bg-secondary shadow-none -mt-18 lg:min-w-max lg:items-center"
			>
				<section
					class="flex flex-col justify-center self-center w-max text-base mt-8 text-base-100-content font-bold whitespace-normal text-center"
					aria-labelledby="multiplier-snapshots-heading"
				>
					<header class="flex">
						<h3 id="multiplier-snapshots-heading" class="text-secondary-content font-extrabold">
							Multiplier Snapshots:
						</h3>
					</header>
					<dl class="flex flex-col">
						<div class="flex gap-2">
							<dt class="font-bold">Start:</dt>
							<dd class="font-normal">4-22-2024 18:00 UTC</dd>
						</div>
						<div class="flex gap-2">
							<dt class="font-bold">End:</dt>
							<dd class="font-normal">12-01-2024 18:00 UTC</dd>
						</div>
					</dl>
				</section>

				<div class="lg:divider border-none" />

				<div
					class="stat border-none md:border-solid lg:border-none place-items-center"
					transition:blur|global
				>
					<div class="stat-value text-4xl text-primary">{summary.licensesForSaleCount}</div>
					<div
						class="stat-title text-base-100-content font-bold text-xl whitespace-normal text-center"
					>
						Licenses For Sale
						<div class="flex flex-col justify-center text-sm mt-2">
							<a
								class="underline"
								href="https://www.jpg.store/collection/orcfaxvalidatorlicenses?tab=items&listingTypes=SINGLE_ASSET&saleType=buy-now"
								target="_blank"
							>
								See Current Listings →
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="divider" />

		<div class="flex flex-col gap-6 lg:flex-row">
			<div role="alert" class="alert shadow-sm border border-neutral">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-current shrink-0 w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-sm">
					All multipliers are now locked and will be used to calculate rewards for ITN participants.
				</p>
			</div>
			<div role="alert" class="alert shadow-sm border border-neutral">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-current shrink-0 w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-sm">
					Have a question or concern about your ITN Multiplier Reward %? <br />
					<strong>
						Please let us know on
						<a class="underline" href="https://discord.com/invite/UbAeRuNzDu" target="_blank">
							Discord
						</a>.
					</strong>
				</p>
			</div>
		</div>
	</div>
</section>
