import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons';

createApp(App)
                .use(store)
                .use(router)
                .component('BootstrapIcon', BootstrapIcon)
                .mount('#app')
