<script lang="ts">
	/**
	 * AdBanner - Komponen iklan fleksibel yang mendukung:
	 * 1. Script Code (AdSense / HTML embed) → diprioritaskan
	 * 2. Image Banner dengan link clickable
	 * 3. Otomatis disembunyikan untuk user VIP (ad-free)
	 */

	interface AdData {
		id: number;
		title: string;
		imageUrl: string | null;
		scriptCode: string | null;
		linkUrl: string | null;
		positionType: string;
		isActive: boolean;
	}

	let {
		ads = [],
		position,
		isVip = false
	}: {
		ads?: AdData[];
		position: string;
		isVip?: boolean;
	} = $props();

	// Filter hanya iklan aktif di posisi yang diminta
	const filtered = $derived(
		ads.filter((a: AdData) => a.positionType === position && a.isActive)
	);
</script>

{#if !isVip && filtered.length > 0}
	<div class="ad-banner-slot my-4">
		{#each filtered as ad (ad.id)}
			<div class="ad-unit rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm mb-3 relative group">
				<!-- Label transparan kecil -->
				<span class="absolute top-1 right-1 text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest z-10 bg-white/60 dark:bg-slate-950/60 px-1.5 py-0.5 rounded">Ad</span>

				{#if ad.scriptCode}
					<!-- Render raw HTML/AdSense script -->
					<div class="ad-script-container p-2 min-h-[90px] flex items-center justify-center">
						{@html ad.scriptCode}
					</div>
				{:else if ad.imageUrl}
					<!-- Render image banner -->
					{#if ad.linkUrl}
						<a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" class="block">
							<img src={ad.imageUrl} alt={ad.title} class="w-full h-auto max-h-[250px] object-cover transition-transform group-hover:scale-[1.01]" loading="lazy" />
						</a>
					{:else}
						<img src={ad.imageUrl} alt={ad.title} class="w-full h-auto max-h-[250px] object-cover" loading="lazy" />
					{/if}
				{/if}
			</div>
		{/each}
	</div>
{/if}
