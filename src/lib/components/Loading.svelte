<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<div class="flex justify-center items-center w-full h-full">
	<span
		class="loading loading-ring bg-primary w"
		class:w-20={size === 'sm'}
		class:w-32={size === 'md'}
		class:w-48={size === 'lg'}
	/>
</div>
