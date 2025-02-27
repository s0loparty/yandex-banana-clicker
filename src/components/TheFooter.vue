<template>
	<footer class="w-full bg-slate-700 rounded-t-md">
		<div class="p-4 items-center gap-4 flex flex-wrap justify-center">
			<RouterLink
				to="/"
				class="rounded block text-gray-300 bg-slate-600 px-3 py-1 shadow-md border border-transparent text-center"
				draggable="false"
			>
				🍌 ИГРАТЬ
			</RouterLink>
			<RouterLink
				to="/boosts"
				class="relative rounded block text-gray-300 bg-slate-600 px-3 py-1 shadow-md border border-transparent text-center"
				draggable="false"
			>
				<CirclePing v-if="canBuyBoost" />
				🔥 БУСТЫ
			</RouterLink>
			<RouterLink
				to="/backgrounds"
				class="relative rounded block text-gray-300 bg-slate-600 px-3 py-1 shadow-md border border-transparent text-center"
				draggable="false"
			>
				<CirclePing v-if="canBuyBackground" />
				🌈 ФОНЫ
			</RouterLink>
			<RouterLink
				to="/top"
				class="relative rounded block text-gray-300 bg-slate-600 px-3 py-1 shadow-md border border-transparent text-center"
				draggable="false"
			>
				⭐ ТОП
			</RouterLink>
			<ButtonSoundEffects />
		</div>
	</footer>
</template>

<script setup lang="ts">
import ButtonSoundEffects from '@/components/ui/ButtonSoundEffects.vue';
import CirclePing from './ui/CirclePing.vue';
import usePayBackground from '@/composable/usePayBackground';
import usePayBoost from '@/composable/usePayBoost';

const { canBuyBoost } = usePayBoost();
const { canBuyBackground } = usePayBackground();
</script>
