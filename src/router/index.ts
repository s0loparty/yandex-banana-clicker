import { createWebHashHistory, createRouter } from 'vue-router';

import IndexView from '@/views/index.vue';
import BoostsView from '@/views/boosts.vue';
import TopView from '@/views/top.vue';
import BackgroundsView from '@/views/backgrounds.vue';
import { useYandexSDKStore } from '@/stores/useYandexSDKStore';

const routes = [
	{ path: '/', name: 'main', component: IndexView, meta: { layout: 'Main' } },
	{ path: '/boosts', name: 'boosts', component: BoostsView, meta: { layout: 'Main' } },
	{ path: '/top', name: 'top', component: TopView, meta: { layout: 'Main' } },
	{
		path: '/backgrounds',
		name: 'backgrounds',
		component: BackgroundsView,
		meta: { layout: 'Main' },
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

// router.beforeEach(async (to, _, next) => {
// 	next();
// });

router.afterEach((to) => {
	const yaStore = useYandexSDKStore();

	if (to.name === 'main') {
		yaStore.ysdk?.features.GameplayAPI.start();
	} else {
		yaStore.ysdk?.features.GameplayAPI.stop();
	}
});

export default router;
