import { useUserStore } from '@/stores/useUserStore';
import useSoundEffects from '@/composable/useSoundEffects';
import { computed } from 'vue';
import { BOOSTS } from '@/constants/boosts';

const usePayBoost = () => {
	const storeUser = useUserStore();

	const { playPayBoost } = useSoundEffects();

	const isBoostPayed = (boost: IBoostStore): boolean => {
		return !!storeUser.user.boosts.find((id) => id === boost.id);
	};

	const canBuyBoost = computed(() => {
		return !!BOOSTS.find((boost) => {
			return storeUser.user.bananas >= boost.price && !isBoostPayed(boost);
		});
	});

	const handlePay = async (boost: IBoostStore) => {
		playPayBoost();

		await storeUser.savePlayerBoost(boost);
		await storeUser.savePlayerStats();
	};

	return {
		handlePay,
		isBoostPayed,
		canBuyBoost,
	};
};

export default usePayBoost;
