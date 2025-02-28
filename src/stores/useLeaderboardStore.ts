import { LeaderboardEntry, Leaderboards } from '@/types/yandexSDK';
import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';
import { useYandexSDKStore } from './useYandexSDKStore';
import { YANDEX_COUNT_TOP_PLAYERS, YANDEX_LEADERBOARD_NAME } from '@/constants';
import { useUserStore } from './useUserStore';

export const useLeaderboardStore = defineStore('leaderboardStore', () => {
	const yaStore = useYandexSDKStore();
	const userStore = useUserStore();

	const entries = ref<LeaderboardEntry[] | null>(null);
	const lb = ref<Leaderboards | null>(null);

	const savePlayerInLeaderboard = async () => {
		// Чтобы проверить доступность метода для пользователя
		const isOk = await yaStore.ysdk?.isAvailableMethod(
			'leaderboards.setLeaderboardScore'
		);

		if (!isOk || !lb.value) return;

		await lb.value.setLeaderboardScore(YANDEX_LEADERBOARD_NAME, userStore.user.bananas);
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

		entries.value = result.entries;
	};

	// check "yaStore.ysdk"
	watchEffect(loadPlayersFromYandex);

	return {
		entries,

		savePlayerInLeaderboard,
	};
});
