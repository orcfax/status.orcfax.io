<script lang="ts">
	import DiscordIcon from '$lib/icons/DiscordIcon.svelte';
	import GithubIcon from '$lib/icons/GithubIcon.svelte';
	import MediumIcon from '$lib/icons/MediumIcon.svelte';
	import OpenLink from '$lib/icons/OpenLink.svelte';
	import TwitterIcon from '$lib/icons/TwitterIcon.svelte';
	import orcfaxLogo from '$lib/images/orcfax_logo.png';

	const currentYear = new Date().getFullYear();
</script>

<footer
	style="background-color: #1F2421; color: #EFF5F5;"
	class="flex flex-col md:flex-row justify-between items-center w-full p-2"
>
	<div class="flex items-center gap-2">
		<a href="https://orcfax.io">
			<img class="w-12 bg-primary rounded-full" src={orcfaxLogo} alt="Orcfax Logo" />
		</a>

		<p class="text-sm font-medium">Copyright © Orcfax Ltd. ${currentYear}</p>
	</div>

	<div class="flex flex-col xs:flex-row items-center justify-center gap-4">
		<div class="flex gap-4">
			<a
				class="flex items-center gap-1 hover:underline"
				href="https://explorer.orcfax.io"
				target="_blank"
			>
				<p class="text-lg font-semibold">Explorer</p>
				<OpenLink />
			</a>

			<a
				class="flex items-center gap-1 hover:underline"
				href="https://docs.orcfax.io"
				target="_blank"
			>
				<p class="text-lg font-semibold">Docs</p>
				<OpenLink />
			</a>
		</div>
		<div class="flex gap-4 pr-2">
			<a href="https://discord.com/invite/UbAeRuNzDu" target="_blank">
				<DiscordIcon width={'40'} height={'40'} />
			</a>
			<a href="https://twitter.com/orcfax" target="_blank">
				<TwitterIcon width={'40'} height={'40'} />
			</a>
			<a href="https://medium.com/@orcfax" target="_blank">
				<MediumIcon width={'40'} height={'40'} />
			</a>
			<a href="https://github.com/orcfax" target="_blank">
				<GithubIcon width={'40'} height={'40'} />
			</a>
		</div>
	</div>
</footer>
