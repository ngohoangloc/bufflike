<script lang="ts">
	import { onMount } from 'svelte';

	let services: any[] = [];
	let loading = true;
	let searchTerm = '';
	let categoryFilter = 'All';

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
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Services</h1>
		<div class="flex space-x-2">
			<input
				type="text"
				placeholder="Search services..."
				bind:value={searchTerm}
				class="rounded-md border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
			/>
			<select
				bind:value={categoryFilter}
				class="max-w-xs rounded-md border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
			>
				{#each categories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
		</div>
	</div>

	{#if loading}
		<div class="py-10 text-center text-gray-500">Loading services...</div>
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
							>Service</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Category</th
						>
						<th
							class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Rate (per 1k)</th
						>
						<th
							class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Min / Max</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each filteredServices as service}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{service.service}</td>
							<td class="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{service.category}</td>
							<td class="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900"
								>${service.rate}</td
							>
							<td class="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500"
								>{service.min} / {service.max}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
