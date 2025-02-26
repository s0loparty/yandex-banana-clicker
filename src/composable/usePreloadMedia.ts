import { BACKGROUNDS } from '@/constants';

import soundClick from '@/assets/sounds/click.mp3';
import soundBoost from '@/assets/sounds/boost.mp3';

const usePreloadMedia = () => {
	const backgrounds = BACKGROUNDS.map((b) => b.source);
	const sounds = [soundClick, soundBoost];

	const IS_DEV = import.meta.env.DEV;

	const preloadImages = (urls: string[]) => {
		urls.forEach((url) => {
			const img = new Image();
			img.src = url;

			if (IS_DEV) {
				console.log('[preloadImages]', img);
			}
		});
	};

	const preloadAudio = (urls: string[]) => {
		urls.forEach((url) => {
			const audio = new Audio();
			audio.preload = 'auto';
			audio.src = url;

			if (IS_DEV) {
				console.log('[preloadAudio]', audio);
			}
		});
	};

	const preloadMedia = () => {
		preloadImages(backgrounds);
		preloadAudio(sounds);
	};

	return { preloadMedia };
};

export default usePreloadMedia;
