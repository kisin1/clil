// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importiere den Router
import { createPinia } from 'pinia' // Importiere Pinia
import vuetify from './plugins/vuetify' // Importiere die Vuetify-Konfiguration
// import PrimeVue from 'primevue/config' // Entfernt

// Importiere PrimeVue CSS (optional, je nach Bedarf)
// import 'primevue/resources/themes/lara-light-blue/theme.css' // Entfernt

// Vuetify Styles
import 'vuetify/styles'


// Lade globale CSS-Stile oder andere Initialisierungen hier
// import './assets/main.css'

const app = createApp(App)
const pinia = createPinia() // Erstelle Pinia Instanz

app.use(router) // Registriere den Router
app.use(pinia) // Registriere Pinia
app.use(vuetify) // Verwende das Vuetify-Plugin
// app.use(PrimeVue, { // Entfernt
//   ripple: true,
//   inputStyle: 'filled'
// })

app.mount('#app')
