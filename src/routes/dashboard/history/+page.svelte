<script lang="ts">
	import { onMount } from 'svelte';

	let orders: any[] = [];
	let loading = true;

	onMount(async () => {
		try {
			const res = await fetch('/api/history');
			if (res.ok) {
				orders = await res.json();
			}
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	const statusColors: Record<string, string> = {
		Pending: 'bg-yellow-100 text-yellow-800',
		Processing: 'bg-blue-100 text-blue-800',
		'In progress': 'bg-blue-100 text-blue-800',
		Completed: 'bg-green-100 text-green-800',
		Partial: 'bg-orange-100 text-orange-800',
		Canceled: 'bg-red-100 text-red-800'
	};
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-gray-900">Order History</h1>

	{#if loading}
		<div class="py-10 text-center">Loading history...</div>
	{:else if orders.length === 0}
		<div class="py-10 text-center text-gray-500">No orders found.</div>
	{:else}
		<div class="overflow-x-auto rounded-lg bg-white shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>ID</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Date</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Service</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Link</th
						>
						<th
							class="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Quantity</th
						>
						<th
							class="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Charge</th
						>
						<th
							class="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Status</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each orders as order}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{order.smm_order_id}</td
							>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{new Date(order.created_at).toLocaleDateString()}
							</td>
							<td
								class="max-w-xs truncate px-6 py-4 text-sm text-gray-900"
								title={order.service_name}
							>
								{order.service_name}
							</td>
							<td class="max-w-xs truncate px-6 py-4 text-sm text-indigo-600">
								<a href={order.link} target="_blank" rel="noopener noreferrer">{order.link}</a>
							</td>
							<td class="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-900"
								>{order.quantity}</td
							>
							<td class="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-900"
								>${order.charge}</td
							>
							<td class="px-6 py-4 text-center whitespace-nowrap">
								<span
									class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
								>
									{order.status}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
