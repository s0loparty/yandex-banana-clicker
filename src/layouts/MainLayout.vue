<template>
	<main
		:class="[
			'mx-auto overflow-y-auto',
			ps.playerMobileLandscape ? 'max-w-5xl' : 'max-w-[800px]',
		]"
	>
		<div :class="wrapClasses">
			<TheHeader />

			<section :class="['w-full grow overflow-y-auto', sectionClasses]">
				<RouterView />
			</section>

			<TheNavigation />
		</div>
	</main>
</template>

<script lang="ts" setup>
import TheNavigation from '@/components/TheNavigation.vue';
import TheHeader from '@/components/TheHeader.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePlayerStore } from '@/stores/usePlayerStore';

const route = useRoute();
const ps = usePlayerStore();

const wrapClasses = computed(() => {
	return [
		{ 'bg-black/40': route.name !== 'main' },
		'min-h-screen max-h-screen flex flex-col items-center transition-colors',
	];
});

const sectionClasses = computed(() => {
	if (route.name === 'main') {
		return 'flex items-center justify-center';
	} else if (route.name === 'catch') {
		return 'flex flex-col';
	}
});
</script>
