import { YandexGamesSDK, YandexPlayer } from '@/types/yandexSDK';
import { ref, onMounted, Ref } from 'vue';

export function useYandexSDK() {
	const ysdk: Ref<YandexGamesSDK | null> = ref(null);
	const player = ref<YandexPlayer | null>(null);
	const isReady = ref(false);

	// Инициализация SDK при монтировании компонента.
	onMounted(() => {
		if (typeof window !== 'undefined' && (window as any).yaGames) {
			(window as any).yaGames
				.init()
				.then((sdk: YandexGamesSDK) => {
					ysdk.value = sdk;
					isReady.value = true;
					console.log('Yandex SDK загружен', sdk);
				})
				.catch((err: unknown) => {
					console.error('Ошибка загрузки SDK', err);
				});
		} else {
			console.warn('yaGames не найден в window. Возможно, скрипт не подключен.');
		}
	});

	/**
	 * Показ полноэкранной рекламы.
	 */
	const showAd = async (): Promise<void> => {
		if (isReady.value && ysdk.value) {
			try {
				await ysdk.value.adv.showFullscreenAdv();
				console.log('Реклама успешно показана');
			} catch (err) {
				console.error('Ошибка показа рекламы', err);
			}
		}
	};

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
	 * Открывает диалог авторизации.
	 * После успешной авторизации происходит повторная инициализация игрока.
	 */
	const openAuthDialog = async (): Promise<void> => {
		if (isReady.value && ysdk.value) {
			try {
				await ysdk.value.auth.openAuthDialog();
				console.log('Окно авторизации открыто');
				await initPlayer();
			} catch (err) {
				console.error('Ошибка авторизации', err);
			}
		}
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

	return {
		ysdk,
		isReady,
		showAd,
		initPlayer,
		openAuthDialog,
		player,
		playerSetData,
		playerGetData,
		playerSetStats,
		playerIncrementStats,
		playerGetStats,
	};
}
