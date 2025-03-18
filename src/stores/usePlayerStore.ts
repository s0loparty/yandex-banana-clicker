import { defineStore } from 'pinia';
import { reactive, ref, watch, watchEffect } from 'vue';
import { UNKNOWN_NAME } from '@/constants';
import { useYandexSDKStore } from './useYandexSDKStore';
import { useLeaderboardStore } from './useLeaderboardStore';
import { BACKGROUNDS } from '@/constants/backgrounds';
import isMobileLandscape from '@/helpers/mobile-landscape';
import { IBoostStore, PlayerStore } from '@/types';

const IS_DEV = import.meta.env.DEV;

export const usePlayerStore = defineStore('playerStore', () => {
	const player = reactive<PlayerStore>({
		id: IS_DEV ? 'localhost' : null,
		username: UNKNOWN_NAME,
		boosts: [],
		priceOneClick: 1,
		bananas: IS_DEV ? 100000 : 0,
		backgrounds: [BACKGROUNDS[0].id],
		currentBackgroundId: BACKGROUNDS[0].id,
	});

	const lastSavedBananaCount = ref(0);
	const saveTimeout = ref<NodeJS.Timeout | null>(null);

	const soundEffects = ref(true);
	const showNavigation = ref(false);
	const playerMobileLandscape = ref(false);

	const yaStore = useYandexSDKStore();
	const leaderboardStore = useLeaderboardStore();

	const toggleNavigation = (isActive?: boolean) => {
		if (isActive) {
			showNavigation.value = isActive;
		} else {
			showNavigation.value = !showNavigation.value;
		}
	};

	const saveBackground = async (backgroundId: number) => {
		const bgItem = BACKGROUNDS.find((i) => i.id === backgroundId)!;

		player.bananas = player.bananas - bgItem.price;
		player.backgrounds.push(backgroundId);

		await savePlayerData();
	};

	const addBananasPerClick = (): void => {
		player.bananas = player.bananas + player.priceOneClick;
	};

	async function savePlayerData(): Promise<void> {
		try {
			await yaStore.playerSetData(
				{
					boosts: [...player.boosts],
					backgrounds: [...player.backgrounds],
				},
				true
			);
			console.log('savePlayerData - saved!');
		} catch (error) {
			console.error('savePlayerData', error);
		}
	}

	async function savePlayerStats(): Promise<void> {
		try {
			await yaStore.playerSetStats({
				bananas: player.bananas,
				priceOneClick: player.priceOneClick,
				currentBackgroundId: player.currentBackgroundId,
			});
			console.log('savePlayerStats - saved!');
		} catch (error) {
			console.error('savePlayerStats', error);
		}
	}

	async function savePlayerBoost(boost: IBoostStore): Promise<void> {
		player.bananas = player.bananas - boost.price;
		player.priceOneClick += boost.bananas;
		player.boosts.push(boost.id);

		await savePlayerData();
	}

	const loadPlayerData = async () => {
		if (!yaStore.isReady) return;

		const _player = await yaStore.initPlayer();

		if (!_player) return;

		// USER
		player.id = _player.getUniqueID();
		player.username = _player.getName() ?? UNKNOWN_NAME;

		// BANANAS
		const arrStatKeys = ['bananas', 'priceOneClick', 'currentBackgroundId'];
		const playerGameStats = await _player.getStats(arrStatKeys);
		console.log('playerGameStats', playerGameStats);

		Object.entries(playerGameStats).forEach(([key, value]) => {
			if (key in player) {
				// @ts-expect-error Тип "number" не может быть назначен для типа "never".ts(2322)
				player[key as keyof typeof player] = value;
			}
		});

		// BOOSTS
		const playerGameData = await _player.getData(['boosts', 'backgrounds']);
		console.log('playerGameData', playerGameData);

		if (playerGameData?.boosts) {
			player.boosts = playerGameData.boosts;
			console.log('playerGameData boosts', playerGameData.boosts);
		}

		// BACKGROUNDS
		if (playerGameData?.backgrounds) {
			player.backgrounds = playerGameData.backgrounds;
			console.log('playerGameData backgrounds', playerGameData.backgrounds);
		}

		// IS READY FOR GAME
		yaStore.ysdk?.features.LoadingAPI.ready();
	};

	async function saveInDatabases() {
		// Если ничего не изменилось, не сохраняем
		if (player.bananas === lastSavedBananaCount.value) return;

		try {
			savePlayerStats();
			leaderboardStore.savePlayerInLeaderboard();

			// Обновляем последнее сохранённое значение
			lastSavedBananaCount.value = player.bananas;
		} catch (error) {
			console.error('[saveInDatabases] Ошибка сохранения бананов:', error);
		}
	}

	function watcherUpdateBananas() {
		// Если таймер уже запущен, сбрасываем его
		if (saveTimeout.value) {
			clearTimeout(saveTimeout.value);
		}

		// Ставим новый таймер (отправка раз в 2 секунды)
		saveTimeout.value = setTimeout(saveInDatabases, 2000);
	}

	const changePlayerMobileLandscape = () => {
		if (isMobileLandscape()) {
			playerMobileLandscape.value = true;
		} else {
			playerMobileLandscape.value = false;
		}
	};

	// проблема: при loadPlayerData сохранение тоже срабатывает
	watch(() => player.bananas, watcherUpdateBananas);

	// проверяем загрузился ли Yandex SDK
	watchEffect(loadPlayerData);

	return {
		player,
		soundEffects,
		showNavigation,
		playerMobileLandscape,

		toggleNavigation,
		addBananasPerClick,

		savePlayerBoost,
		savePlayerStats,
		saveBackground,

		changePlayerMobileLandscape,
	};
});
