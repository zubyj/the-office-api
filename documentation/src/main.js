import { createApp } from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag';

import './assets/main.css'

createApp(App).use(VueGtag, {
    config: { id: process.env.MEASUREMENT_ID }
}).mount('#app')
