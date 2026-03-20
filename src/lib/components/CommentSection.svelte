<script lang="ts">
	import { enhance } from '$app/forms';

	let { comments = [], user = null } = $props<{
		comments?: any[];
		user?: any;
	}>();

	// Reset textarea parameter after successful POST server action
	function submitEnhance() {
		return async ({ update }: any) => {
			await update({ reset: true });
		};
	}
</script>

<div class="mt-8 mb-16 w-full max-w-3xl mx-auto px-4">
	<h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 text-purple-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
			/></svg
		>
		Kolom Diskusi ({comments.length})
	</h3>

	<!-- Kotak Tulis Komentar -->
	<div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 mb-8 shadow-lg">
		{#if user}
			<div class="flex gap-3 md:gap-4 flex-col sm:flex-row">
				<div
					class="w-10 h-10 rounded-full bg-purple-900/50 hidden sm:flex shrink-0 items-center justify-center text-purple-400 font-bold border border-purple-500/20 uppercase"
				>
					{user.username.slice(0, 2)}
				</div>
				<form action="?/addComment" method="POST" use:enhance={submitEnhance} class="w-full">
					<textarea
						name="content"
						rows="3"
						required
						placeholder="Wah, adegannya seru banget... (Tulis diskusi Anda)"
						class="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none shadow-inner"
					></textarea>
					<div class="flex justify-end mt-3">
						<button
							type="submit"
							class="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-lg transition-transform active:scale-95 shadow-lg shadow-purple-900/20 flex items-center gap-2"
						>
							Kirim Posting
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
								><path
									d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
								/></svg
							>
						</button>
					</div>
				</form>
			</div>
		{:else}
			<div
				class="py-8 text-center bg-slate-950/50 rounded-lg border border-dashed border-slate-800"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-12 w-12 text-slate-600 mx-auto mb-3"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/></svg
				>
				<p class="text-slate-400 mb-4 text-sm">
					Anda harus menjadi anggota untuk ikut berdiskusi.
				</p>
				<a
					href="/login"
					class="inline-block bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-2 px-6 rounded-lg transition-colors"
				>
					Login via Akun
				</a>
			</div>
		{/if}
	</div>

	<!-- Daftar Ulasan Chat Thread -->
	<div class="flex flex-col gap-5">
		{#each comments as comment}
			<div class="flex gap-4">
				<div
					class="w-10 h-10 rounded-full flex shrink-0 items-center justify-center font-bold text-sm uppercase {comment
						.user.role === 'admin'
						? 'bg-rose-900/50 text-rose-400 border border-rose-500/20'
						: 'bg-slate-800 text-slate-300 border border-slate-700'}"
				>
					{comment.user.username.slice(0, 2)}
				</div>
				<div
					class="flex-1 min-w-0 bg-slate-900 border border-slate-800 p-4 rounded-xl rounded-tl-sm relative group"
				>
					<div class="flex items-center gap-2 mb-1.5 flex-wrap">
						<span class="font-bold text-slate-200">{comment.user.username}</span>
						{#if comment.user.role === 'admin'}
							<span
								class="bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded font-black border border-rose-500/20 tracking-wider"
								>ADMIN</span
							>
						{/if}
						<span class="text-xs text-slate-500 ml-auto"
							>{new Date(comment.createdAt).toLocaleDateString('id-ID', {
								day: 'numeric',
								month: 'short',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}</span
						>
					</div>
					<p class="text-slate-400 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">
						{comment.content}
					</p>
				</div>
			</div>
		{:else}
			<div class="text-center py-10 text-slate-600 font-medium">
				Krik.. krik.. Belum ada orang yang mengomentari sejauh ini. Jadilah yang pertama!
			</div>
		{/each}
	</div>
</div>
