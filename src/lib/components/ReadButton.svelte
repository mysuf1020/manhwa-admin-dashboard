<script lang="ts">
	import { base } from '$app/paths';
	let { slug, chapterNumber } = $props<{
		slug: string;
		chapterNumber: string;
	}>();
</script>

<!-- eslint-disable-next-line -->
<a
	href="{base}/comic/{slug}/{chapterNumber}"
	class="mt-4 bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white font-bold py-3 px-4 rounded-lg block w-full text-center transition-colors"
>
	Mulai Baca (Ch. {chapterNumber})
</a>
