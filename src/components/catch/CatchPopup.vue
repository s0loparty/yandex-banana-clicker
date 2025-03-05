<template>
	<div class="absolute inset-0 w-full h-full bg-black/80 z-50 transition-all">
		<div
			class="absolute space-y-3 md:space-y-5 left-1/2 -translate-x-1/2 top-4 md:top-1/4 w-[90%] md:w-[60%] p-4 md:p-6 rounded-xl bg-slate-700 shadow-black/80 shadow-[0_0_5px]"
			:style="contentStyles"
		>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/usePlayerStore';
import { computed } from 'vue';

const ps = usePlayerStore();

const contentStyles = computed(() => {
	return ps.playerMobileLandscape ? { top: '8px' } : {};
});
</script>
