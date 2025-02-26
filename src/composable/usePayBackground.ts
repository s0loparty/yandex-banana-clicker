import { computed } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import useSoundEffects from './useSoundEffects';
import { BACKGROUNDS } from '@/constants';

const usePayBackground = () => {
	const userStore = useUserStore();
	const { playPayBackground } = useSoundEffects();

	const isBackgroundPayed = (backgroundId: number): boolean => {
		return !!userStore.user.backgrounds.find((id) => id === backgroundId);
	};

	const canBuyBackground = computed(() => {
		return !!BACKGROUNDS.find((background) => {
			return (
				userStore.user.bananas >= background.price &&
				!isBackgroundPayed(background.id)
			);
		});
	});

	const notCanPayBackgroundByPrice = computed(() => {
		return (price: number) => {
			return userStore.user.bananas < price;
		};
	});

	const payed = computed(() => {
		return (id: number) => {
			return userStore.user.backgrounds.includes(id);
		};
	});

	const setBackground = (id: number) => {
		userStore.user.currentBackgroundId = id;
	};

	const handlePay = async (backgroundID: number) => {
		playPayBackground();

		userStore.saveBackground(backgroundID);
	};

	return {
		handlePay,
		isBackgroundPayed,
		canBuyBackground,
		notCanPayBackgroundByPrice,
		payed,
		setBackground,
	};
};

export default usePayBackground;
