interface IUserStore {
	id: number;
	username?: string;
	priceOneClick: number;
	boosts: IBoostStore[];
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

