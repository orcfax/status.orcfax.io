<script>
	export let strokeColor = 'stroke-white';
	export let height = '22';
	export let width = '22';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{height}
	{width}
	viewBox="0 0 28 28"
	class={strokeColor}
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
	<polyline points="15 3 21 3 21 9" />
	<line x1="10" y1="14" x2="21" y2="3" />
</svg>
