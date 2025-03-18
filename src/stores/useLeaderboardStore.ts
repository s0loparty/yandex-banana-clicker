import { LeaderboardEntry, Leaderboards } from '@/types/yandexSDK';
import { defineStore } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { useYandexSDKStore } from './useYandexSDKStore';
import { YANDEX_COUNT_TOP_PLAYERS, YANDEX_LEADERBOARD_NAME } from '@/constants';
import { usePlayerStore } from './usePlayerStore';
import { BACKGROUNDS } from '@/constants/backgrounds';
import { BOOSTS } from '@/constants/boosts';

export const useLeaderboardStore = defineStore('leaderboardStore', () => {
	const yaStore = useYandexSDKStore();
	const playerStore = usePlayerStore();

	const entries = ref<LeaderboardEntry[] | null>(null);
	const lb = ref<Leaderboards | null>(null);

	const backgroundList = computed(() => {
		return playerStore.player.backgrounds.map((bid) => {
			return BACKGROUNDS.find((bg) => bg.id === bid)!.shortname;
		});
	});

	const savePlayerInLeaderboard = async () => {
		// Чтобы проверить доступность метода для пользователя
		const isOk = await yaStore.ysdk?.isAvailableMethod(
			'leaderboards.setLeaderboardScore'
		);

		if (!isOk || !lb.value) return;

		// общая ценность
		const totalBanans = () => {
			const totalPriceBoosts = playerStore.player.boosts
				.map((bid) => {
					return BOOSTS.find((boost) => boost.id === bid)!;
				})
				.reduce((p, c) => {
					return p + c.price;
				}, 0);

			const totalPriceBG = playerStore.player.backgrounds
				.map((bid) => {
					return BACKGROUNDS.find((bg) => bg.id === bid)!;
				})
				.reduce((p, c) => {
					return p + c.price;
				}, 0);

			return totalPriceBoosts + totalPriceBG + playerStore.player.bananas;
		};

		const extraData = JSON.stringify({
			boosts: playerStore.player.boosts.length,
			backgrounds: backgroundList.value.join(', '),
		});

		await lb.value.setLeaderboardScore(
			YANDEX_LEADERBOARD_NAME,
			totalBanans(),
			extraData
		);
		console.log('[savePlayerInLeaderboard] saved!');
	};

	const loadPlayersFromYandex = async () => {
		if (!yaStore.ysdk) return;

		console.warn('loadPlayersFromYandex triggered');

		lb.value = await yaStore.ysdk.getLeaderboards();

		const result = await lb.value.getLeaderboardEntries(YANDEX_LEADERBOARD_NAME, {
			includeUser: false,
			quantityTop: YANDEX_COUNT_TOP_PLAYERS,
		});

		entries.value = await Promise.all(
			result.entries.map(async (ent) => {
				if (!ent.extraData) {
					const extraDataJson = {
						boosts: playerStore.player.boosts.length,
						backgrounds: backgroundList.value.join(', '),
					};
					return { ...ent, extraData: extraDataJson };
				}

				const extraDataJson = await JSON.parse(`${ent.extraData}`);
				return { ...ent, extraData: extraDataJson };
			})
		);

		// entries.value = result.entries;
	};

	// check "yaStore.ysdk"
	watchEffect(loadPlayersFromYandex);

	return {
		entries,

		savePlayerInLeaderboard,
	};
});
