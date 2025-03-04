import { useUserStore } from '@/stores/useUserStore';
import usePreloadMedia from './usePreloadMedia';

import { Howl, HowlOptions } from 'howler';

const useSoundEffects = () => {
	const storeUser = useUserStore();
	const { soundClick, soundBoost, soundBackground, soundExplosion } = usePreloadMedia();

	const howlPlay = (soundSource: string | string[], options?: HowlOptions) => {
		const sound = new Howl({
			src: typeof soundSource === 'string' ? [soundSource] : [...soundSource],
			volume: 0.3,
			autoplay: true,
			...options,
		});

		sound.on('end', sound.unload);
	};

	const playBananaClick = (): void => {
		if (!storeUser.soundEffects) return;

		howlPlay(soundClick);
	};

	const playPayBoost = (): void => {
		howlPlay(soundBoost);
	};

	const playPayBackground = (): void => {
		howlPlay(soundBackground);
	};

	const playExplosion = () => {
		howlPlay(soundExplosion);
	};

	return {
		playBananaClick,
		playPayBoost,
		playPayBackground,
		playExplosion,
	};
};

export default useSoundEffects;
