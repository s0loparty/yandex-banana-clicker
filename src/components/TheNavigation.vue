<template>
	<nav
		id="navigation"
		:class="navClasses"
	>
		<div :class="navWrapClasses">
			<NavigationLink path="/"> 🍌 ИГРАТЬ </NavigationLink>
			<NavigationLink
				path="/boosts"
				class="relative"
			>
				<CirclePing v-if="canBuyBoost" />
				🔥 БУСТЫ
			</NavigationLink>
			<NavigationLink
				path="/backgrounds"
				class="relative"
			>
				<CirclePing v-if="canBuyBackground" />
				🌈 ФОНЫ
			</NavigationLink>
			<NavigationLink path="/catch"> 🐵 ЛОВЛЯ </NavigationLink>
			<NavigationLink path="/top"> ⭐ ТОП </NavigationLink>

			<ButtonSoundEffects />
		</div>
	</nav>
</template>

<script setup lang="ts">
import ButtonSoundEffects from '@/components/ui/ButtonSoundEffects.vue';
import CirclePing from './ui/CirclePing.vue';
import usePayBackground from '@/composable/usePayBackground';
import usePayBoost from '@/composable/usePayBoost';
import NavigationLink from './NavigationLink.vue';
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/usePlayerStore';

const { canBuyBoost } = usePayBoost();
const { canBuyBackground, currentBackground } = usePayBackground();
const playerStore = usePlayerStore();

const navClasses = computed(() => {
	const defaultClasses = ['fixed w-max bg-slate-700 transition-all ease-in-out'];

	if (playerStore.playerMobileLandscape) {
		if (currentBackground.value.class === 'minecraft') {
			return [
				'left-1/2 right-1/2 -translate-x-1/2 rounded-b',
				playerStore.showNavigation ? 'top-0' : '-top-full',
				...defaultClasses,
			];
		}

		return [
			'left-1/2 right-1/2 -translate-x-1/2 rounded-t',
			playerStore.showNavigation ? 'bottom-0' : '-bottom-full',
			...defaultClasses,
		];
	}

	return [
		'fixed mt-5 rounded-l-md md:mt-auto top-1/2 -translate-y-1/2',
		playerStore.showNavigation ? 'right-0' : '-right-full',
		...defaultClasses,
	];
});

const navWrapClasses = computed(() => {
	const defaultClasses = ['flex'];
	if (playerStore.playerMobileLandscape) {
		return ['flex-wrap p-2 gap-2', ...defaultClasses];
	}

	return ['flex-col p-4 gap-4', ...defaultClasses];
});
</script>
