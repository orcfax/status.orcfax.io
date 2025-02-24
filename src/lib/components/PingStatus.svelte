<script lang="ts">
	export let color: 'green' | 'yellow' | 'red';
</script>

<span class="relative flex h-2 w-2">
	<span
		class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
		class:bg-green-400={color === 'green'}
		class:bg-yellow-400={color === 'yellow'}
		class:bg-red-400={color === 'red'}
	/>
	<span
		class="relative inline-flex rounded-full h-2 w-2"
		class:bg-green-500={color === 'green'}
		class:bg-yellow-500={color === 'yellow'}
		class:bg-red-500={color === 'red'}
	/>
</span>
