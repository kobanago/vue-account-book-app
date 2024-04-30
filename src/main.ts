import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import App from './App.vue';
import './style.css';

createApp(App)
  .use(
    createVuetify({
      components,
      directives,
    }),
  )
  .mount('#app');
