<template>
	<button
		class="rounded block text-gray-300 bg-slate-600 px-3 py-1 shadow-md border border-transparent text-center focus:outline-none active:outline-none"
		draggable="false"
		@click.prevent="goToPage"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{ path: string }>();
const router = useRouter();

const goToPage = () => router.push(props.path);
</script>
