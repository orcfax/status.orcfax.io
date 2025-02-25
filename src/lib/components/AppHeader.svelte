<script lang="ts">
	import orcfaxLogo from '$lib/images/orcfax_logo.png';
</script>

<header
	class="w-full bg-base-100 p-0 flex items-start border-neutral border-b sm:flex-row justify-between sm:p-1"
>
	<a class="normal-case gap-0 flex h-fit" href="/">
		<img
			class="w-[75px] lg:w-20 transform transition ease-in-out duration-300 delay-150 hover:-rotate-45"
			src={orcfaxLogo}
			alt="The Orcfax logo, an Orca jumping"
		/>
		<div class="flex-col pl-5">
			<h2 class="text-base-100-content text-3xl font-bold mt-2 -ml-8 ld:-ml-6">Orcfax</h2>
			<h3 class="animate-pulse text-primary text-2xl font-extrabold -mt-3 pl-0 lg:pl-2">status</h3>
		</div>
	</a>
	<div class="flex gap-2 items-center mt-2">
		<button
			class="btn btn-ghost btn-circle"
			data-toggle-theme="orcfax_light,orcfax_dark"
			data-act-class="ACTIVECLASS"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		</button>
		<div class="dropdown dropdown-end p-2 sm:p-0 h-fit w-fit">
			<div class="flex-none">
				<button class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-10 h-10 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</button>
			</div>
			<ul
				tabindex="-1"
				class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-secondary rounded-box w-52"
			>
				<li><a href="https://orcfax.io/">Main Site</a></li>
				<li><a href="https://docs.orcfax.io/">Docs</a></li>
				<li><a href="https://explorer.orcfax.io/">Explorer</a></li>
				<li><a href="https://github.com/orcfax">GitHub</a></li>
				<li><a href="https://discord.com/invite/UbAeRuNzDu">Discord</a></li>
				<li><a href="https://twitter.com/orcfax">Twitter</a></li>
				<li><a href="https://medium.com/@orcfax">Medium</a></li>
			</ul>
		</div>
	</div>
</header>
