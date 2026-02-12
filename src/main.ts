import './assets/main.css'
import './assets/anime.css'

// Shoelace setup
import '@shoelace-style/shoelace/dist/themes/light.css'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
