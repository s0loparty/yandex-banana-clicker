<template>
	<button
		class="w-full rounded block text-gray-300 bg-slate-600 px-3 text-left py-1 shadow-md border border-transparent focus:outline-none active:outline-none"
		draggable="false"
		@click.prevent="goToPage"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'vue-router';

const props = defineProps<{ path: string }>();

const router = useRouter();
const userStore = useUserStore();

const goToPage = () => {
	userStore.toggleNavigation(false);
	router.push(props.path);
};
</script>
