import { defineStore } from 'pinia';
import { onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { BACKGROUNDS, UNKNOWN_NAME } from '@/constants';
import { useYandexSDKStore } from './useYandexSDKStore';
import { useLeaderboardStore } from './useLeaderboardStore';

export const useUserStore = defineStore('userStore', () => {
	const user = reactive<IUserStore>({
		id: import.meta.env.DEV ? 'localhost' : null,
		username: UNKNOWN_NAME,
		boosts: [],
		priceOneClick: 1,
		bananas: 0,
		backgrounds: [BACKGROUNDS[0].id],
		currentBackgroundId: BACKGROUNDS[0].id,
	});

	const lastSavedBananaCount = ref(0);
	const saveTimeout = ref<NodeJS.Timeout | null>(null);

	const soundEffects = ref(true);

	const yaStore = useYandexSDKStore();
	const leaderboardStore = useLeaderboardStore();

	const saveBackground = async (backgroundId: number) => {
		const bgItem = BACKGROUNDS.find((i) => i.id === backgroundId)!;

		user.bananas = user.bananas - bgItem.price;
		user.backgrounds.push(backgroundId);

		try {
			await yaStore.playerSetData({ backgrounds: user.backgrounds });
			console.log('saveBackground - saved!');

			await savePlayerStats();
		} catch (error) {
			console.error('saveBackground', error);
		}
	};

	const addBananasPerClick = (): void => {
		user.bananas = user.bananas + user.priceOneClick;
	};

	async function savePlayerStats(): Promise<void> {
		try {
			await yaStore.playerSetStats({
				bananas: user.bananas,
				priceOneClick: user.priceOneClick,
				currentBackgroundId: user.currentBackgroundId,
			});
			console.log('savePlayerStats - saved!');
		} catch (error) {
			console.error('savePlayerStats', error);
		}
	}

	async function savePlayerBoost(): Promise<void> {
		try {
			await yaStore.playerSetData({ boosts: [...user.boosts] }, true);
			console.log('savePlayerBoost - saved!');
		} catch (error) {
			console.error('savePlayerBoost', error);
		}
	}

	const loadUserData = async () => {
		if (!yaStore.isReady) return;

		const player = await yaStore.initPlayer();

		if (!player) return;

		// USER
		user.id = player.getUniqueID();
		user.username = player.getName() ?? UNKNOWN_NAME;

		// BANANAS
		const arrStatKeys = ['bananas', 'priceOneClick', 'currentBackgroundId'];
		const playerGameStats = await player.getStats(arrStatKeys);
		console.log('playerGameStats', playerGameStats);

		Object.entries(playerGameStats).forEach(([key, value]) => {
			if (key in user) {
				// @ts-expect-error Тип "number" не может быть назначен для типа "never".ts(2322)
				user[key as keyof typeof user] = value;
			}
		});

		// BOOSTS
		const playerGameData = await player.getData(['boosts', 'backgrounds']);
		if (playerGameData?.boosts) {
			user.boosts = playerGameData.boosts;
			console.log('playerGameData boosts', playerGameData.boosts);
		}

		// BACKGROUNDS
		if (playerGameData?.backgrounds) {
			user.backgrounds = playerGameData.backgrounds;
			console.log('playerGameData backgrounds', playerGameData.backgrounds);
		}

		// IS READY FOR GAME
		yaStore.ysdk?.features.LoadingAPI.ready();
	};

	async function saveInDatabases() {
		// Если ничего не изменилось, не сохраняем
		if (user.bananas === lastSavedBananaCount.value) return;

		try {
			savePlayerStats();
			leaderboardStore.savePlayerInLeaderboard();

			// Обновляем последнее сохранённое значение
			lastSavedBananaCount.value = user.bananas;
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

	// проблема: при loadUserData сохранение тоже срабатывает
	watch(() => user.bananas, watcherUpdateBananas);

	// проверяем загрузился ли Yandex SDK
	watchEffect(loadUserData);

	// закрытие страницы
	onMounted(() => {
		window.addEventListener('beforeunload', savePlayerStats);
	});

	return {
		user,
		soundEffects,
		addBananasPerClick,
		savePlayerBoost,
		savePlayerStats,
		saveBackground,
	};
});
