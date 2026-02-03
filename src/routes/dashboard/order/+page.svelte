<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';

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

	// UI Objects for Select Binding
	let selectedCategoryOption: { value: string; label: string } | undefined;
	let selectedServiceOption: { value: string; label: string } | undefined;

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

	// Auto select first service logic
	$: {
		const categoryHasServices = categoryServices.length > 0;
		const currentServiceInList = categoryServices.find((s) => s.service == selectedServiceId);

		if (selectedCategory && categoryHasServices && !currentServiceInList) {
			selectedServiceId = categoryServices[0].service;
		}
	}

	// Sync UI from Logic (One-way sync to avoid cycles if possible, or careful two-way)
	$: if (selectedCategory && selectedCategoryOption?.value !== selectedCategory) {
		selectedCategoryOption = { value: selectedCategory, label: selectedCategory };
	}

	$: if (selectedServiceId && selectedServiceOption?.value !== String(selectedServiceId)) {
		const s = services.find((x) => x.service == selectedServiceId);
		if (s) {
			selectedServiceOption = {
				value: String(s.service),
				label: `${s.service} - ${s.name} - $${s.rate}/1k`
			};
		} else {
			selectedServiceOption = undefined;
		}
	}

	$: totalCharge = selectedService ? ((selectedService.rate * quantity) / 1000).toFixed(4) : 0;

	function onCategoryChange(v: any) {
		if (!v) return;
		selectedCategoryOption = v; // Update UI
		selectedCategory = v.value; // Update Logic
	}

	function onServiceChange(v: any) {
		if (!v) return;
		selectedServiceOption = v; // Update UI
		selectedServiceId = v.value; // Update Logic
	}

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
	<h1 class="text-3xl font-bold tracking-tight">New Order</h1>

	{#if loading}
		<div class="space-y-4">
			<div class="h-10 w-full animate-pulse rounded bg-gray-200"></div>
			<div class="h-10 w-full animate-pulse rounded bg-gray-200"></div>
		</div>
	{:else}
		<Card.Root>
			<Card.Content class="space-y-6 pt-6">
				{#if errorMsg}
					<Alert.Root variant="destructive">
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>{errorMsg}</Alert.Description>
					</Alert.Root>
				{/if}
				{#if message}
					<Alert.Root variant="default" class="border-green-200 bg-green-50 text-green-700">
						<Alert.Title>Success</Alert.Title>
						<Alert.Description>{message}</Alert.Description>
					</Alert.Root>
				{/if}

				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<!-- Category -->
					<div class="space-y-2">
						<Label>Category</Label>
						<Select.Root selected={selectedCategoryOption} onSelectedChange={onCategoryChange}>
							<Select.Trigger class="w-full">
								{selectedCategoryOption?.label ?? 'Select Category'}
							</Select.Trigger>
							<Select.Content class="max-h-[300px]">
								{#each categories as cat}
									<Select.Item value={cat} label={cat}>{cat}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Service -->
					<div class="space-y-2">
						<Label>Service</Label>
						<Select.Root selected={selectedServiceOption} onSelectedChange={onServiceChange}>
							<Select.Trigger class="h-auto w-full py-2">
								<div class="flex flex-col items-start text-left">
									{#if selectedServiceOption}
										<span class="font-medium"
											>{selectedServiceOption.label.split(' - ')[1] ||
												selectedServiceOption.label}</span
										>
										<span class="text-muted-foreground text-xs">{selectedServiceOption.label}</span>
									{:else}
										"Select Service"
									{/if}
								</div>
							</Select.Trigger>
							<Select.Content class="max-h-[300px]">
								{#each categoryServices as service}
									<Select.Item
										value={String(service.service)}
										label={`${service.service} - ${service.name} - $${service.rate}/1k`}
									>
										<span class="font-medium">{service.service}</span> - {service.name} -
										<span class="text-muted-foreground">${service.rate}/1k</span>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if selectedService}
							<p class="text-muted-foreground text-sm">
								Min: {selectedService.min} | Max: {selectedService.max}
							</p>
						{/if}
					</div>

					<!-- Link -->
					<div class="space-y-2">
						<Label for="link">Link</Label>
						<Input id="link" type="url" required bind:value={link} placeholder="https://..." />
					</div>

					<!-- Quantity -->
					<div class="space-y-2">
						<Label for="quantity">Quantity</Label>
						<Input
							id="quantity"
							type="number"
							required
							bind:value={quantity}
							min={selectedService?.min}
							max={selectedService?.max}
						/>
					</div>

					<!-- Total -->
					<div class="bg-secondary flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<span class="font-medium">Total Charge:</span>
						<span class="text-primary text-xl font-bold">${totalCharge}</span>
					</div>

					<Button type="submit" class="w-full" disabled={submitting}>
						{submitting ? 'Placing Order...' : 'Submit Order'}
					</Button>
				</form>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
