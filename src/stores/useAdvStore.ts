import { useYandexSDK } from '@/composable/useYandexSDK';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const useAdvStore = defineStore('advStore', () => {
	const ya = useYandexSDK();

	// Время перезарядки рекламы в секундах
	const TIMEOUT_SHOW_FULLSCREEN = 60; // 60 секунд
	const timerShowFullscreenAdv = ref(0);

	const allowShowFullscreenAdv = computed(() => timerShowFullscreenAdv.value === 0);

	const showFullscreenAdv = () => {
		if (!allowShowFullscreenAdv.value) {
			console.log(
				'Реклама скоро будет доступна, подождите',
				timerShowFullscreenAdv.value,
				'секунд'
			);
			return;
		}

		// Показываем рекламу сразу
		ya.ysdk.value?.adv.showFullscreenAdv({
			callbacks: {
				onClose: () => {
					console.log('Реклама закрыта.');
				},
				onError: (e) => {
					console.log('Ошибка при показе рекламы:', e);
				},
			},
		});

		// Устанавливаем время перезарядки
		timerShowFullscreenAdv.value = TIMEOUT_SHOW_FULLSCREEN;

		// Запускаем обратный отсчёт каждую секунду
		const decrementInterval = setInterval(() => {
			if (timerShowFullscreenAdv.value > 0) {
				timerShowFullscreenAdv.value--;
			}
			if (timerShowFullscreenAdv.value === 0) {
				clearInterval(decrementInterval);
			}
		}, 1000);
	};

	return {
		allowShowFullscreenAdv,
		timerShowFullscreenAdv,
		showFullscreenAdv,
	};
});

export default useAdvStore;
