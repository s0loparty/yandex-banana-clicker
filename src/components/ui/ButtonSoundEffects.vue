<template>
	<button
		:class="['flex items-center gap-2 justify-start', computedClasses]"
		:style="{ width: playerStore.playerMobileLandscape ? 'max-content' : '100%' }"
		@click="toggleEffects"
	>
		<span :class="{ 'text-sm': playerStore.playerMobileLandscape }">ЗВУК</span>
		<SpeakerWaveIcon
			v-if="playerStore.soundEffects"
			:class="[playerStore.playerMobileLandscape ? 'size-4' : 'size-6']"
		/>
		<SpeakerXMarkIcon
			v-else
			:class="[playerStore.playerMobileLandscape ? 'size-4' : 'size-6']"
		/>
	</button>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/usePlayerStore';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const playerStore = usePlayerStore();

const toggleEffects = () => {
	playerStore.soundEffects = !playerStore.soundEffects;
};

const computedClasses = computed(() => {
	return [
		playerStore.soundEffects ? 'text-yellow-500' : 'text-gray-300',
		playerStore.playerMobileLandscape ? 'px-1' : 'px-3',
		'rounded block bg-slate-600 py-1 shadow-md',
	];
});
</script>
