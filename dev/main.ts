import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
// import quasarLang from 'quasar/lang/fa-IR'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(Quasar, {
    // lang: quasarLang,
    plugins: {}
})

app.mount('#app')
