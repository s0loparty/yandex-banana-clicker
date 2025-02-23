interface IUserStore {
	id: number;
	username?: string;
	priceOneClick: number;
	// boosts: IBoostStore[];
	boosts: number[]; // сохраняем price буста
	bananas: number;
}

interface IBoostStore {
	price: number;
	label: string;
	icon: string;
	bananas: number;
	color: string;
	description: string;
}
