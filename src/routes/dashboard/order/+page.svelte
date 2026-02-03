<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let services: any[] = [];
	let loading = true;
	let submitting = false;
	let message = '';
	let errorMsg = '';

	// Form data
	let selectedCategory = '';
	let selectedServiceId = '';
	let link = '';
	let quantity = 0;

	onMount(async () => {
		try {
			const res = await fetch('/api/services');
			services = await res.json();
			if (services.length > 0) {
				selectedCategory = services[0].category;
			}
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	$: categories = [...new Set(services.map((s) => s.category))];
	$: categoryServices = services.filter((s) => s.category === selectedCategory);
	$: selectedService = services.find((s) => s.service == selectedServiceId);

	// Auto select first service in category
	$: if (selectedCategory && (!selectedService || selectedService.category !== selectedCategory)) {
		const first = categoryServices[0];
		if (first) selectedServiceId = first.service;
	}

	$: totalCharge = selectedService ? ((selectedService.rate * quantity) / 1000).toFixed(4) : 0;

	const handleSubmit = async () => {
		if (
			!selectedService ||
			quantity < Number(selectedService.min) ||
			quantity > Number(selectedService.max)
		) {
			errorMsg = `Quantity must be between ${selectedService?.min} and ${selectedService?.max}`;
			return;
		}

		submitting = true;
		errorMsg = '';
		message = '';

		try {
			const res = await fetch('/api/order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					service: selectedServiceId,
					service_name: selectedService.name,
					link,
					quantity,
					charge: totalCharge
				})
			});

			const data = await res.json();

			if (res.ok && data.success) {
				message = `Order placed successfully! ID: ${data.order}`;
				link = '';
				quantity = 0;
				// Optional: redirect to history
				setTimeout(() => goto('/dashboard/history'), 1500);
			} else {
				errorMsg = data.error || 'Failed to place order';
			}
		} catch (e) {
			errorMsg = 'Network error occurred';
		} finally {
			submitting = false;
		}
	};
</script>

<div class="mx-auto max-w-2xl space-y-6">
	<h1 class="text-2xl font-bold text-gray-900">New Order</h1>

	{#if loading}
		<div class="text-gray-500">Loading services...</div>
	{:else}
		<form on:submit|preventDefault={handleSubmit} class="space-y-6 rounded-lg bg-white p-6 shadow">
			{#if errorMsg}
				<div class="rounded bg-red-100 p-3 text-red-700">{errorMsg}</div>
			{/if}
			{#if message}
				<div class="rounded bg-green-100 p-3 text-green-700">{message}</div>
			{/if}

			<!-- Category -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Category</label>
				<select
					bind:value={selectedCategory}
					class="mt-1 w-full rounded border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					{#each categories as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>

			<!-- Service -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Service</label>
				<select
					bind:value={selectedServiceId}
					class="mt-1 w-full rounded border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					{#each categoryServices as service}
						<option value={service.service}>
							{service.service} - {service.name} - ${service.rate}/1k
						</option>
					{/each}
				</select>
				{#if selectedService}
					<p class="mt-1 text-sm text-gray-500">
						Min: {selectedService.min} | Max: {selectedService.max}
					</p>
				{/if}
			</div>

			<!-- Link -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Link</label>
				<input
					type="url"
					required
					bind:value={link}
					class="mt-1 w-full rounded border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					placeholder="https://..."
				/>
			</div>

			<!-- Quantity -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Quantity</label>
				<input
					type="number"
					required
					bind:value={quantity}
					min={selectedService?.min}
					max={selectedService?.max}
					class="mt-1 w-full rounded border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>

			<!-- Total Charge -->
			<div class="rounded bg-gray-50 p-4">
				<div class="flex justify-between text-lg font-medium">
					<span>Total Charge:</span>
					<span class="text-indigo-600">${totalCharge}</span>
				</div>
			</div>

			<button
				type="submit"
				disabled={submitting}
				class="w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
			>
				{submitting ? 'Placing Order...' : 'Submit Order'}
			</button>
		</form>
	{/if}
</div>
