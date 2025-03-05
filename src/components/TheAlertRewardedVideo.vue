<template>
	<div
		:class="[
			'fixed top-12 left-2 right-2 sm:right-auto sm:top-14 sm:left-3 transition-opacity',
			isShowAlert ? 'opacity-100' : 'opacity-0',
			playerStore.playerMobileLandscape ? 'top-14' : 'md:top-auto md:bottom-3',
		]"
	>
		<div
			class="rounded-md flex bg-green-600/95 items-center justify-between gap-4 px-4 py-2 text-white"
		>
			<div>
				<div class="font-semibold">Хочешь получить +{{ countBonus }} 🍌?</div>
				<div class="text-base sm:text-sm">Посмотри рекламный ролик</div>
			</div>
			<button
				class="px-3 sm:px-2 py-2 sm:py-1 text-base sm:text-sm rounded bg-slate-600 text-white"
				@click="handleShow"
			>
				смотреть
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useYandexSDKStore } from '@/stores/useYandexSDKStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const playerStore = usePlayerStore();
const yaStore = useYandexSDKStore();

const isShowAlert = ref(false);
const interval = ref<ReturnType<typeof setInterval>>();

// бонус в бананах
const DEFAULT_BONUS = 1000;
const CURRENT_BONUS = ref(DEFAULT_BONUS);

const countBonus = computed(() => {
	const poc = playerStore.player.priceOneClick;

	if (poc > 2) {
		CURRENT_BONUS.value = DEFAULT_BONUS * (poc / 2);
		return CURRENT_BONUS.value;
	}

	CURRENT_BONUS.value = DEFAULT_BONUS * poc;
	return CURRENT_BONUS.value;
});

const handleShow = () => {
	isShowAlert.value = false;

	console.log('handleShow');

	yaStore.ysdk?.adv.showRewardedVideo({
		callbacks: {
			onClose: (wasShow) => {
				console.log('[onClose] wasShow', wasShow);
			},
			onRewarded: () => {
				console.log('[onRewarded] triggered');

				playerStore.player.bananas += CURRENT_BONUS.value;
			},
		},
	});
};

onMounted(() => {
	interval.value = setInterval(() => {
		isShowAlert.value = true;

		setTimeout(() => {
			isShowAlert.value = false;
		}, 15000); // 15 sec
	}, 300000); // 300000 - 5 mins
});

onUnmounted(() => {
	if (interval.value) {
		clearInterval(interval.value);
	}
});
</script>
