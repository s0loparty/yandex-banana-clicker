<template>
	<button
		class="flex items-center gap-x-2 rounded-md border border-gray-200/50 px-1 md:pl-1 md:pr-1.5"
		@click="click"
	>
		<div>
			<XMarkIcon
				v-show="playerStore.showNavigation"
				class="size-7 stroke-gray-200"
			/>
			<Bars3Icon
				v-show="!playerStore.showNavigation"
				class="size-7 stroke-gray-200"
			/>
		</div>
		<span class="text-white leading-none -mt-1 hidden md:block">меню</span>
	</button>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/usePlayerStore';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const playerStore = usePlayerStore();

const click = () => {
	playerStore.toggleNavigation();
};
</script>
