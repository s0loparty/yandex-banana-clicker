import { FIREBASE_DB_PATH } from '@/constants';
import { useUserStore } from '@/stores/useUserStore';
import { useYandexSDKStore } from '@/stores/useYandexSDKStore';
import { Player } from '@/types/firebase';
import {
	ref,
	set,
	get,
	getDatabase,
	query,
	orderByChild,
	limitToLast,
} from 'firebase/database';

const useFirebase = () => {
	const database = getDatabase();
	const userStore = useUserStore();
	const yaStore = useYandexSDKStore();

	// Функция сохранения результата игрока
	async function savePlayerScore(): Promise<void> {
		if (!userStore.user.id) return;

		// если игрок не авторизован - не сохраняем его в бд
		if (!yaStore.isPlayerAuthoreized) return;

		const uid: string = userStore.user.id;
		const username = userStore.user.username;
		const score = userStore.user.bananas;

		const playerRef = ref(database, `${FIREBASE_DB_PATH}/${uid}`);

		try {
			const snapshot = await get(playerRef);

			if (snapshot.exists()) {
				const existingScore: number = snapshot.val().score;
				if (score > existingScore) {
					await set(playerRef, { username, score });
				}
			} else {
				await set(playerRef, { username, score });
			}

			console.log('[savePlayerScore] игрок сохранён');
		} catch (error) {
			console.error('[savePlayerScore] Ошибка при сохранении игрока:', error);
		}
	}

	// Функция для получения ТОП-игроков
	async function getTopPlayers(): Promise<Player[]> {
		const playersRef = ref(database, FIREBASE_DB_PATH);
		const topPlayersQuery = query(playersRef, orderByChild('score'), limitToLast(5));

		try {
			const snapshot = await get(topPlayersQuery);
			if (!snapshot.exists()) return [];

			// Firebase возвращает объекты, преобразуем их в массив
			// const players: Player[] = Object.values(snapshot.val()) as Player[];
			const players: Player[] = Object.entries(snapshot.val()).map(
				([id, playerData]) => {
					// @ts-ignore
					return { id, ...playerData };
				}
			);

			// Сортируем от большего к меньшему (так как limitToLast берёт последних)
			return players.sort((a, b) => b.score - a.score);
		} catch (error) {
			console.error('[getTopPlayers] Ошибка при загрузке ТОП-игроков:', error);
			return [];
		}
	}

	return {
		savePlayerScore,
		getTopPlayers,
	};
};

export default useFirebase;
