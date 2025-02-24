<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center w-full min-h-full">
	<h1>{$page.status}: {$page.error?.message}</h1>
</div>
