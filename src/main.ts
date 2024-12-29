import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import SurveyFill from './components/SurveyFill.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/vote/:surveyId', component: SurveyFill },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App).use(router).mount('#app')