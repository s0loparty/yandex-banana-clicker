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
				:class="[
					'main-banana bg-no-repeat bg-contain bg-center mx-auto w-[200px] h-[200px] sm:w-full duration-[100ms] landscape:max-w-[300px]',
					scaleClasses,
				]"
				:style="{ backgroundImage: `url(${dynamicBananaImage})` }"
				@click="handleClick"
			></div>
		</XyzTransition>
	</main>

	<TheAlertRewardedVideo />
</template>

<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import useSoundEffects from '@/composable/useSoundEffects';
import imageBanana from '@/assets/images/banana.png';
import imageBananaMinecraft from '@/assets/images/banana-minecraft.png';
import smallBanana from '@/assets/images/small-banana.png';
import { BACKGROUNDS } from '@/constants/backgrounds';
import TheAlertRewardedVideo from '@/components/TheAlertRewardedVideo.vue';

const userStore = useUserStore();
const soundEffects = useSoundEffects();

const scaleClasses = ref('');

const effectPosition = reactive({ x: 0, y: 0 });
const wrapRef = useTemplateRef('wrapRef')!;

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

const handleClick = (ev: any): void => {
	clickEffect(ev);

	effectPosition.x = ev.clientX;
	effectPosition.y = ev.clientY;

	userStore.addBananasPerClick();

	soundEffects.playBananaClick();

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
		<img
			src="${smallBanana}"
			class="w-8 drop-shadow-md"
		/>`;

	const randomOffsetY = Math.floor(Math.random() * 11) - 5; // [-5, 5]
	const randomOffsetX = Math.floor(Math.random() * 11) - 5; // [-5, 5]

	bananaPlus.style.top = e.clientY - (randomOffsetY + 80) + 'px';
	bananaPlus.style.left = e.clientX + randomOffsetX + 'px';

	wrapRef.value?.append(bananaPlus);

	bananaPlus.addEventListener('animationend', () => {
		if (bananaPlus.parentElement) {
			bananaPlus.parentElement.removeChild(bananaPlus);
		}
	});
}
</script>
