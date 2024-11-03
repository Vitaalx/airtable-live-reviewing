import { createApp } from 'vue';
import './assets/style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/user';

createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')


const userStore = useUserStore();

setInterval(() => {
    userStore.updateUser();
}, 1000);

window.addEventListener('storage', () => {
    userStore.updateUser();
});