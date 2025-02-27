<script lang="ts">
	import type { Source, Network, NetworkWithMetadata } from '$lib/types';
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	$: networksStore = createQuery({
		queryKey: ['networks'],
		queryFn: async () => {
			const res = await fetch('/api/networks');
			const data = await res.json();
			return data as NetworkWithMetadata[];
		}
	});

	$: ({ error, isLoading, isRefetching, data } = $networksStore);

	// Add sorting function to ensure mainnet comes first
	$: sortedNetworks =
		data?.slice().sort((a: Network, b: Network) => {
			if (a.name.toLowerCase().includes('mainnet')) return -1;
			if (b.name.toLowerCase().includes('mainnet')) return 1;
			return 0;
		}) ?? [];

	const formatNumber = (num: number): string => {
		return num.toLocaleString('en-US');
	};

	const getSourceCounts = (sources: Source[]) => {
		const dexLpCount = sources.filter((s) => s.type === 'DEX LP').length;
		const cexApiCount = sources.filter((s) => s.type === 'CEX API').length;
		return { dexLpCount, cexApiCount };
	};
</script>

<section class="network-summary">
	<h2 class="text-2xl font-bold mb-6">Network Status</h2>

	{#if data && !isRefetching}
		<div class="border border-neutral rounded-lg w-fit">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-fit">
				{#each sortedNetworks as network}
					<div class="border border-neutral rounded-lg p-4 bg-base-100 w-fit relative">
						<div class="flex items-center gap-2 mb-4">
							<div
								class="w-1.5 h-8 rounded-full {network.name.toLowerCase().includes('preview')
									? 'bg-yellow-500'
									: 'bg-green-500'}"
							/>
							<div class="flex items-center gap-2">
								<h3 class="text-xl font-semibold">{network.name}</h3>
								<span
									class="w-2 h-2 -mt-3 rounded-full animate-pulse {network.is_enabled
										? 'bg-green-500'
										: 'bg-red-500'}"
								></span>
							</div>
						</div>

						<div class="gap-4 mb-4 grid grid-cols-1 xs:grid-cols-2">
							<div class="stat-item min-w-[120px]">
								<span class="text-sm font-semibold">Active Feeds</span>
								<span class="text-lg font-semibold">{network.stats.totalActiveFeeds}</span>
							</div>
							<div class="stat-item min-w-[120px]">
								<span class="text-sm font-semibold">Total Facts</span>
								<div>
									<span class="text-lg font-semibold">{formatNumber(network.stats.totalFacts)}</span
									>
									<span class="text-sm text-green-600 block"
										>+ {formatNumber(network.stats.totalFacts24Hour)} today (UTC)</span
									>
								</div>
							</div>
						</div>

						<div class="border border-neutral rounded-lg p-3 mb-4 bg-base-200">
							<div class="flex gap-2 items-center mb-3">
								<span class="text-sm">Arweave:</span>
								<div class="flex items-center gap-1">
									<div
										class="w-2 h-2 rounded-full animate-pulse {network.name
											.toLowerCase()
											.includes('preview')
											? 'bg-red-500'
											: 'bg-green-500'}"
									/>
									<span class="text-sm text-gray-600">
										{network.name.toLowerCase().includes('preview') ? 'Disabled' : 'Enabled'}
									</span>
								</div>
							</div>

							<div class="grid grid-cols-1 xs:grid-cols-2 gap-4">
								<div class="stat-item min-w-[120px]">
									<span class="text-sm">Data Sources</span>
									{#if !network.name.toLowerCase().includes('preview')}
										<span class="text-lg font-semibold">{network.stats.sources.length}</span>
										{@const { dexLpCount, cexApiCount } = getSourceCounts(network.stats.sources)}
										<span class="text-xs text-gray-600">
											{dexLpCount} DEX LP · {cexApiCount} CEX API
										</span>
									{:else}
										<span class="text-lg font-semibold text-gray-400">—</span>
									{/if}
								</div>
								<div class="stat-item min-w-[120px]">
									<span class="text-sm">Oracle Nodes</span>
									{#if !network.name.toLowerCase().includes('preview')}
										<div class="flex items-center gap-2">
											<div class="flex items-center gap-1">
												<div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
												<span class="text-sm">
													{network.stats.nodes.filter((n) => n.status === 'active').length} / {network
														.stats.nodes.length} active
												</span>
											</div>
										</div>
									{:else}
										<span class="text-lg font-semibold text-gray-400">—</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="text-sm space-y-2">
							<div class="flex flex-wrap items-center">
								<span class="font-semibold mr-1">Last Block:</span>
								<div class="flex items-center">
									<div class="tooltip tooltip-top" data-tip={network.last_block_hash}>
										<span class="truncate inline-block underline">
											{network.last_block_hash.slice(0, 16)}...
										</span>
									</div>
									<CopyToClipboard
										value={network.last_block_hash}
										tooltipDirection="tooltip-left"
									/>
								</div>
							</div>
							<div class="flex flex-wrap items-center">
								<span class="font-semibold mr-1">Last Slot:</span>
								<div class="flex items-center">
									<span>{network.last_checkpoint_slot}</span>
									<CopyToClipboard
										value={network.last_checkpoint_slot}
										tooltipDirection="tooltip-left"
									/>
								</div>
							</div>
							<div class="flex flex-wrap items-center">
								<span class="font-semibold mr-1">Contract Address:</span>
								<div class="flex items-center">
									<div
										class="tooltip tooltip-top"
										data-tip={network.cardano_smart_contract_address}
									>
										<a
											href={`${network.block_explorer_base_url}/address/${network.cardano_smart_contract_address}`}
											class="underline truncate inline-block"
											target="_blank"
											rel="noopener noreferrer"
										>
											{network.cardano_smart_contract_address.slice(0, 16)}...
										</a>
									</div>
									<CopyToClipboard
										value={network.cardano_smart_contract_address}
										tooltipDirection="tooltip-left"
									/>
								</div>
							</div>
							<div class="flex flex-wrap items-center">
								<span class="font-semibold mr-1">FS Pointer:</span>
								<div class="flex items-center">
									<div class="tooltip tooltip-top" data-tip={network.fact_statement_pointer}>
										<span class="truncate inline-block"
											>{network.fact_statement_pointer.slice(0, 16)}...</span
										>
									</div>
									<CopyToClipboard
										value={network.fact_statement_pointer}
										tooltipDirection="tooltip-left"
									/>
								</div>
							</div>
							<div class="flex flex-wrap items-center">
								<span class="font-semibold mr-1">Current Script:</span>
								<div class="flex items-center">
									<div class="tooltip tooltip-top" data-tip={network.policies[0].policy_id}>
										<a
											href={`${network.block_explorer_base_url}/script/${network.policies[0].policy_id}`}
											class="underline truncate inline-block"
											target="_blank"
											rel="noopener noreferrer"
										>
											{network.policies[0].policy_id.slice(0, 16)}...
										</a>
									</div>
									<CopyToClipboard
										value={network.policies[0].policy_id}
										tooltipDirection="tooltip-left"
									/>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if error && !isRefetching}
		<div class="alert alert-error">
			<span>Failed to load network data: {error.message}</span>
		</div>
	{:else}
		<div class="border border-neutral rounded-lg w-fit">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-fit">
				{#each Array(2) as _}
					<div class="border border-neutral rounded-lg p-4 bg-base-100 w-fit relative">
						<!-- Header skeleton -->
						<div class="flex items-center gap-2 mb-4">
							<div class="bg-neutral animate-pulse w-1.5 h-8 rounded-full" />
							<div class="flex items-center gap-2">
								<div class="bg-neutral animate-pulse h-8 w-40 rounded" />
								<div class="w-2 h-2 -mt-3 rounded-full bg-neutral animate-pulse" />
							</div>
						</div>

						<!-- Stats skeleton -->
						<div class="gap-4 mb-4 grid grid-cols-1 xs:grid-cols-2">
							<div class="stat-item min-w-[120px]">
								<div class="bg-neutral animate-pulse h-4 w-24 rounded mb-1" />
								<div class="bg-neutral animate-pulse h-6 w-16 rounded" />
							</div>
							<div class="stat-item min-w-[120px]">
								<div class="bg-neutral animate-pulse h-4 w-24 rounded mb-1" />
								<div class="bg-neutral animate-pulse h-6 w-16 rounded" />
								<div class="bg-neutral animate-pulse h-4 w-32 rounded" />
							</div>
						</div>

						<!-- Arweave box skeleton -->
						<div class="border border-neutral rounded-lg p-3 mb-4 bg-base-200">
							<div class="flex gap-2 items-center mb-3">
								<div class="bg-neutral animate-pulse h-4 w-16 rounded" />
								<div class="flex items-center gap-1">
									<div class="w-2 h-2 rounded-full bg-neutral animate-pulse" />
									<div class="bg-neutral animate-pulse h-4 w-16 rounded" />
								</div>
							</div>

							<div class="grid grid-cols-1 xs:grid-cols-2 gap-4">
								<div class="stat-item min-w-[120px]">
									<div class="bg-neutral animate-pulse h-4 w-24 rounded mb-1" />
									<div class="bg-neutral animate-pulse h-6 w-16 rounded" />
									<div class="bg-neutral animate-pulse h-4 w-32 rounded" />
								</div>
								<div class="stat-item min-w-[120px]">
									<div class="bg-neutral animate-pulse h-4 w-24 rounded mb-1" />
									<div class="bg-neutral animate-pulse h-6 w-32 rounded" />
								</div>
							</div>
						</div>

						<!-- Bottom info skeleton -->
						<div class="text-sm space-y-2">
							{#each Array(5) as _}
								<div class="flex flex-wrap items-center">
									<div class="bg-neutral animate-pulse h-4 w-32 rounded mr-2" />
									<div class="flex items-center">
										<div class="bg-neutral animate-pulse h-4 w-40 rounded" />
										<div class="bg-neutral animate-pulse h-4 w-6 rounded ml-2" />
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>

<style>
	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.tooltip::before {
		overflow-wrap: break-word;
		max-width: 10rem;
		isolation: isolate;
		z-index: 40;
	}
</style>
