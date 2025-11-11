import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

createApp(App)
	.use(VueQueryPlugin, {
		enableDevtoolsV6Plugin: true,
	})
	.use(router)
	.mount('#app')
