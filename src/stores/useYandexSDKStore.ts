import { YandexGamesSDK, YandexPlayer } from '@/types/yandexSDK';
import { computed, onMounted, ref } from 'vue';
import { defineStore } from 'pinia';

const LOCAL_STORAGE_KEY = 'banana-clicker-local-player';

type LocalPlayerState = {
	data: Record<string, any>;
	stats: Record<string, number>;
};

const readLocalPlayerState = (): LocalPlayerState => {
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch (err) {
		console.warn('[YandexSDK] Failed to read local player state', err);
	}

	return { data: {}, stats: {} };
};

const createLocalPlayer = (): YandexPlayer => {
	const state = readLocalPlayerState();

	const persist = () => {
		try {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
		} catch (err) {
			console.warn('[YandexSDK] Failed to persist local player state', err);
		}
	};

	return {
		setData: async (data) => {
			Object.assign(state.data, data);
			persist();
		},
		getData: async (keys) => {
			if (!keys) return { ...state.data };
			return Object.fromEntries(keys.map((key) => [key, state.data[key]]));
		},
		setStats: async (stats) => {
			Object.assign(state.stats, stats);
			persist();
		},
		incrementStats: async (increments) => {
			Object.entries(increments).forEach(([key, value]) => {
				state.stats[key] = (state.stats[key] ?? 0) + value;
			});
			persist();
			return { ...state.stats };
		},
		getStats: async (keys) => {
			if (!keys) return { ...state.stats };
			return Object.fromEntries(
				keys
					.map((key) => [key, state.stats[key]])
					.filter(([, value]) => value !== undefined)
			);
		},
		getUniqueID: () => 'local-player',
		getIDsPerGame: async () => [],
		getName: () => 'Локальный игрок',
		getPhoto: () => '',
		getPayingStatus: () => 'unknown',
		getMode: () => 'local',
	};
};

const getLocalLeaderboardDescription = async (leaderboardName: string) => ({
	appID: 'local',
	default: true,
	description: {
		invert_sort_order: false,
		score_format: {
			options: { decimal_offset: 0 },
			type: 'numeric' as const,
		},
	},
	name: leaderboardName,
	title: { ru: leaderboardName },
});

const createLocalSDK = (): YandexGamesSDK => {
	const localPlayer = createLocalPlayer();
	const localLeaderboards = {
		getLeaderboardDescription: getLocalLeaderboardDescription,
		setLeaderboardScore: async () => undefined,
		getLeaderboardPlayerEntry: async () => {
			throw { code: 'NO_DATA' };
		},
		getLeaderboardEntries: async () => ({
			leaderboard: await getLocalLeaderboardDescription('local'),
			ranges: [],
			userRank: -1,
			entries: [],
		}),
	};

	return {
		isAvailableMethod: async () => true,
		environment: {
			get app() {
				return { id: 'local' };
			},
			get browser() {
				return { lang: navigator.language };
			},
			get i18n() {
				return { lang: 'ru', tld: 'ru' };
			},
			get payload() {
				return null;
			},
		},
		deviceInfo: {
			get type() {
				return 'desktop';
			},
			isMobile: () => false,
			isTablet: () => false,
			isDesktop: () => true,
			isTV: () => false,
		},
		features: {
			LoadingAPI: { ready: () => undefined },
			GameplayAPI: {
				start: () => undefined,
				stop: () => undefined,
			},
		},
		clipboard: { writeText: (text: string) => navigator.clipboard?.writeText(text) },
		screen: {
			fullscreen: {
				STATUS_ON: 'on',
				STATUS_OFF: 'off',
				status: 'off',
				request: async () => undefined,
				exit: async () => undefined,
			},
		},
		getStorage: async () => localStorage,
		auth: { openAuthDialog: async () => undefined },
		getPlayer: async () => localPlayer,
		feedback: {
			canReview: async () => ({ value: false }),
			requestReview: async () => ({ feedbackSent: false }),
		},
		adv: {
			showFullscreenAdv: (opts) => opts?.callbacks?.onClose?.(),
			showRewardedVideo: (opts) => {
				opts?.callbacks?.onOpen?.();
				opts?.callbacks?.onRewarded?.();
				opts?.callbacks?.onClose?.(true);
			},
			showBannerAdv: async () => ({}),
			hideBannerAdv: () => undefined,
			getBannerAdvStatus: async () => ({ stickyAdvIsShowing: false }),
		},
		EVENTS: { EXIT: 'EXIT', HISTORY_BACK: 'HISTORY_BACK' },
		dispatchEvent: async () => undefined,
		onEvent: () => () => undefined,
		shortcut: {
			canShowPrompt: async () => ({ canShow: false }),
			showPrompt: async () => ({ outcome: 'rejected' as const }),
		},
		getPayments: async () => {
			throw new Error('Payments are unavailable in local mode');
		},
		getLeaderboards: async () => localLeaderboards,
	} as YandexGamesSDK;
};

export const useYandexSDKStore = defineStore('yandexSDKStore', () => {
	const ysdk = ref<YandexGamesSDK | null>(null);
	const player = ref<YandexPlayer | null>(null);
	const isReady = ref(false);

	// В локальной разработке SDK Яндекс Игр может отсутствовать.
	// В этом случае запускаем совместимый локальный mock, чтобы игра была
	// полностью доступна через обычный `npm run dev`.
	onMounted(() => {
		if (typeof window !== 'undefined' && (window as any).YaGames) {
			(window as any).YaGames.init()
				.then((sdk: YandexGamesSDK) => {
					ysdk.value = sdk;
					isReady.value = true;
					console.log('Yandex SDK загружен', sdk);
				})
				.catch((err: unknown) => {
					console.error('Ошибка загрузки SDK, включаем локальный режим', err);
					ysdk.value = createLocalSDK();
					isReady.value = true;
				});
		} else {
			console.info('Yandex SDK не найден — включён локальный режим разработки.');
			ysdk.value = createLocalSDK();
			isReady.value = true;
		}
	});

	const isPlayerAuthoreized = computed(() => {
		return player.value?.getMode() !== 'lite';
	});

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
				throw `Ошибка сохранения данных игрока: ${err}`;
			}
		}
	};

	const playerGetData = async (keys?: string[]): Promise<Record<string, any> | null> => {
		if (player.value) {
			try {
				return await player.value.getData(keys);
			} catch (err) {
				console.error('Ошибка получения данных игрока', err);
				throw `Ошибка получения данных игрока: ${err}`;
			}
		}
		return null;
	};

	const playerSetStats = async (stats: Record<string, number>): Promise<void> => {
		if (player.value) {
			try {
				await player.value.setStats(stats);
				console.log('Статистика игрока сохранена');
			} catch (err) {
				console.error('Ошибка сохранения статистики игрока', err);
				throw `Ошибка сохранения статистики игрока: ${err}`;
			}
		}
	};

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
				throw `Ошибка обновления статистики игрока: ${err}`;
			}
		}
	};

	const playerGetStats = async (
		keys?: string[]
	): Promise<Record<string, number> | null> => {
		if (player.value) {
			try {
				return await player.value.getStats(keys);
			} catch (err) {
				console.error('Ошибка получения статистики игрока', err);
				throw `Ошибка получения статистики игрока: ${err}`;
			}
		}
		return null;
	};

	async function authorize(cbSuccess: Function, cbFail: Function) {
		if (!ysdk.value || !player.value) return;

		try {
			if (player.value.getMode() === 'lite') {
				await ysdk.value.auth.openAuthDialog();
				player.value = await ysdk.value.getPlayer({ scopes: true });
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
