import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import VueGtag from 'vue-gtag'

let GA_MEASUREMENT_ID = "G-MNPXNXSNWP"

createApp(App).use(VueGtag, {
    config : { id : GA_MEASUREMENT_ID }
}).mount('#app')
