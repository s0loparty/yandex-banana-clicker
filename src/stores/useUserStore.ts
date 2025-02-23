import { defineStore } from 'pinia';
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { BOOSTS } from '@/constants';
import { useYandexSDK } from '@/composable/useYandexSDK';

export const useUserStore = defineStore('userStore', () => {
	const user = reactive<IUserStore>({
		id: 0,
		username: '',
		boosts: [],
		priceOneClick: 1,
		bananas: 0,
	});

	const soundEffects = ref(true);

	const ya = useYandexSDK();

	// куплен ли буст
	const isBoostPayed = (boost: IBoostStore): boolean => {
		return !!user.boosts.find((price) => price === boost.price);
	};

	// может ли купить буст
	const canBuyBoost = computed(() => {
		return !!BOOSTS.find((boost) => {
			return user.bananas >= boost.price && !isBoostPayed(boost);
		});
	});

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
		if (!ya.isReady.value) return;

		const player = await ya.initPlayer();

		if (!player) return;
		console.log('player', player);

		// USERNAME
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
		console.log(await player.getData());

		const playerGameData = await player.getData(['boosts']);
		if (playerGameData?.boosts) {
			user.boosts = playerGameData.boosts;
			console.log('playerGameData boosts', playerGameData.boosts);
		}
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

	// проблема: при loadUserData сохранение тоже срабатывает
	watch(() => user.bananas, watcherSavePlayerStats);

	// проверяем загрузился ли Yandex SDK
	watchEffect(loadUserData);

	return {
		user,
		soundEffects,
		isBoostPayed,
		canBuyBoost,
		addBananasPerClick,
		savePlayerBoost,
		savePlayerStats,
	};
});
