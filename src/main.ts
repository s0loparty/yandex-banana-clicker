import './assets/css/style.css';
import './assets/css/banana-object.css';
import './assets/css/backgrounds.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

import VueAnimXyz from '@animxyz/vue3';
import '@animxyz/core';

import MainLayout from './layouts/MainLayout.vue';

import { initializeApp } from 'firebase/app';
import firebaseConfig from './constants/firebase';

initializeApp(firebaseConfig);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueAnimXyz);

app.component('MainLayout', MainLayout);

app.mount('#app');
