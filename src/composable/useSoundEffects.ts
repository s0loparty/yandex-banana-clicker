import { usePlayerStore } from '@/stores/usePlayerStore';
import usePreloadMedia from './usePreloadMedia';

import { Howl, HowlOptions } from 'howler';

const useSoundEffects = () => {
	const playerStore = usePlayerStore();
	const { soundClick, soundBoost, soundBackground, soundExplosion, soundNyam } =
		usePreloadMedia();

	const howlPlay = (soundSource: string | string[], options?: HowlOptions) => {
		const sound = new Howl({
			src: typeof soundSource === 'string' ? [soundSource] : [...soundSource],
			volume: 0.3,
			autoplay: true,
			preload: true,
			html5: false,
			...options,
		});

		sound.on('end', sound.unload);
	};

	const playBananaClick = (): void => {
		if (!playerStore.soundEffects) return;

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

	const playNyam = () => {
		howlPlay(soundNyam);
	};

	return {
		playBananaClick,
		playPayBoost,
		playPayBackground,
		playExplosion,
		playNyam,
	};
};

export default useSoundEffects;
