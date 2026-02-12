import './assets/main.css'
import './assets/anime.css'
import './assets/sidebar.css'

// Shoelace setup
import '@shoelace-style/shoelace/dist/themes/light.css'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/')

// Register Material Icons
registerIconLibrary('material', {
    resolver: name => {
        const match = name.match(/^(.*?)(_(round|sharp|outline|twotone))?$/)
        return `https://cdn.jsdelivr.net/npm/@material-icons/svg@1.0.5/svg/${match[1]}/${match[3] || 'outline'}.svg`
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
})

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')