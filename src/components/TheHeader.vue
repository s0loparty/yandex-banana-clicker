<template>
	<header
		id="header"
		class="w-full bg-slate-700 shadow-md rounded-b-md"
	>
		<div class="flex items-center justify-between gap-4 py-2 px-4">
			<div class="flex flex-col">
				<div class="flex items-center gap-2 text-orange-300 font-bold">
					<span>🍌</span>
					<CountUp
						:start-val="prevBananas"
						:end-val="playerStore.player.bananas"
						:duration="0.8"
					/>
				</div>
			</div>
			<div class="flex items-center gap-x-4">
				<div class="text-gray-200 truncate">
					<div v-if="playerStore.player.username">
						{{ playerStore.player.username }}
					</div>
					<div v-else>{{ UNKNOWN_NAME }}</div>
				</div>

				<TheNavigationButton />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { UNKNOWN_NAME } from '@/constants';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { ref, watch } from 'vue';
import CountUp from 'vue-countup-v3';
import TheNavigationButton from './TheNavigationButton.vue';

const playerStore = usePlayerStore();

const prevBananas = ref(playerStore.player.bananas);

watch(
	() => playerStore.player.bananas,
	(_, oldValue) => {
		prevBananas.value = oldValue;
	},
	{ deep: true }
);
</script>
