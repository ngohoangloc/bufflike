<script lang="ts">
	import { onMount } from 'svelte';

	let balance: any = null;
	let loading = true;

	onMount(async () => {
		try {
			const res = await fetch('/api/balance');
			balance = await res.json();
		} catch (e) {
			console.error('Failed to load balance', e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Balance Card -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="text-sm font-medium text-gray-500 uppercase">Current Balance</h3>
			{#if loading}
				<div class="mt-2 animate-pulse text-2xl font-semibold text-gray-700">Loading...</div>
			{:else if balance}
				<div class="mt-2 text-3xl font-bold text-green-600">
					{balance.balance} <span class="text-lg text-gray-500">{balance.currency}</span>
				</div>
			{:else}
				<div class="mt-2 text-red-500">Error loading balance</div>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div class="rounded-lg bg-white p-6 shadow sm:col-span-2">
			<h3 class="text-sm font-medium text-gray-500 uppercase">Quick Actions</h3>
			<div class="mt-4 flex space-x-4">
				<a
					href="/dashboard/order"
					class="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
				>
					New Order
				</a>
				<a
					href="/dashboard/services"
					class="rounded bg-indigo-100 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-200"
				>
					View Services
				</a>
				<a
					href="/dashboard/history"
					class="rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
				>
					Order History
				</a>
			</div>
		</div>
	</div>
</div>
