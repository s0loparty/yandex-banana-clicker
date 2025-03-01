import BGDefault from '@/assets/backgrounds/default.webp';
import BGSpace from '@/assets/backgrounds/space.webp';
import BGJungle from '@/assets/backgrounds/jungle.webp';
import BGUnderground from '@/assets/backgrounds/underground.webp';

export const FIREBASE_DB_PATH = 'yandex-banana-clicker-top';
export const YANDEX_COUNT_TOP_PLAYERS = 50;
export const YANDEX_LEADERBOARD_NAME = 'bananaTopPlayers';

export const UNKNOWN_NAME = 'неизвестный игрок';

export const BOOSTS: IBoostStore[] = [
	{
		id: 1,
		price: 100,
		label: 'Бумеранг банана',
		icon: '🍌',
		bananas: 1,
		color: '#ff6b6b',
		description: 'Твой клик как бумеранг, возвращается к тебе',
	},
	{
		id: 2,
		price: 500,
		label: 'Суперспринт',
		icon: '🏃',
		bananas: 2,
		color: '#6bd9ff',
		description: 'Ты уже встал на дорожку с которой не сойти',
	},
	{
		id: 3,
		price: 800,
		label: 'Взрыв банана',
		icon: '💥',
		bananas: 3,
		color: '#ffcc6b',
		description: 'Твои клики РАЗРЫВАЮТ всю банановую тусовку',
	},
	{
		id: 4,
		price: 1200,
		label: 'Невидимый банан',
		icon: '👀',
		bananas: 4,
		color: '#b36bff',
		description: 'Ты их не видишь, а они есть',
	},
	{
		id: 5,
		price: 1500,
		label: 'Банан + Миньоны',
		icon: '🤪',
		bananas: 5,
		color: '#ff6bda',
		description: 'Маленькие злодеи охотятся за бананами вместе с тобой',
	},
	{
		id: 6,
		price: 1900,
		label: 'Банановый щит',
		icon: '🛡️',
		bananas: 6,
		color: '#6bff88',
		description: 'Твоими бананами можно защищать детей, женщин и стариков',
	},
	{
		id: 7,
		price: 2500,
		label: 'Клонирование бананов',
		icon: '🍌🍌🍌',
		bananas: 7,
		color: '#ffcf6b',
		description: 'Банановый банан Банановый банан Банановый банан',
	},
	{
		id: 8,
		price: 4000,
		label: 'Шокирующий банан',
		icon: '⚡️',
		bananas: 8,
		color: '#6b8aff',
		description: 'ШОК КОНТЕНТ!!! Бананов ещё больше!',
	},
	{
		id: 9,
		price: 7000,
		label: 'Телепортация банана',
		icon: '🌀',
		bananas: 9,
		color: '#ffec6b',
		description: 'Банан там, банан тут, банан вон там и вот здесь и ещё один вооон там',
	},
	{
		id: 10,
		price: 10000,
		label: 'Вихрь бананов',
		icon: '🌪️',
		bananas: 10,
		color: '#6bf0ff',
		description: 'Кому-то бананы вскружили голову??)))',
	},
	{
		id: 11,
		price: 15000,
		label: 'Турбобананы',
		icon: '🔥🔥🔥',
		bananas: 20,
		color: '#34d987',
		description: 'Ты как Вин Дизель — бананы твоя семья',
	},
	{
		id: 12,
		price: 50000,
		label: 'Банановая мощь',
		icon: '🦾',
		bananas: 35,
		color: '#ff6f9b',
		description: 'Дуэйн (Банан) Джонсон - нерушимая скала из бананов',
	},
	{
		id: 13,
		price: 100000,
		label: 'Банан Зевса',
		icon: '🍌',
		bananas: 55,
		color: '#ffffff',
		description: 'Зевс ультует',
	},
	{
		id: 14,
		price: 500000,
		label: 'Банановый Дзен',
		icon: '💫',
		bananas: 99,
		color: '#56a8ff',
		description:
			'Постиг Банановый Дзен и стал лучим из лучших, среди всех улетных улётов, ты — лучший!',
	},
];

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
		price: 7000,
		class: 'jungle',
		description:
			'Мягкий солнечный свет пробивается сквозь листву, создавая уютную атмосферу. Передаёт дух приключений в мире банана-кликера! 🍌🌿',
		source: BGJungle,
	},
	{
		id: 4,
		price: 15000,
		class: 'underground',
		description:
			'Подземелье бананового короля: таинственные каменные стены, слабо освещённые факелами, а повсюду разбросаны золотистые бананы, хранящие древние секреты 🍌🔥🔮',
		source: BGUnderground,
	},
];
