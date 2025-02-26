import { useUserStore } from '@/stores/useUserStore';
import soundClick from '@/assets/sounds/click.mp3';
import soundBoost from '@/assets/sounds/boost.mp3';
import soundBackground from '@/assets/sounds/boost.mp3';

const useSoundEffects = () => {
	const storeUser = useUserStore();

	const playBananaClick = (): void => {
		if (!storeUser.soundEffects) return;

		const audio = new Audio(soundClick);

		audio.volume = 0.3;

		audio.pause();
		audio.currentTime = 0;

		audio.play();
	};

	const playPayBoost = (): void => {
		const audio = new Audio(soundBoost);

		audio.volume = 0.3;

		audio.pause();
		audio.currentTime = 0;

		audio.play();
	};

	const playPayBackground = (): void => {
		const audio = new Audio(soundBackground);

		audio.volume = 0.3;

		audio.pause();
		audio.currentTime = 0;

		audio.play();
	};

	return {
		playBananaClick,
		playPayBoost,
		playPayBackground,
	};
};

export default useSoundEffects;

