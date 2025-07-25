// src/boot/qcalendar.js

import { boot } from 'quasar/wrappers'

// Import base styles FIRST
import '@quasar/quasar-ui-qcalendar/dist/index.css' 

import {
  QCalendar,
  QCalendarMonth,
  QCalendarDay,
  QCalendarScheduler,
  QCalendarAgenda,
  QCalendarResource
} from '@quasar/quasar-ui-qcalendar'

export default boot(({ app }) => {
  app.component('QCalendar', QCalendar)
  app.component('QCalendarMonth', QCalendarMonth)
  app.component('QCalendarDay', QCalendarDay)
  app.component('QCalendarScheduler', QCalendarScheduler)
  app.component('QCalendarAgenda', QCalendarAgenda)
  app.component('QCalendarResource', QCalendarResource)
})
