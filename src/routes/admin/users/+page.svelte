<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	function timeAgo(dateStr: string): string {
		const diff = Date.now() - new Date(dateStr).getTime();
		const days = Math.floor(diff / 86400000);
		if (days === 0) return 'Hari ini';
		if (days < 30) return `${days} hari lalu`;
		return `${Math.floor(days / 30)} bulan lalu`;
	}

	const roleColors: Record<string, string> = {
		admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
		user: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
		banned: 'bg-red-500/20 text-red-400 border-red-500/30'
	};
</script>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Manajemen User</h2>
	<p class="text-sm text-slate-600 dark:text-slate-400">Total: {data.users.length} pengguna terdaftar</p>
</div>

{#if form?.error}
	<div class="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{form.error}</div>
{/if}
{#if form?.success}
	<div class="mb-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm">Role berhasil diubah!</div>
{/if}

<div class="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
	<table class="w-full text-left">
		<thead class="bg-white dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 text-xs uppercase border-b border-slate-200 dark:border-slate-800">
			<tr>
				<th class="p-4 font-medium">User</th>
				<th class="p-4 font-medium">Role</th>
				<th class="p-4 font-medium">Bergabung</th>
				<th class="p-4 font-medium text-right">Aksi</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-slate-800">
			{#each data.users as user (user.id)}
				<tr class="hover:bg-slate-100 dark:bg-slate-800/50 transition-colors">
					<td class="p-4">
						<div class="flex items-center gap-3">
							{#if user.avatarUrl}
								<img src={user.avatarUrl} alt="" class="w-8 h-8 rounded-full object-cover">
							{:else}
								<div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">{user.username[0].toUpperCase()}</div>
							{/if}
							<div>
								<div class="font-medium text-slate-900 dark:text-white text-sm">{user.displayName || user.username}</div>
								<div class="text-xs text-slate-500">@{user.username}</div>
							</div>
						</div>
					</td>
					<td class="p-4">
						<span class="px-2 py-1 rounded text-xs font-bold border {roleColors[user.role || 'user']}">{user.role || 'user'}</span>
					</td>
					<td class="p-4 text-sm text-slate-600 dark:text-slate-400">{timeAgo(String(user.createdAt))}</td>
					<td class="p-4 text-right">
						<form method="POST" action="?/setRole" use:enhance class="inline-flex gap-1">
							<input type="hidden" name="userId" value={user.id}>
							<select name="role" class="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white appearance-none">
								<option value="user" selected={user.role === 'user'}>User</option>
								<option value="admin" selected={user.role === 'admin'}>Admin</option>
								<option value="banned" selected={user.role === 'banned'}>Banned</option>
							</select>
							<button type="submit" class="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-slate-900 dark:text-white text-xs font-bold rounded-lg transition-colors">Set</button>
						</form>
					</td>
				</tr>
			{:else}
				<tr><td colspan="4" class="p-8 text-center text-slate-500">Belum ada user terdaftar.</td></tr>
			{/each}
		</tbody>
	</table>
</div>
