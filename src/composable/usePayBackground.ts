import { computed } from 'vue';
import { usePlayerStore } from '@/stores/usePlayerStore';
import useSoundEffects from './useSoundEffects';
import { BACKGROUNDS } from '@/constants/backgrounds';

const usePayBackground = () => {
	const playerStore = usePlayerStore();
	const { playPayBackground } = useSoundEffects();

	const isBackgroundPayed = (backgroundId: number): boolean => {
		return !!playerStore.player.backgrounds.find((id) => id === backgroundId);
	};

	const canBuyBackground = computed(() => {
		return !!BACKGROUNDS.find((background) => {
			return (
				playerStore.player.bananas >= background.price &&
				!isBackgroundPayed(background.id)
			);
		});
	});

	const notCanPayBackgroundByPrice = computed(() => {
		return (price: number) => {
			return playerStore.player.bananas < price;
		};
	});

	const payed = computed(() => {
		return (id: number) => {
			return playerStore.player.backgrounds.includes(id);
		};
	});

	const currentBackground = computed<(typeof BACKGROUNDS)[0]>(() => {
		return BACKGROUNDS.find((b) => b.id === playerStore.player.currentBackgroundId)!;
	});

	const setBackground = (id: number) => {
		playerStore.player.currentBackgroundId = id;
	};

	const handlePay = async (backgroundID: number) => {
		playPayBackground();

		playerStore.saveBackground(backgroundID);
	};

	return {
		handlePay,
		isBackgroundPayed,
		canBuyBackground,
		notCanPayBackgroundByPrice,
		payed,
		currentBackground,
		setBackground,
	};
};

export default usePayBackground;
