import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import advanceFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id.js'
import './style.css'
import 'flowbite'
import defaultTable from './components/pages/defaultTable.vue'
import defaultForm from './components/pages/defaultForm.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

dayjs.locale('id')
dayjs.extend(utc);
dayjs.extend(timezone)
dayjs.extend(advanceFormat);
dayjs.extend(relativeTime)

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(dayjs)
app.use(pinia)

app.component('defaultTable', defaultTable)
app.component('defaultForm', defaultForm)
app.component('VueDatePicker', VueDatePicker)
app.mount('#app')