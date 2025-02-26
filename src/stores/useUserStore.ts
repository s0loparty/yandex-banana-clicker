import { defineStore } from 'pinia';
import { reactive, ref, watch, watchEffect } from 'vue';
import { BACKGROUND_ELEMENT_ID, BACKGROUNDS } from '@/constants';
import { useYandexSDKStore } from './useYandexSDKStore';

export const useUserStore = defineStore('userStore', () => {
	const user = reactive<IUserStore>({
		id: null,
		username: '',
		boosts: [],
		priceOneClick: 1,
		bananas: 0,
		backgrounds: [BACKGROUNDS[0].id],
		currentBackgroundId: BACKGROUNDS[0].id,
	});

	const soundEffects = ref(true);

	const ya = useYandexSDKStore();

	const saveBackground = async (backgroundId: number) => {
		user.backgrounds.push(backgroundId);

		try {
			await ya.playerSetData({ backgrounds: user.backgrounds });
			console.log('saveBackground - saved!');
		} catch (error) {
			console.error('saveBackground', error);
		}
	};

	const addBananasPerClick = (): void => {
		user.bananas = user.bananas + user.priceOneClick;
	};

	async function savePlayerStats(): Promise<void> {
		try {
			await ya.playerSetStats({
				bananas: user.bananas,
				priceOneClick: user.priceOneClick,
			});
			console.log('savePlayerStats - saved!');
		} catch (error) {
			console.error('savePlayerStats', error);
		}
	}

	async function savePlayerBoost(): Promise<void> {
		try {
			await ya.playerSetData({ boosts: [...user.boosts] }, true);
			console.log('savePlayerBoost - saved!');
		} catch (error) {
			console.error('savePlayerBoost', error);
		}
	}

	const loadUserData = async () => {
		if (!ya.isReady) return;

		const player = await ya.initPlayer();

		if (!player) return;
		console.log('player', player);

		// USER
		user.id = player.getUniqueID();
		user.username = player.getName();

		// BANANAS
		const playerGameStats = await player.getStats(['bananas', 'priceOneClick']);
		if (playerGameStats?.bananas) {
			user.bananas = playerGameStats.bananas;
			console.log('playerGameStats bananas', playerGameStats.bananas);
		}

		// PRICE ONE CLICK
		if (playerGameStats?.priceOneClick) {
			user.priceOneClick = playerGameStats.priceOneClick;
			console.log('playerGameStats priceOneClick', playerGameStats.priceOneClick);
		}

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
		ya.ysdk?.features.LoadingAPI.ready();
	};

	/**
	 * Сохраняем данные каждые 20 бананов * priceOneClick
	 * @param bananas
	 */
	const watcherSavePlayerStats = (bananas: number) => {
		const TRIGGER = 20 * user.priceOneClick;

		if (bananas % TRIGGER === 0) {
			savePlayerStats();
		}
	};

	const watcherBackground = (id: number) => {
		const el = document.querySelector(BACKGROUND_ELEMENT_ID)!;
		const elClass = BACKGROUNDS.find((i) => i.id === id)!.class;

		BACKGROUNDS.forEach((bg) => {
			if (bg.id === id) {
				el.classList.add(elClass);
			} else {
				el.classList.remove(bg.class);
			}
		});
	};

	// проблема: при loadUserData сохранение тоже срабатывает
	watch(() => user.bananas, watcherSavePlayerStats);

	watch(() => user.currentBackgroundId, watcherBackground);

	// проверяем загрузился ли Yandex SDK
	watchEffect(loadUserData);

	return {
		user,
		soundEffects,
		addBananasPerClick,
		savePlayerBoost,
		savePlayerStats,
		saveBackground,
	};
});
