<template>
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
import { onUnmounted, ref, watchEffect } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'vue-router';
import { useYandexSDK } from './composable/useYandexSDK';
import bananImage from '@/assets/images/banana.png';

const storeUser = useUserStore();
const { initPlayer } = useYandexSDK();
const router = useRouter();

const layoutName = ref('MainLayout');
const isShowApp = ref(false);

const checkLoading = setTimeout(loadApp, 1000);

async function loadApp() {
	clearInterval(checkLoading);

	await initPlayer();

	router.push('/');

	isShowApp.value = true;
}

watchEffect(() => {
	const layout = router.currentRoute.value.meta?.layout;
	layoutName.value = layout ? `${layout}Layout` : 'MainLayout';
});

onUnmounted(storeUser.savePlayerStats);
</script>
