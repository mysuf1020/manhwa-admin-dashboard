<script lang="ts">
	import { enhance } from '$app/forms';

	interface Comment {
		id: number;
		content: string;
		createdAt: Date;
		parentId: number | null;
		user: { id: string; username: string; role: string | null; level?: number };
	}

	let { comments = [], user = null } = $props<{
		comments?: Comment[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		user?: any;
	}>();

	let replyingTo = $state<number | null>(null);

	// Pisahkan top-level vs replies
	function getTopLevel(): Comment[] {
		return comments.filter((c: Comment) => !c.parentId);
	}

	function getReplies(parentId: number): Comment[] {
		return comments.filter((c: Comment) => c.parentId === parentId);
	}

	function submitEnhance() {
		return async ({ update }: { update: (opts: { reset: boolean }) => Promise<void> }) => {
			await update({ reset: true });
			replyingTo = null;
		};
	}
</script>

<div class="mt-8 mb-16 w-full max-w-3xl mx-auto px-4">
	<h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
		Kolom Diskusi ({comments.length})
	</h3>

	<!-- Rules Komentar (Shinigami Style) -->
	<div class="bg-[#1c1d22] border border-white/5 rounded-xl p-4 md:p-5 mb-6 shadow-xl">
		<div class="flex items-center gap-2 text-yellow-500 font-bold mb-4 border-b border-white/5 pb-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
			Rules Komentar Web MangaReader ID
		</div>
		<ul class="text-[13px] md:text-sm space-y-3 md:space-y-2 text-zinc-400">
			<li class="flex items-start gap-2.5">
				<span class="text-red-500 shrink-0 text-base">🚫</span> 
				<span class="leading-relaxed"><strong class="text-rose-400">Dilarang Toxic, Rasis, atau menimbulkan kerusuhan!</strong><br />Yang ikut kerusuhan bakal <strong class="text-rose-400">kena ban juga!</strong> Jadi diemin aja, cukup <strong class="text-purple-400">laporin ke admin!</strong></span>
			</li>
			<li class="flex items-start gap-2.5">
				<span class="text-orange-500 shrink-0 text-base">🤡</span> 
				<span class="leading-relaxed"><strong class="text-rose-400">Dilarang pakai foto profil cabul!</strong></span>
			</li>
			<li class="flex items-start gap-2.5">
				<span class="text-yellow-500 shrink-0 text-base">🏛️</span> 
				<span class="leading-relaxed"><strong class="text-rose-400 uppercase tracking-wide">Dilarang Komentar Soal Politik!!</strong></span>
			</li>
			<li class="flex items-start gap-2.5">
				<span class="text-purple-500 shrink-0 text-base">🤫</span> 
				<span class="leading-relaxed"><strong class="text-rose-400 uppercase tracking-wide">Dilarang Spoiler Ending!!</strong><br />Cukup 1-2 chapter ke depan aja!</span>
			</li>
		</ul>
		<div class="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1.5 text-xs text-zinc-500 bg-white/5 p-3 rounded-lg">
			<span class="flex gap-2 items-start"><span class="shrink-0">📢</span> <span><strong class="text-zinc-300">Noted:</strong> Yang melanggar rules di atas akan langsung kena BAN! Tanpa peringatan!</span></span>
			<span class="flex gap-2 items-start"><span class="shrink-0">🔒</span> <span>Akun komentarmu akan <strong class="text-rose-400">dibanned permanen</strong> dan <strong class="text-rose-400">tidak bisa balik lagi!!!</strong></span></span>
		</div>
	</div>

	<!-- Kotak Tulis Komentar -->
	<div class="bg-[#131418] border border-white/5 rounded-xl p-4 md:p-5 mb-8 shadow-lg">
		{#if user}
			<form action="?/addComment" method="POST" use:enhance={submitEnhance} class="flex gap-3">
				<div class="w-10 h-10 rounded-full bg-purple-900/50 hidden sm:flex shrink-0 items-center justify-center text-purple-400 font-bold border border-purple-500/20 uppercase">
					{user.username.slice(0, 2)}
				</div>
				<div class="grow">
					<textarea name="content" rows="3" required placeholder="Wah, adegannya seru banget... (Tulis diskusi Anda)" class="w-full bg-[#1a1c23] border border-white/10 rounded-lg p-4 text-zinc-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none shadow-inner"></textarea>
					<div class="flex justify-between items-center mt-3">
						<div class="flex gap-2 text-zinc-500 pt-1">
							<!-- Mock Tool Icons for Shinigami vibe -->
							<button type="button" aria-label="Insert Image" class="hover:text-purple-400 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
							<button type="button" aria-label="Insert Emoji" class="hover:text-purple-400 transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
						</div>
						<button type="submit" class="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-8 rounded-lg transition-transform active:scale-95 shadow-lg shadow-purple-900/40">
							Kirim
						</button>
					</div>
				</div>
			</form>
		{:else}
			<div class="py-10 text-center bg-[#1a1c23] rounded-lg border border-dashed border-white/5">
				<p class="text-zinc-500 mb-5 text-sm">Anda harus login untuk ikut berdiskusi memanaskan suasana.</p>
				<a href="/login" class="inline-block bg-[#242529] hover:bg-[#2d2e34] text-white border border-white/10 font-bold py-2.5 px-8 rounded-lg transition-colors shadow-lg active:scale-95">Login Akun</a>
			</div>
		{/if}
	</div>

	<!-- Daftar Comment Thread dengan Reply -->
	<div class="flex flex-col gap-5">
		{#each getTopLevel() as comment (comment.id)}
			<div class="flex gap-3 md:gap-4">
				<div class="w-10 h-10 rounded-full flex shrink-0 items-center justify-center font-bold text-sm uppercase {comment.user.role === 'admin' ? 'bg-rose-900/50 text-rose-400 border border-rose-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'}">
					{comment.user.username.slice(0, 2)}
				</div>
				<div class="grow min-w-0">
					<div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl rounded-tl-sm">
						<div class="flex items-center gap-2 mb-1.5 flex-wrap">
							<span class="font-bold text-slate-800 dark:text-slate-200">{comment.user.username}</span>
							{#if comment.user.role === 'admin'}
								<span class="bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded font-black border border-rose-500/20 tracking-wider">ADMIN</span>
							{/if}
							<span class="bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">Lv. {comment.user.level || 1}</span>
							<span class="text-xs text-slate-500 ml-auto">{new Date(comment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
						</div>
						<p class="text-slate-600 dark:text-slate-400 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
					</div>
					{#if user}
						<button onclick={() => replyingTo = replyingTo === comment.id ? null : comment.id} class="text-xs text-slate-500 hover:text-purple-400 mt-1.5 ml-2 transition-colors">
							{replyingTo === comment.id ? '✕ Batal' : '↩ Balas'}
						</button>
					{/if}

					<!-- Reply Form -->
					{#if replyingTo === comment.id && user}
						<form action="?/addComment" method="POST" use:enhance={submitEnhance} class="mt-2 ml-2">
							<input type="hidden" name="parentId" value={comment.id}>
							<textarea name="content" rows="2" required placeholder="Tulis balasan..." class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-purple-500 resize-none"></textarea>
							<button type="submit" class="mt-1.5 bg-purple-600/80 hover:bg-purple-500 text-slate-900 dark:text-white text-xs font-semibold py-1.5 px-4 rounded-lg transition-colors">Kirim Balasan</button>
						</form>
					{/if}

					<!-- Replies -->
					{#each getReplies(comment.id) as reply (reply.id)}
						<div class="flex gap-3 mt-3 ml-2 pl-3 border-l-2 border-slate-200 dark:border-slate-800">
							<div class="w-7 h-7 rounded-full flex shrink-0 items-center justify-center font-bold text-[10px] uppercase {reply.user.role === 'admin' ? 'bg-rose-900/50 text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
								{reply.user.username.slice(0, 2)}
							</div>
							<div class="grow min-w-0">
								<div class="flex items-center gap-2 mb-0.5 flex-wrap">
									<span class="font-bold text-slate-700 dark:text-slate-300 text-sm">{reply.user.username}</span>
									{#if reply.user.role === 'admin'}
										<span class="bg-rose-500/20 text-rose-400 text-[9px] px-1.5 py-0.5 rounded font-black">ADMIN</span>
									{/if}
									<span class="bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold border border-indigo-500/20">Lv. {reply.user.level || 1}</span>
									<span class="text-[10px] text-slate-500">{new Date(reply.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
								</div>
								<p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="text-center py-10 text-slate-600 font-medium">
				Krik.. krik.. Belum ada orang yang mengomentari sejauh ini. Jadilah yang pertama!
			</div>
		{/each}
	</div>
</div>
