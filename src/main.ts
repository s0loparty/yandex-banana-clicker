import './style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

import VueAnimXyz from '@animxyz/vue3';
import '@animxyz/core';

import MainLayout from './layouts/MainLayout.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueAnimXyz);

app.component('MainLayout', MainLayout);

app.mount('#app');
