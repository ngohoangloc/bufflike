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
	let confirmPassword = '';
	let loading = false;
	let errorMsg = '';
	let msg = '';

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			errorMsg = 'Passwords do not match';
			return;
		}
		loading = true;
		errorMsg = '';
		msg = '';

		console.log('Attempting verify/signup with:', email);
		const { data: signUpData, error } = await supabase.auth.signUp({
			email,
			password
		});

		console.log('SignUp Result:', { signUpData, error });

		if (error) {
			console.error('SignUp Error:', error);
			errorMsg = error.message;
		} else {
			msg = 'Registration successful! Check your email for verification.';
		}
		loading = false;
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-center text-2xl font-bold">Create Account</Card.Title>
			<Card.Description class="text-center">
				Enter your details below to create your account
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if errorMsg}
				<Alert.Root variant="destructive" class="mb-4">
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{errorMsg}</Alert.Description>
				</Alert.Root>
			{/if}
			{#if msg}
				<Alert.Root variant="default" class="mb-4 border-green-200 bg-green-50 text-green-700">
					<Alert.Title>Success</Alert.Title>
					<Alert.Description>{msg}</Alert.Description>
				</Alert.Root>
			{/if}
			<form on:submit|preventDefault={handleRegister} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required bind:value={email} />
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" required bind:value={password} />
				</div>
				<div class="space-y-2">
					<Label for="confirm-password">Confirm Password</Label>
					<Input id="confirm-password" type="password" required bind:value={confirmPassword} />
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Creating account...' : 'Sign up'}
				</Button>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<div class="text-sm text-gray-500">
				Already have an account? <a href="/login" class="text-primary hover:underline">Sign in</a>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
