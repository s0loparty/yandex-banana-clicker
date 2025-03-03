<template>
	<button
		:class="['flex items-center gap-2 justify-start w-full', computedClasses]"
		@click="toggleEffects"
	>
		<span>ЗВУК</span>
		<SpeakerWaveIcon
			v-if="storeUser.soundEffects"
			class="size-6"
		/>
		<SpeakerXMarkIcon
			v-else
			class="size-6"
		/>
	</button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
const storeUser = useUserStore();

const toggleEffects = () => {
	storeUser.soundEffects = !storeUser.soundEffects;
};

const computedClasses = computed(() => {
	return [
		'rounded block bg-slate-600 px-3 py-1 shadow-md',
		storeUser.soundEffects ? 'text-yellow-500' : 'text-gray-300',
	];
});
</script>
