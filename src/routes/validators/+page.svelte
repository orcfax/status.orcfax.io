<script lang="ts">
	import ValidatorLicenseSummary from '$lib/components/ValidatorLicenseSummary.svelte';
	import LicenseHolderTable from '$lib/components/LicenseHolderTable.svelte';

	export let data;
</script>

<div class="flex flex-col justify-center items-center w-full gap-16">
	<ValidatorLicenseSummary summary={data} />
	<LicenseHolderTable licenseHolders={data.licenseHolders} />
</div>
