<script lang="ts">
	import type { LicenseHolderSummary } from '$lib/types';
	import { ellipsis, formatNumber, formatPercentageValue } from '$lib/client/helpers.js';
	import PingStatus from '$lib/components/PingStatus.svelte';
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';

	export let licenseHolder: LicenseHolderSummary;

	let innerWidth = 0;
	let innerHeight = 0;
	$: isSmall = innerWidth < 769;

	function getStatusColor(holder: LicenseHolderSummary) {
		if (holder.licensesHeld.length > 0 && !holder.isNFTExchange) return 'green';
		else if (holder.licensesHeld.length > 0 && holder.isNFTExchange) return 'yellow';
		else return 'red';
	}

	function getStatusTooltip(holder: LicenseHolderSummary) {
		const licenseNumbers = holder.licensesHeld.map((license) => license.licenseNumber).join(', #');
		if (holder.licensesHeld.length > 0 && !holder.isNFTExchange)
			return `This wallet holds validator license #${licenseNumbers}`;
		else if (holder.licensesHeld.length > 0 && holder.isNFTExchange)
			return `NFT Exchange: Holds validator license #${licenseNumbers}`;
		else return `This wallet was a past license holder`;
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<td class={`border-b border-gray-200 py-4 px-2 sm:px-3 text-sm font-medium text-secondary-content`}>
	<div
		class={`flex justify-center items-center tooltip tooltip-right`}
		data-tip={getStatusTooltip(licenseHolder)}
	>
		<PingStatus color={getStatusColor(licenseHolder)} />

		{#if licenseHolder.licensesHeld.length > 0}
			<span class="block ml-2 text-left">
				<a
					class="underline"
					href={`https://cexplorer.io/asset/${licenseHolder.licensesHeld[0].assetFingerprint}`}
					target="_blank"
				>
					{`#${licenseHolder.licensesHeld[0].licenseNumber}`}
				</a>

				{#if licenseHolder.licensesHeld.length > 1}
					<span class="text-gray-500"> +{licenseHolder.licensesHeld.length - 1}</span>
				{/if}
			</span>
		{:else}
			<div class="flex w-full ml-2">
				<div class="flex-shrink-0">
					<svg
						class="h-5 w-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		{/if}
	</div>
</td>

<td
	class="hidden border-b border-gray-200 py-4 px-2 sm:px-3 text-sm font-medium text-secondary-content lg:table-cell"
>
	{#if licenseHolder.stakeAddress}
		<div class="flex items-center">
			<a
				href={`https://cardanoscan.io/stakeKey/${licenseHolder.stakeAddress}`}
				class="tooltip tooltip-top underline"
				data-tip={licenseHolder.stakeAddress}
			>
				{ellipsis(licenseHolder.stakeAddress, { placement: 'middle' })}
			</a>
			{#if licenseHolder.stakeAddress}
				<div class="isolate z-0">
					<CopyToClipboard value={licenseHolder.stakeAddress} tooltipDirection="tooltip-bottom" />
				</div>
			{/if}
		</div>
	{:else}
		<span class="text-gray-500">-</span>
	{/if}
</td>

<td
	class="hidden border-b border-gray-200 py-4 px-2 sm:px-3 text-sm font-medium text-secondary-content"
>
	<div class="flex items-center">
		<a
			href={`https://cardanoscan.io/address/${licenseHolder.paymentAddress}`}
			class="tooltip tooltip-top underline"
			data-tip={licenseHolder.paymentAddress}
		>
			{ellipsis(licenseHolder.paymentAddress, {
				maxLength: isSmall ? 4 : 20,
				placement: isSmall ? 'start' : 'middle'
			})}
		</a>
		<div class="isolate z-0 -ml-1 sm:ml-0">
			<CopyToClipboard value={licenseHolder.paymentAddress} tooltipDirection="tooltip-bottom" />
		</div>
	</div>
</td>

<td
	class="hidden border-b border-gray-200 py-4 px-2 sm:px-3 text-sm text-center font-medium text-secondary-content xs:table-cell"
>
	<p class="text-secondary-content tooltip tooltip-top">
		<span class="whitespace-pre-wrap w-[1rem] text-center sm:whitespace-nowrap"
			>{licenseHolder.isNFTExchange
				? '-'
				: formatNumber(licenseHolder.currentFACTHoldings ?? 0)}</span
		>
	</p>
</td>

<td
	class="border-b border-gray-200 py-4 px-2 sm:px-3 text-sm text-center font-medium text-secondary-content"
>
	<p class="text-secondary-content tooltip tooltip-top">
		<span class="text-center"
			>{licenseHolder.isNFTExchange
				? '-'
				: formatNumber(licenseHolder.averageFACTHoldings ?? 0)}</span
		>
	</p>
</td>

<td
	class="hidden border-b border-gray-200 py-4 px-2 sm:px-3 text-sm text-center font-medium text-secondary-content sm:table-cell"
>
	{licenseHolder.hasLicenseMult && !licenseHolder.isNFTExchange ? '5%' : '-'}
</td>

<td
	class="hidden border-b border-gray-200 py-4 px-2 sm:px-3 text-sm text-center lg:w-min font-medium text-secondary-content sm:table-cell"
>
	{licenseHolder.hasMinFACTMult && !licenseHolder.isNFTExchange ? '10%' : '-'}
</td>

<td
	class="border-b border-gray-200 py-4 px-2 sm:px-3 text-sm text-center lg:w-min font-medium text-secondary-content"
>
	{licenseHolder.isNFTExchange
		? '-'
		: licenseHolder.averageFACTMult
			? `${formatPercentageValue(licenseHolder.averageFACTMult * 100)}%`
			: '0%'}
</td>

<td
	class="border-x-2 border-primary border-b-gray-400 border-opacity-40 border-b bg-primary bg-opacity-30 py-4 px-2 sm:px-3 text-sm text-center w-[4rem] lg:w-min font-medium text-secondary-content"
>
	{licenseHolder.isNFTExchange
		? '-'
		: `${formatPercentageValue(licenseHolder.totalITNMultiplier * 100)}%`}
</td>

<style>
	.tooltip::before {
		overflow-wrap: break-word;
		max-width: 10rem;
		isolation: isolate;
		z-index: 40;
	}
</style>
