interface IUserStore {
	id: string | null;
	username?: string;
	priceOneClick: number;
	boosts: number[]; // сохраняем price буста
	bananas: number;
	backgrounds: number[];
	currentBackgroundId: number;
}

interface IBoostStore {
	price: number;
	label: string;
	icon: string;
	bananas: number;
	color: string;
	description: string;
}
