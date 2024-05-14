import { createApp } from 'vue';
import router from "@/routes/routes";
import store from "@/store/store";
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './assets/main.css';
import { formatTimestamp } from './utils/utils';

const app = createApp(App);

app.config.globalProperties.$filters = {
  formatTimestamp,
};

app.use(router);
app.use(store);

app.mount('#app');
