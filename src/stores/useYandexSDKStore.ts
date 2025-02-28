import { YandexGamesSDK, YandexPlayer } from '@/types/yandexSDK';
import { computed, onMounted, ref } from 'vue';
import { defineStore } from 'pinia';

export const useYandexSDKStore = defineStore('yandexSDKStore', () => {
	const ysdk = ref<YandexGamesSDK | null>(null);
	const player = ref<YandexPlayer | null>(null);
	const isReady = ref(false);

	// Инициализация SDK при монтировании компонента.
	onMounted(() => {
		if (typeof window !== 'undefined' && (window as any).YaGames) {
			(window as any).YaGames.init()
				.then((sdk: YandexGamesSDK) => {
					ysdk.value = sdk;
					isReady.value = true;
					console.log('Yandex SDK загружен', sdk);
				})
				.catch((err: unknown) => {
					console.error('Ошибка загрузки SDK', err);
				});
		} else {
			console.warn('YaGames не найден в window. Возможно, скрипт не подключен.');
		}
	});

	const isPlayerAuthoreized = computed(() => {
		return player.value?.getMode() !== 'lite';
	});

	/**
	 * Инициализация объекта игрока.
	 * Запрашивает игрока с запрашиваемыми данными (scopes: true).
	 */
	const initPlayer = async (): Promise<YandexPlayer | null> => {
		if (isReady.value && ysdk.value) {
			try {
				const _player = await ysdk.value.getPlayer({ scopes: true });
				player.value = _player;
				console.log('Player инициализирован', _player);
				return _player;
			} catch (err) {
				console.error('Ошибка инициализации игрока', err);
			}
		}
		return null;
	};

	/**
	 * Сохраняет внутриигровые данные игрока.
	 * @param data Объект с данными.
	 * @param flush Если true — данные отправляются сразу.
	 */
	const playerSetData = async (
		data: Record<string, any>,
		flush: boolean = false
	): Promise<void> => {
		if (player.value) {
			try {
				await player.value.setData(data, flush);
				console.log('Данные игрока сохранены');
			} catch (err) {
				console.error('Ошибка сохранения данных игрока', err);
			}
		}
	};

	/**
	 * Получает внутриигровые данные игрока.
	 * @param keys Массив ключей или undefined для получения всех данных.
	 */
	const playerGetData = async (keys?: string[]): Promise<Record<string, any> | null> => {
		if (player.value) {
			try {
				return await player.value.getData(keys);
			} catch (err) {
				console.error('Ошибка получения данных игрока', err);
			}
		}
		return null;
	};

	/**
	 * Сохраняет числовую статистику игрока.
	 * @param stats Объект с числовыми значениями.
	 */
	const playerSetStats = async (stats: Record<string, number>): Promise<void> => {
		if (player.value) {
			try {
				await player.value.setStats(stats);
				console.log('Статистика игрока сохранена');
			} catch (err) {
				console.error('Ошибка сохранения статистики игрока', err);
			}
		}
	};

	/**
	 * Инкрементирует числовые данные игрока.
	 * @param increments Объект с инкрементами.
	 */
	const playerIncrementStats = async (
		increments: Record<string, number>
	): Promise<Record<string, number> | undefined> => {
		if (player.value) {
			try {
				const updatedStats = await player.value.incrementStats(increments);
				console.log('Статистика игрока обновлена', updatedStats);
				return updatedStats;
			} catch (err) {
				console.error('Ошибка обновления статистики игрока', err);
			}
		}
	};

	/**
	 * Получает числовую статистику игрока.
	 * @param keys Массив ключей или undefined для получения всех данных.
	 */
	const playerGetStats = async (
		keys?: string[]
	): Promise<Record<string, number> | null> => {
		if (player.value) {
			try {
				return await player.value.getStats(keys);
			} catch (err) {
				console.error('Ошибка получения статистики игрока', err);
			}
		}
		return null;
	};

	async function authorize(cbSuccess: Function, cbFail: Function) {
		if (!ysdk.value || !player.value) return;

		try {
			if (player.value.getMode() === 'lite') {
				await ysdk.value.auth.openAuthDialog();
				player.value = await ysdk.value.getPlayer({ scopes: true }); // Повторная инициализация
			}
			console.log('Пользователь авторизован:', player.value);
			cbSuccess();
		} catch (err) {
			console.error('Ошибка авторизации:', err);
			cbFail();
		}
	}

	const startPlay = () => {
		ysdk.value?.features.GameplayAPI.start();
	};
	const stopPlay = () => {
		ysdk.value?.features.GameplayAPI.stop();
	};

	return {
		ysdk,
		isReady,
		isPlayerAuthoreized,
		player,

		initPlayer,
		playerSetData,
		playerGetData,
		playerSetStats,
		playerIncrementStats,
		playerGetStats,
		authorize,

		startPlay,
		stopPlay,
	};
});
