<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';

	export let data;
	let { session, supabase, user } = data;

	$: ({ user } = data);

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
	<header class="sticky top-0 z-50 bg-white shadow">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<a href="/" class="text-primary text-xl font-bold">BuffLike Panel</a>
			<nav class="flex items-center space-x-4">
				{#if user}
					<div class="hidden space-x-2 md:flex">
						<Button variant="ghost" href="/dashboard">Dashboard</Button>
						<Button variant="ghost" href="/dashboard/services">Services</Button>
						<Button variant="ghost" href="/dashboard/order">New Order</Button>
						<Button variant="ghost" href="/dashboard/history">History</Button>
					</div>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="ghost" class="relative h-8 w-8 rounded-full">
								<Avatar.Root class="h-8 w-8">
									<Avatar.Image src="" alt={user.email} />
									<Avatar.Fallback>{user.email?.substring(0, 2).toUpperCase()}</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Label class="font-normal">
								<div class="flex flex-col space-y-1">
									<p class="text-sm leading-none font-medium">User</p>
									<p class="text-muted-foreground text-xs leading-none">{user.email}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item href="/dashboard">Dashboard</DropdownMenu.Item>
								<DropdownMenu.Item href="/dashboard/order">New Order</DropdownMenu.Item>
								<DropdownMenu.Item href="/dashboard/history">History</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Item on:click={() => document.getElementById('logout-form').submit()}>
								Log out
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>

					<form method="POST" action="/logout" id="logout-form" class="hidden">
						<button type="submit">Logout</button>
					</form>
				{:else}
					<Button variant="ghost" href="/login">Login</Button>
					<Button href="/register">Register</Button>
				{/if}
			</nav>
		</div>
	</header>
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>
