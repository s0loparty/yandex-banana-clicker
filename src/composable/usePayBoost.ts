import { usePlayerStore } from '@/stores/usePlayerStore';
import useSoundEffects from '@/composable/useSoundEffects';
import { computed } from 'vue';
import { BOOSTS } from '@/constants/boosts';
import { IBoostStore } from '@/types';

const usePayBoost = () => {
	const playerStore = usePlayerStore();

	const { playPayBoost } = useSoundEffects();

	const isBoostPayed = (boost: IBoostStore): boolean => {
		return !!playerStore.player.boosts.find((id) => id === boost.id);
	};

	const canBuyBoost = computed(() => {
		return !!BOOSTS.find((boost) => {
			return playerStore.player.bananas >= boost.price && !isBoostPayed(boost);
		});
	});

	const handlePay = async (boost: IBoostStore) => {
		playPayBoost();

		await playerStore.savePlayerBoost(boost);
		await playerStore.savePlayerStats();
	};

	return {
		handlePay,
		isBoostPayed,
		canBuyBoost,
	};
};

export default usePayBoost;
