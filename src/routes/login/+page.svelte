<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';

	export let data;
	let { supabase } = data;

	let email = '';
	let password = '';
	let loading = false;
	let errorMsg = '';

	const handleLogin = async () => {
		loading = true;
		errorMsg = '';
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			errorMsg = error.message;
		} else {
			goto('/dashboard');
		}
		loading = false;
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-center text-2xl font-bold">Login</Card.Title>
			<Card.Description class="text-center">
				Enter your email below to login to your account
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if errorMsg}
				<Alert.Root variant="destructive" class="mb-4">
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{errorMsg}</Alert.Description>
				</Alert.Root>
			{/if}
			<form on:submit|preventDefault={handleLogin} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required bind:value={email} />
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" required bind:value={password} />
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<div class="text-sm text-gray-500">
				Don't have an account? <a href="/register" class="text-primary hover:underline">Sign up</a>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
