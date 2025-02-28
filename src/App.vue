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
import { computed, onMounted, ref } from 'vue';
import { useYandexSDKStore } from './stores/useYandexSDKStore';
import { useRouter } from 'vue-router';
import disableContextmenu from './helpers/disable-contextmenu';
import bananImage from '@/assets/images/banana.png';
import usePreloadMedia from './composable/usePreloadMedia';
import TheBackground from '@/components/TheBackground.vue';

const router = useRouter();
const { preloadMedia } = usePreloadMedia();
const { initPlayer } = useYandexSDKStore();

const isShowApp = ref(false);

const checkLoading = setTimeout(loadApp, 1000);

async function loadApp() {
	clearInterval(checkLoading);

	await initPlayer();

	router.push('/');

	isShowApp.value = true;
}

const layoutName = computed(() => {
	const layout = router.currentRoute.value.meta?.layout;
	return layout ? `${layout}Layout` : 'MainLayout';
});

onMounted(() => {
	disableContextmenu();
	preloadMedia();
});
</script>
