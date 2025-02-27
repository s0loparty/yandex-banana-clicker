<template>
	<div
		v-if="showModal"
		class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30"
	>
		<div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
			<h2 class="text-lg font-bold mb-4">🔐 Авторизация</h2>
			<p class="mb-4">
				Если вы авторизуетесь, то сможете участвовать в мини-играх и ваше имя будет
				отображаться в топе игроков.
			</p>
			<div class="flex justify-center space-x-4">
				<button
					@click="authorize"
					class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Авторизоваться
				</button>
				<button
					@click="closeModal"
					class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
				>
					Отмена
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useYandexSDKStore } from '@/stores/useYandexSDKStore';

const showModal = ref(false);
const yaStore = useYandexSDKStore();

function closeModal() {
	showModal.value = false;
}

const authorize = () =>
	yaStore.authorize(() => {
		console.log('Игрок авторизовался!');
	}, closeModal);

onMounted(() => {
	if (yaStore.isPlayerAuthoreized) return;

	showModal.value = true;
});
</script>
