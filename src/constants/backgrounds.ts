import BGDefault from '@/assets/backgrounds/default.webp';
import BGSpace from '@/assets/backgrounds/space.webp';
import BGJungle from '@/assets/backgrounds/jungle.webp';
import BGUnderground from '@/assets/backgrounds/underground.webp';
import BGMinecraft from '@/assets/backgrounds/minecraft.webp';
import BGDetective from '@/assets/backgrounds/detective.webp';

type BackgroundOption = {
	id: number;
	price: number;
	class: string;
	shortname: string;
	description: string;
	source: string;
};

export const BACKGROUNDS: BackgroundOption[] = [
	{
		id: 1,
		price: 0,
		class: 'default',
		shortname: 'обычный',
		description:
			'Банановый хаос: весёлый узор из ярких бананов, разбросанных в художественном беспорядке 🍌🎨✨',
		source: BGDefault,
	},
	{
		id: 2,
		price: 1500,
		class: 'space',
		shortname: 'космос',
		description:
			'Космический банановый шторм: глубокий космос, наполненный светящимися бананами, парящими среди далёких галактик 🍌✨',
		source: BGSpace,
	},
	{
		id: 3,
		price: 3000,
		class: 'jungle',
		shortname: 'джунгли',
		description:
			'Мягкий солнечный свет пробивается сквозь листву, создавая уютную атмосферу. Передаёт дух приключений в мире банана-кликера! 🍌🌿',
		source: BGJungle,
	},
	{
		id: 4,
		price: 5000,
		class: 'detective',
		shortname: 'нуар',
		description:
			'Мрачный город окутан туманом. Таинственный детектив-банан в плаще, скрывающийся в тени. Атмосфера нуара, полная загадок и тайн. 🍌🕵️‍♂️🌆',
		source: BGDetective,
	},
	{
		id: 5,
		price: 8000,
		class: 'minecraft',
		shortname: 'майнкрафт',
		description:
			'Пиксельные места перенесут тебя в знакомое пространство. Идеальное место для сбора бананов! 🟨🟩',
		source: BGMinecraft,
	},
	{
		id: 6,
		price: 10000,
		class: 'underground',
		shortname: 'подземелье',
		description:
			'Подземелье бананового короля: таинственные каменные стены, слабо освещённые факелами, а повсюду разбросаны золотистые бананы, хранящие древние секреты 🍌🔥🔮',
		source: BGUnderground,
	},
];
