<script lang="ts">
	import { goto } from '$app/navigation';

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

<div class="flex min-h-[80vh] items-center justify-center">
	<div class="w-full max-w-md space-y-6 rounded bg-white p-8 shadow-md">
		<h2 class="text-center text-2xl font-bold text-gray-900">Create a new account</h2>
		{#if errorMsg}
			<div class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500">{errorMsg}</div>
		{/if}
		{#if msg}
			<div class="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-500">
				{msg}
			</div>
		{/if}
		<form class="space-y-4" on:submit|preventDefault={handleRegister}>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
				<input
					id="email"
					type="email"
					required
					bind:value={email}
					class="mt-1 w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					id="password"
					type="password"
					required
					bind:value={password}
					class="mt-1 w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>
			<div>
				<label for="confirm-password" class="block text-sm font-medium text-gray-700"
					>Confirm Password</label
				>
				<input
					id="confirm-password"
					type="password"
					required
					bind:value={confirmPassword}
					class="mt-1 w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			>
				{loading ? 'Creating account...' : 'Sign up'}
			</button>
		</form>
		<div class="text-center text-sm">
			<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500"
				>Already have an account? Sign in</a
			>
		</div>
	</div>
</div>
