import { BACKGROUNDS } from '@/constants/backgrounds';

import soundClick from '@/assets/sounds/click.mp3';
import soundBoost from '@/assets/sounds/boost.mp3';
import soundBackground from '@/assets/sounds/background.mp3';
import soundExplosion from '@/assets/sounds/explosion.wav';

const usePreloadMedia = () => {
	const backgrounds = BACKGROUNDS.map((b) => b.source);
	const sounds = [soundClick, soundBoost, soundBackground, soundExplosion];

	const preloadImages = (urls: string[]) => {
		urls.forEach((url) => {
			const img = new Image();
			img.src = url;
		});
	};

	const preloadAudio = (urls: string[]) => {
		urls.forEach((url) => {
			const audio = new Audio();
			audio.preload = 'auto';
			audio.src = url;
		});
	};

	const preloadMedia = () => {
		preloadImages(backgrounds);
		preloadAudio(sounds);
	};

	return { preloadMedia, soundClick, soundBoost, soundBackground, soundExplosion };
};

export default usePreloadMedia;
