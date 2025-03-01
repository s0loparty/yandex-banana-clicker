<template>
	<button
		v-show="isVisible"
		class="z-50 transition-all fixed p-4 sm:py-2 sm:px-3 flex items-center gap-x-2 rounded-full bottom-2 right-2 sm:bottom-10 sm:right-10 sm:bg-black/70 shadow-[0_0_5px] bg-yellow-400/80"
		@click="click"
	>
		<div>
			<XMarkIcon
				v-show="userStore.showNavigation"
				class="size-6 sm:size-8 stroke-black sm:stroke-white"
			/>
			<Bars3Icon
				v-show="!userStore.showNavigation"
				class="size-6 sm:size-8 stroke-black sm:stroke-white"
			/>
		</div>
		<span class="hidden sm:block text-xl uppercase text-white">меню</span>
	</button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore';
import { useYandexSDKStore } from '@/stores/useYandexSDKStore';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { onMounted, onUnmounted, ref } from 'vue';

const userStore = useUserStore();
const yaStore = useYandexSDKStore();

const isVisible = ref(true);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const click = () => {
	userStore.toggleNavigation();
	resetTimer();
};

const resetTimer = () => {
	if (!yaStore.ysdk?.deviceInfo.isMobile()) {
		return;
	}

	isVisible.value = true;
	if (timeoutId) clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		isVisible.value = false;
	}, 3000); // Скрываем кнопку через 3 секунды бездействия
};

onMounted(() => {
	document.addEventListener('touchstart', resetTimer);
	document.addEventListener('click', resetTimer);
	resetTimer();
});

onUnmounted(() => {
	document.removeEventListener('touchstart', resetTimer);
	document.removeEventListener('click', resetTimer);
	if (timeoutId) clearTimeout(timeoutId);
});
</script>
