<template>
	<main class="mx-auto max-w-[800px]">
		<div :class="wrapClasses">
			<TheHeader />

			<section :class="sectionClasses">
				<RouterView />
			</section>

			<TheFooter />
		</div>
	</main>
</template>

<script lang="ts" setup>
import TheFooter from '@/components/TheFooter.vue';
import TheHeader from '@/components/TheHeader.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const wrapClasses = computed(() => {
	return [
		{ 'bg-black/40': route.name !== 'main' },
		'min-h-screen max-h-screen flex flex-col items-center justify-between transition-colors',
	];
});

const sectionClasses = computed(() => {
	return [
		route.name === 'main'
			? 'overflow-x-auto w-max flex'
			: 'overflow-x-auto w-full flex grow',
	];
});
</script>
