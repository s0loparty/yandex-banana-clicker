import { useUserStore } from '@/stores/useUserStore';
import useSoundEffects from '@/composable/useSoundEffects';
import { computed } from 'vue';
import { BOOSTS } from '@/constants';

const usePayBoost = () => {
	const storeUser = useUserStore();

	const { playPayBoost } = useSoundEffects();

	const isBoostPayed = (boost: IBoostStore): boolean => {
		return !!storeUser.user.boosts.find((price) => price === boost.price);
	};

	const canBuyBoost = computed(() => {
		return !!BOOSTS.find((boost) => {
			return storeUser.user.bananas >= boost.price && !isBoostPayed(boost);
		});
	});

	const handlePay = async (boost: IBoostStore) => {
		playPayBoost();

		storeUser.$patch((state) => {
			// отнимает цену буста от общего кол-ва бананов
			// storeBanana.bananas = storeBanana.bananas - boost.price;
			state.user.bananas = state.user.bananas - boost.price;

			// добавляем буст к юзеру
			// добавляем кол-во бананов за 1 клик
			state.user.priceOneClick = boost.bananas + 1;
			state.user.boosts.push(boost.price);
		});

		await storeUser.savePlayerBoost();
		await storeUser.savePlayerStats();
	};

	return {
		handlePay,
		isBoostPayed,
		canBuyBoost,
	};
};

export default usePayBoost;
