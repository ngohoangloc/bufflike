<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	let { session, supabase, user } = data;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="min-h-screen bg-gray-50 font-sans text-gray-900">
	<header class="bg-white shadow">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<h1 class="text-xl font-bold text-indigo-600">BuffLike Panel</h1>
			<nav class="flex space-x-4">
				{#if user}
					<a href="/dashboard" class="text-gray-600 hover:text-indigo-600">Dashboard</a>
					<a href="/dashboard/services" class="text-gray-600 hover:text-indigo-600">Services</a>
					<a href="/dashboard/order" class="text-gray-600 hover:text-indigo-600">New Order</a>
					<a href="/dashboard/history" class="text-gray-600 hover:text-indigo-600">History</a>
					<form method="POST" action="/logout" class="inline">
						<button type="submit" class="text-red-500 hover:text-red-700">Logout</button>
					</form>
				{:else}
					<a href="/login" class="text-gray-600 hover:text-indigo-600">Login</a>
					<a href="/register" class="text-gray-600 hover:text-indigo-600">Register</a>
				{/if}
			</nav>
		</div>
	</header>
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>
