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
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import disableContextmenu from './helpers/disable-contextmenu';
import bananImage from '@/assets/images/banana.png';
import usePreloadMedia from './composable/usePreloadMedia';
import TheBackground from '@/components/TheBackground.vue';
import { usePlayerStore } from './stores/usePlayerStore';
import { useYandexSDKStore } from './stores/useYandexSDKStore';

const router = useRouter();
const { preloadMedia } = usePreloadMedia();
const ps = usePlayerStore();
const yaStore = useYandexSDKStore();

const isShowApp = ref(false);

const layoutName = computed(() => {
	const layout = router.currentRoute.value.meta?.layout;
	return layout ? `${layout}Layout` : 'MainLayout';
});

watch(
	() => yaStore.isReady,
	(isReady) => {
		if (isReady) {
			isShowApp.value = true;
			router.push('/');
			yaStore.ysdk?.features.LoadingAPI.ready();
		}
	},
	{
		once: true,
	}
);

onMounted(() => {
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
