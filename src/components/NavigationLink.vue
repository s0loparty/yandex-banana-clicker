<template>
	<button
		draggable="false"
		:class="[
			'rounded block text-gray-300 bg-slate-600 text-left py-1 shadow-md border border-transparent focus:outline-none active:outline-none',
			playerStore.playerMobileLandscape ? 'px-1 text-sm' : 'px-3',
		]"
		:style="{ width: playerStore.playerMobileLandscape ? 'max-content' : '100%' }"
		@click.prevent="goToPage"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useRouter } from 'vue-router';

const props = defineProps<{ path: string }>();

const router = useRouter();
const playerStore = usePlayerStore();

const goToPage = () => {
	playerStore.toggleNavigation(false);
	router.push(props.path);
};
</script>
