import { defineStore } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { BOOSTS } from '@/constants';
import { useYandexSDK } from '@/composable/useYandexSDK';

export const useUserStore = defineStore('userStore', () => {
	const user = reactive<IUserStore>({
		id: 0,
		username: '',
		boosts: [],
		priceOneClick: 1,
		bananas: 0,
	});

	const soundEffects = ref(true);

	const { playerSetStats, playerSetData, playerGetStats, playerGetData } =
		useYandexSDK();

	// куплен ли буст
	const isBoostPayed = (boost: IBoostStore): boolean => {
		return !!user.boosts.find((b) => b.label === boost.label);
	};

	// может ли купить буст
	const canBuyBoost = computed(() => {
		return !!BOOSTS.find((boost) => {
			return user.bananas >= boost.price && !isBoostPayed(boost);
		});
	});

	const updateUserData = (userData: IUserStore): void => {
		for (const key in userData) {
			// @ts-ignore
			user[key] = userData[key];

			if (userData['boosts'] === undefined) {
				user.boosts = [];
			}
		}
	};

	const addBananasPerClick = (): void => {
		user.bananas = user.bananas + user.priceOneClick;
	};

	async function saveUserData(): Promise<void> {
		playerSetStats({ bananas: user.bananas });
	}

	async function saveBoost(): Promise<void> {
		playerSetData({ boosts: user.boosts });
	}

	watch(user, saveUserData, { deep: true });

	onMounted(async () => {
		const savedBananas = await playerGetStats(['bananas']);
		console.log('savedBananas', savedBananas);

		const savedBoosts = await playerGetData(['boosts']);
		console.log('savedBoosts', savedBoosts);
	});

	return {
		user,
		soundEffects,
		isBoostPayed,
		canBuyBoost,
		updateUserData,
		addBananasPerClick,
		saveBoost,
		saveUserData,
	};
});
