<script lang="ts">
	import { goto } from '$app/navigation';

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

<div class="flex min-h-[80vh] items-center justify-center">
	<div class="w-full max-w-md space-y-6 rounded bg-white p-8 shadow-md">
		<h2 class="text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>
		{#if errorMsg}
			<div class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500">{errorMsg}</div>
		{/if}
		<form class="space-y-4" on:submit|preventDefault={handleLogin}>
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
			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
		<div class="text-center text-sm">
			<a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500"
				>Don't have an account? Sign up</a
			>
		</div>
	</div>
</div>
