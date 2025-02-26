import { createWebHashHistory, createRouter } from 'vue-router';

import IndexView from '@/views/index.vue';
import BoostsView from '@/views/boosts.vue';
import BackgroundsView from '@/views/backgrounds.vue';

const routes = [
	{ path: '/', name: 'main', component: IndexView, meta: { layout: 'Main' } },
	{ path: '/boosts', name: 'boosts', component: BoostsView, meta: { layout: 'Main' } },
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

export default router;
