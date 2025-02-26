import confetti from 'canvas-confetti';

const useConfetti = () => {
	const DEFAULT = {
		spread: 360,
		ticks: 100,
		gravity: 0,
		decay: 0.93,
		startVelocity: 20,
	};

	const bananasEffect = () => {
		const scalar = 2;
		const banana = confetti.shapeFromText({ text: '🍌', scalar });

		const options = {
			...DEFAULT,
			shapes: [banana],
			scalar,
		};

		confetti({
			...options,
			particleCount: 60,
		});

		confetti({
			...options,
			particleCount: 50,
		});

		confetti({
			...options,
			particleCount: 40,
			scalar: scalar / 2,
			shapes: ['circle'],
		});
	};

	const backgroundsEffect = () => {
		const scalar = 2;

		const options = {
			...DEFAULT,
			shapes: [
				confetti.shapeFromText({ text: '🌈', scalar }),
				confetti.shapeFromText({ text: '⚡️', scalar }),
				confetti.shapeFromText({ text: '💥', scalar }),
				confetti.shapeFromText({ text: '✨', scalar }),
				confetti.shapeFromText({ text: '💫', scalar }),
			],
			scalar,
		};

		confetti({
			...options,
			particleCount: 60,
		});

		confetti({
			...options,
			particleCount: 50,
		});

		confetti({
			...options,
			particleCount: 40,
			scalar: scalar / 2,
			shapes: ['circle'],
		});
	};

	return { confetti, bananasEffect, backgroundsEffect };
};

export default useConfetti;
