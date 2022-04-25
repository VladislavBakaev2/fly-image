import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons';
import axios from 'axios'

const base = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API
  });

const app = createApp(App)
                .use(store)
                .use(router)
                .component('BootstrapIcon', BootstrapIcon)

app.config.globalProperties.$http = base
app.mount('#app')