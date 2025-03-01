interface IUserStore {
	id: string | null;
	username: string;
	priceOneClick: number;
	boosts: number[]; // сохраняем price буста
	bananas: number;
	backgrounds: number[]; // сохраняем id фона
	currentBackgroundId: number;
}

interface IBoostStore {
	id: number;
	price: number;
	label: string;
	icon: string;
	bananas: number;
	color: string;
	description: string;
}
