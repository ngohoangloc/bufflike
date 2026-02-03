<script lang="ts">
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';

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
		Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
		Processing: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
		'In progress': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
		Completed: 'bg-green-100 text-green-800 hover:bg-green-100',
		Partial: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
		Canceled: 'bg-red-100 text-red-800 hover:bg-red-100'
	};
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold tracking-tight">Order History</h1>

	{#if loading}
		<div class="text-muted-foreground py-10 text-center">Loading history...</div>
	{:else if orders.length === 0}
		<div class="text-muted-foreground py-10 text-center">No orders found.</div>
	{:else}
		<div class="rounded-md border bg-white">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>ID</Table.Head>
						<Table.Head>Date</Table.Head>
						<Table.Head>Service</Table.Head>
						<Table.Head>Link</Table.Head>
						<Table.Head class="text-center">Quantity</Table.Head>
						<Table.Head class="text-right">Charge</Table.Head>
						<Table.Head class="text-center">Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each orders as order}
						<Table.Row>
							<Table.Cell>{order.smm_order_id}</Table.Cell>
							<Table.Cell>{new Date(order.created_at).toLocaleDateString()}</Table.Cell>
							<Table.Cell class="max-w-[250px] truncate" title={order.service_name}>
								{order.service_name}
							</Table.Cell>
							<Table.Cell class="max-w-[200px] truncate">
								<a
									href={order.link}
									target="_blank"
									rel="noopener noreferrer"
									class="text-primary hover:underline"
								>
									{order.link}
								</a>
							</Table.Cell>
							<Table.Cell class="text-center">{order.quantity}</Table.Cell>
							<Table.Cell class="text-right">${order.charge}</Table.Cell>
							<Table.Cell class="text-center">
								<Badge variant="outline" class={`border-0 ${statusColors[order.status] || ''}`}>
									{order.status}
								</Badge>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
