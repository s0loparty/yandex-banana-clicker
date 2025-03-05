import { BACKGROUNDS } from '@/constants/backgrounds';
import { Howl } from 'howler';

import soundClick from '@/assets/sounds/click.mp3';
import soundBoost from '@/assets/sounds/boost.mp3';
import soundBackground from '@/assets/sounds/background.mp3';
import soundExplosion from '@/assets/sounds/explosion.wav';
import soundNyam from '@/assets/sounds/nyam.mp3';

const usePreloadMedia = () => {
	const backgrounds = BACKGROUNDS.map((b) => b.source);
	const sounds = [soundClick, soundBoost, soundBackground, soundExplosion, soundNyam];

	const preloadImages = (urls: string[]) => {
		urls.forEach((url) => {
			const img = new Image();
			img.src = url;
		});
	};

	const preloadAudio = (urls: string[]) => {
		new Howl({
			src: urls,
			mute: true,
			preload: true,
			html5: false,
			volume: 0,
		});
	};

	const preloadMedia = () => {
		preloadImages(backgrounds);
		preloadAudio(sounds);
	};

	return {
		preloadMedia,
		soundClick,
		soundBoost,
		soundBackground,
		soundExplosion,
		soundNyam,
	};
};

export default usePreloadMedia;
