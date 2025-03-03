import BGDefault from '@/assets/backgrounds/default.webp';
import BGSpace from '@/assets/backgrounds/space.webp';
import BGJungle from '@/assets/backgrounds/jungle.webp';
import BGUnderground from '@/assets/backgrounds/underground.webp';
import BGMinecraft from '@/assets/backgrounds/minecraft.webp';
import BGDetective from '@/assets/backgrounds/detective.webp';

export const BACKGROUNDS = [
	{
		id: 1,
		price: 0,
		class: 'default',
		description:
			'Банановый хаос: весёлый узор из ярких бананов, разбросанных в художественном беспорядке 🍌🎨✨',
		source: BGDefault,
	},
	{
		id: 2,
		price: 1500,
		class: 'space',
		description:
			'Космический банановый шторм: глубокий космос, наполненный светящимися бананами, парящими среди далёких галактик 🍌✨',
		source: BGSpace,
	},
	{
		id: 3,
		price: 3000,
		class: 'jungle',
		description:
			'Мягкий солнечный свет пробивается сквозь листву, создавая уютную атмосферу. Передаёт дух приключений в мире банана-кликера! 🍌🌿',
		source: BGJungle,
	},
	{
		id: 4,
		price: 5000,
		class: 'detective',
		description:
			'Мрачный город окутан туманом. Таинственный детектив-банан в плаще, скрывающийся в тени. Атмосфера нуара, полная загадок и тайн. 🍌🕵️‍♂️🌆',
		source: BGDetective,
	},
	{
		id: 5,
		price: 8000,
		class: 'minecraft',
		description:
			'Пиксельные места перенесут тебя в знакомое пространство. Идеальное место для сбора бананов! 🟨🟩',
		source: BGMinecraft,
	},
	{
		id: 6,
		price: 10000,
		class: 'underground',
		description:
			'Подземелье бананового короля: таинственные каменные стены, слабо освещённые факелами, а повсюду разбросаны золотистые бананы, хранящие древние секреты 🍌🔥🔮',
		source: BGUnderground,
	},
];
