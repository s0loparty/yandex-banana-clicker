<template>
	<main
		ref="wrapRef"
		id="wrap-banana"
		class="relative grow flex items-center justify-center rounded-full w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] bg-black/15"
	>
		<XyzTransition
			appear
			xyz="fade rotate-right ease-out-back"
			mode="in-out"
		>
			<div
				id="banana"
				v-if="!isExploded"
				:class="[
					'main-banana bg-no-repeat bg-contain bg-center mx-auto w-[200px] h-[200px] sm:w-full duration-[100ms] landscape:max-w-[300px]',
					scaleClasses,
				]"
				:style="{ backgroundImage: `url(${dynamicBananaImage})` }"
				@click="handleClick"
			></div>
		</XyzTransition>

		<!-- Кусочки банана -->
		<div
			v-for="(piece, index) in bananaPieces"
			:key="index"
			:style="{
				position: 'absolute',
				width: '50px',
				height: '50px',
				backgroundImage: `url(${dynamicBananaImage})`,
				backgroundSize: 'contain',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				top: piece.y + 'px',
				left: piece.x + 'px',
				transform: `rotate(${piece.rotation}deg)`,
				transition: 'transform 0.8s ease-out, top 0.8s ease-out, left 0.8s ease-out',
			}"
		></div>

		<!-- Молния -->
		<div
			v-show="isExploded"
			class="lightning"
		></div>

		<!-- мега-банан -->
		<div
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl w-max text-yellow-400 font-extrabold"
			style="text-shadow: 0 0 4px rgba(0, 0, 0)"
			v-show="isExploded"
		>
			+{{ COUNT_BANANAS_FOR_EFFECT }} 🍌
		</div>
	</main>

	<TheAlertRewardedVideo />
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import useSoundEffects from '@/composable/useSoundEffects';
import imageBanana from '@/assets/images/banana.png';
import imageBananaMinecraft from '@/assets/images/banana-minecraft.png';
import smallBanana from '@/assets/images/small-banana.png';
import { BACKGROUNDS } from '@/constants/backgrounds';
import TheAlertRewardedVideo from '@/components/TheAlertRewardedVideo.vue';

const COUNT_CLICKS_FOR_EXPLOSION_EFFECT = 100;
const COUNT_BANANAS_FOR_EFFECT = 100;

const userStore = useUserStore();
const soundEffects = useSoundEffects();

const scaleClasses = ref('');
const wrapRef = useTemplateRef('wrapRef')!;
const isExploded = ref(false);
const bananaPieces = ref<{ x: number; y: number; rotation: number }[]>([]);
const clickCount = ref(0);
let lastClickTime = 0;

const dynamicBananaImage = computed(() => {
	const MAP = {
		minecraft: imageBananaMinecraft,
		default: imageBanana,
	};

	const bgClass = BACKGROUNDS.find(
		(bg) => bg.id === userStore.user.currentBackgroundId
	)!.class;

	// @ts-ignore
	return MAP[bgClass] ? MAP[bgClass] : MAP.default;
});

const bonusBananas = () => {
	userStore.user.bananas += COUNT_BANANAS_FOR_EFFECT;
};

const handleClick = (ev: any): void => {
	const currentTime = Date.now();
	if (currentTime - lastClickTime < 1000) {
		clickCount.value++;
	} else {
		clickCount.value = 1;
	}
	lastClickTime = currentTime;

	clickEffect(ev);
	userStore.addBananasPerClick();
	soundEffects.playBananaClick();

	if (clickCount.value >= COUNT_CLICKS_FOR_EXPLOSION_EFFECT) {
		bonusBananas();
		explodeBanana();
		return;
	}

	const element = ev.target as Element;
	if (element.classList.contains('scale-125')) {
		element.classList.remove('scale-125');
	}

	scaleClasses.value = 'scale-125';
	setTimeout(() => (scaleClasses.value = 'scale-100'), 50);
};

function clickEffect(e: any) {
	const bananaPlus = document.createElement('div');
	bananaPlus.setAttribute('id', 'banana-plus');
	bananaPlus.classList.add('banana-object');
	bananaPlus.innerHTML = `
		<span class="text-sm text-white drop-shadow-lg relative top-[14px] left-[10px]">
			+${userStore.user.priceOneClick}
		</span>
		<img src="${smallBanana}" class="w-8 drop-shadow-md" />
	`;

	const randomOffsetY = Math.floor(Math.random() * 11) - 5;
	const randomOffsetX = Math.floor(Math.random() * 11) - 5;

	bananaPlus.style.top = e.clientY - (randomOffsetY + 80) + 'px';
	bananaPlus.style.left = e.clientX + randomOffsetX + 'px';

	wrapRef.value?.append(bananaPlus);

	bananaPlus.addEventListener('animationend', () => {
		if (bananaPlus.parentElement) {
			bananaPlus.parentElement.removeChild(bananaPlus);
		}
	});
}

function explodeBanana() {
	isExploded.value = true;
	clickCount.value = 0;

	// Проигрываем звук взрыва
	soundEffects.playExplosion();

	// Создаём кусочки
	bananaPieces.value = Array.from({ length: 30 }, () => ({
		x: 100,
		y: 100,
		rotation: Math.random() * 360,
	}));

	setTimeout(() => {
		bananaPieces.value = bananaPieces.value.map((piece) => ({
			...piece,
			x: piece.x + (Math.random() * 600 - 300),
			y: piece.y + (Math.random() * 600 - 300),
		}));
	}, 50);

	// Убираем кусочки и возвращаем банан
	setTimeout(() => {
		isExploded.value = false;
		bananaPieces.value = [];
	}, 2000);
}
</script>

<style scoped>
@keyframes lightning {
	0% {
		box-shadow: 0 0 20px 5px rgba(255, 255, 0, 0.7);
	}
	50% {
		box-shadow: 0 0 50px 10px rgba(255, 0, 255, 0.7);
	}
	100% {
		box-shadow: 0 0 20px 5px rgba(255, 255, 0, 0.7);
	}
}

.lightning {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	animation: lightning 0.3s ease-in-out infinite;
}
</style>
