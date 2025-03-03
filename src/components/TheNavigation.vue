<template>
	<nav
		id="navigation"
		:class="[
			'w-max bg-slate-700 rounded-l-md fixed top-1/2 -translate-y-1/2 transition-all ease-in-out',
			wrapRight,
		]"
	>
		<div class="p-4 gap-4 flex flex-col">
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
import { useUserStore } from '@/stores/useUserStore';

const { canBuyBoost } = usePayBoost();
const { canBuyBackground } = usePayBackground();
const userStore = useUserStore();

const wrapRight = computed(() => {
	return userStore.showNavigation ? 'right-0' : '-right-full';
});
</script>
