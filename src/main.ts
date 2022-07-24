import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

import "@fontsource/material-icons";
import "@fontsource/material-icons-outlined";

import { createApp } from 'vue';

import App from './App.vue';
import './style.css';

import { router } from './router';

createApp(App).use(router).mount('body');
