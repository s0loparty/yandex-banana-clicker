<template>
	<main class="mx-auto max-w-[800px]">
		<div :class="wrapClasses">
			<TheHeader />

			<section :class="['flex grow', sectionClasses]">
				<RouterView />
			</section>

			<TheNavigation />

			<TheNavigationButton />
		</div>
	</main>
</template>

<script lang="ts" setup>
import TheNavigation from '@/components/TheNavigation.vue';
import TheHeader from '@/components/TheHeader.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheNavigationButton from '@/components/TheNavigationButton.vue';

const route = useRoute();

const wrapClasses = computed(() => {
	return [
		{ 'bg-black/40': route.name !== 'main' },
		'min-h-screen max-h-screen flex flex-col items-center transition-colors',
	];
});

const sectionClasses = computed(() =>
	route.name === 'main' ? 'w-max items-center' : 'w-full'
);
</script>
