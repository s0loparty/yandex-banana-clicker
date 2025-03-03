<template>
	<div
		ref="backgroundRef"
		id="background"
		class="transition-all"
	></div>
</template>

<script setup lang="ts">
import { BACKGROUNDS } from '@/constants/backgrounds';
import { useUserStore } from '@/stores/useUserStore';
import { onMounted, useTemplateRef, watch } from 'vue';

const userStore = useUserStore();

const backgroundRef = useTemplateRef('backgroundRef');

const changeBackgroundById = (id: number) => {
	if (!backgroundRef.value) return;

	const background = BACKGROUNDS.find((i) => i.id === id)!;

	backgroundRef.value.style.backgroundImage = `url(${background.source})`;

	BACKGROUNDS.forEach((bg) => {
		if (bg.id === id) {
			backgroundRef.value!.classList.add(background.class);
			document.body.classList.add(background.class);
		} else {
			backgroundRef.value!.classList.remove(bg.class);
			document.body.classList.remove(bg.class);
		}
	});
};

watch(() => userStore.user.currentBackgroundId, changeBackgroundById);

onMounted(() => {
	changeBackgroundById(1);
});
</script>
