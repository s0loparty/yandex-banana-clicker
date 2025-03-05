<template>
	<TheBackground />

	<component
		v-if="isShowApp"
		:is="layoutName"
	>
		<RouterView />
	</component>

	<div
		v-else
		class="h-screen flex items-center justify-center gap-4"
	>
		<img
			v-for="index in 3"
			:key="index"
			:src="bananImage"
			:class="[`w-14 animate-bounce animate-infinite`]"
			:style="`--tw-animate-delay: ${index}00ms`"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import disableContextmenu from './helpers/disable-contextmenu';
import bananImage from '@/assets/images/banana.png';
import usePreloadMedia from './composable/usePreloadMedia';
import TheBackground from '@/components/TheBackground.vue';
import { usePlayerStore } from './stores/usePlayerStore';

const router = useRouter();
const { preloadMedia } = usePreloadMedia();
const ps = usePlayerStore();

const isShowApp = ref(false);

const checkLoading = setTimeout(loadApp, 1000);

async function loadApp() {
	clearInterval(checkLoading);

	router.push('/');

	isShowApp.value = true;
}

const layoutName = computed(() => {
	const layout = router.currentRoute.value.meta?.layout;
	return layout ? `${layout}Layout` : 'MainLayout';
});

onMounted(() => {
	const originalAudio = window.Audio;

	// @ts-ignore
	window.Audio = function () {
		console.warn('Обычный <audio> запрещён! Используй Web Audio API!');
		return new originalAudio();
	};

	disableContextmenu();
	preloadMedia();

	// закрытие страницы
	window.addEventListener('beforeunload', ps.savePlayerStats);
	window.addEventListener('resize', ps.changePlayerMobileLandscape);
});

onUnmounted(() => {
	window.removeEventListener('resize', ps.changePlayerMobileLandscape);
});
</script>
