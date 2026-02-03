<script lang="ts">
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';

	let services: any[] = [];
	let loading = true;
	let searchTerm = '';
	let categoryFilter = 'All';

	// UI Object for Select
	let categoryFilterOption = { value: 'All', label: 'All' };

	onMount(async () => {
		try {
			const res = await fetch('/api/services');
			services = await res.json();
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	$: categories = ['All', ...new Set(services.map((s) => s.category))];

	$: filteredServices = services.filter((service) => {
		const matchesSearch =
			service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.service.toString().includes(searchTerm);
		const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	function onCategoryChange(v: any) {
		if (!v) return;
		categoryFilterOption = v;
		categoryFilter = v.value;
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-3xl font-bold tracking-tight">Services</h1>
		<div class="flex flex-col gap-2 sm:flex-row">
			<div class="w-full sm:w-64">
				<Input type="text" placeholder="Search services..." bind:value={searchTerm} />
			</div>
			<div class="w-full sm:w-48">
				<Select.Root selected={categoryFilterOption} onSelectedChange={onCategoryChange}>
					<Select.Trigger class="w-full">
						{categoryFilterOption?.label ?? 'Category'}
					</Select.Trigger>
					<Select.Content class="max-h-[300px]">
						{#each categories as cat}
							<Select.Item value={cat} label={cat}>{cat}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="text-muted-foreground py-10 text-center">Loading services...</div>
	{:else}
		<div class="rounded-md border bg-white">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>ID</Table.Head>
						<Table.Head>Service</Table.Head>
						<Table.Head>Category</Table.Head>
						<Table.Head class="text-right">Rate (per 1k)</Table.Head>
						<Table.Head class="text-right">Min / Max</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredServices as service}
						<Table.Row>
							<Table.Cell>{service.service}</Table.Cell>
							<Table.Cell class="font-medium">{service.name}</Table.Cell>
							<Table.Cell>{service.category}</Table.Cell>
							<Table.Cell class="text-right">${service.rate}</Table.Cell>
							<Table.Cell class="text-muted-foreground text-right"
								>{service.min} / {service.max}</Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
