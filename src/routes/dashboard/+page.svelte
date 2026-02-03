<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

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
	<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Balance Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-muted-foreground text-sm font-medium uppercase"
					>Current Balance</Card.Title
				>
			</Card.Header>
			<Card.Content>
				{#if loading}
					<div class="animate-pulse text-2xl font-bold">Loading...</div>
				{:else if balance}
					<div class="text-3xl font-bold text-green-600">
						{balance.balance} <span class="text-muted-foreground text-lg">{balance.currency}</span>
					</div>
				{:else}
					<div class="text-red-500">Error loading balance</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Quick Actions -->
		<Card.Root class="sm:col-span-2">
			<Card.Header>
				<Card.Title class="text-muted-foreground text-sm font-medium uppercase"
					>Quick Actions</Card.Title
				>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-wrap gap-4">
					<Button href="/dashboard/order">New Order</Button>
					<Button variant="secondary" href="/dashboard/services">View Services</Button>
					<Button variant="outline" href="/dashboard/history">Order History</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
