<template>
  <q-page class="q-pa-md">
    <!-- View Controls -->
    <div class="q-mb-md row items-center justify-between q-gutter-md">
      <q-btn-group push>
        <q-btn push label="Day" @click="view = 'day'" />
        <q-btn push label="Week" @click="view = 'week'" />
        <q-btn push label="Month" @click="view = 'month'" />
      </q-btn-group>

      <q-input filled dense v-model="selectedDate" type="date" class="q-mb-sm" />
    </div>

    <!-- Calendar -->
    <component
      :is="calendarViewComponent"
      v-model="selectedDate"
      :events="eventsToDisplay"
      event-color="primary"
      :day-min-height="100"
      :weekdays="[0, 1, 2, 3, 4, 5, 6]"
      @click-date="onDateClick"
      :hoverable="true"
      :animated="true"
      :bordered="true"
      :event-content="view !== 'month' ? renderEventContent : undefined"
    >
      <!-- Customize only for month view -->
      <template v-if="view === 'month'" #day="{ scope }">
        <div class="q-pa-xs">
          <!-- Display max 2 events -->
          <div
            v-for="event in getEventsForDay(scope.timestamp.date).slice(0, 2)"
            :key="event.id || event.start"
          >
            <q-badge
              outline
              color="primary"
              class="q-mt-xs full-width cursor-pointer"
              :label="event.title"
              @click.stop="onEventClick(event, $event)"
            />
          </div>

          <!-- "+X more..." -->
          <div v-if="getEventsForDay(scope.timestamp.date).length > 2" class="q-mt-xs">
            <div
              class="text-caption text-secondary cursor-pointer"
              :ref="(el) => storeAnchorRef(scope.timestamp.date, el)"
              @click.stop="showMore(scope.timestamp.date)"
            >
              +{{ getEventsForDay(scope.timestamp.date).length - 2 }} more...
            </div>
          </div>
        </div>
      </template>
    </component>

    <!-- Event Menu -->
    <q-menu v-model="menuVisible" :target="menuAnchorEl" self="top start" fit auto-close>
      <q-list dense>
        <q-item
          v-for="(event, index) in menuEvents"
          :key="event.id || index"
          clickable
          @click="onEventClick(event, $event)"
        >
          <q-item-section>{{ event.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>

    <!-- Event Detail Dialog -->
    <q-dialog v-model="eventDialogVisible" persistent>
      <div
        class="bg-white shadow-10 rounded-borders"
        :style="{
          position: 'absolute',
          top: `${dialogPosition.top}px`,
          left: `${dialogPosition.left}px`,
          minWidth: '340px',
          maxWidth: '400px',
          zIndex: 2000,
        }"
      >
        <q-card flat>
          <!-- Header with Title and Actions -->
          <q-card-section class="q-pa-md q-gutter-sm row items-center justify-between">
            <div class="text-h6 text-primary">{{ selectedEvent?.title }}</div>
            <div class="row q-gutter-xs">
              <q-btn
                flat
                dense
                round
                icon="edit"
                @click="onEditEvent(selectedEvent)"
                color="primary"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                @click="deleteEvent(selectedEvent)"
                color="negative"
              />
              <q-btn
                flat
                dense
                round
                icon="close"
                @click="eventDialogVisible = false"
                color="grey"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md q-gutter-md">
            <!-- Time -->
            <div class="row items-center text-body2 text-grey-8">
              <q-icon name="schedule" class="q-mr-sm" />
              {{ formatEventTime(selectedEvent) }}
            </div>

            <!-- Location -->
            <div v-if="selectedEvent?.location" class="row items-center text-body2 text-grey-8">
              <q-icon name="place" class="q-mr-sm" />
              {{ selectedEvent.location }}
            </div>

            <!-- Description -->
            <div v-if="selectedEvent?.details" class="row items-start text-body2 text-grey-8">
              <q-icon name="notes" class="q-mr-sm q-mt-xs" />
              <div>{{ selectedEvent.details }}</div>
            </div>

            <!-- Participants -->
            <div
              v-if="selectedEvent?.participants?.length"
              class="row items-center text-body2 text-grey-8"
            >
              <q-icon name="people" class="q-mr-sm" />
              {{ selectedEvent.participants.join(', ') }}
            </div>

            <!-- Meeting Link -->
            <div v-if="selectedEvent?.meetingLink" class="column">
              <div class="row items-center text-body2 text-grey-8">
                <q-icon name="videocam" class="q-mr-sm" />
                <a
                  :href="selectedEvent.meetingLink"
                  target="_blank"
                  class="text-primary ellipsis"
                  style="
                    max-width: 200px;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  {{ selectedEvent.meetingLink }}
                </a>

                <q-btn
                  dense
                  flat
                  round
                  icon="content_copy"
                  @click="copyToClipboard(selectedEvent.meetingLink)"
                  size="sm"
                  class="q-ml-sm text-grey-7"
                >
                  <q-tooltip>Copy link</q-tooltip>
                </q-btn>
              </div>

              <q-btn
                label="Join Meeting"
                color="primary"
                icon="open_in_new"
                @click="joinMeeting"
                unelevated
                class="q-mt-sm self-start dialogCustom"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-sm">
            <q-btn flat label="Close" color="primary" @click="eventDialogVisible = false" />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, h, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const view = ref('month')
const selectedDate = ref(route.query.date || new Date().toISOString().slice(0, 10))

const calendarViewComponent = computed(
  () =>
    ({
      day: 'QCalendarDay',
      week: 'QCalendarWeek',
      month: 'QCalendarMonth',
    }[view.value])
)

const rawEvents = ref([])

onMounted(() => {
  const savedEvents = JSON.parse(localStorage.getItem('calendar-events') || '[]')
  rawEvents.value = savedEvents.map((ev) => ({
    ...ev,
    // Ensure an ID exists; if not, generate one.
    // This is a fallback; ideally, ScheduleMeeting.vue always saves with an ID.
    id:
      ev.id ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString() + Math.random().toString(36).substring(2)),
    start: ev.start || ev.date,
    end: ev.end || ev.date,
  }))
  console.log('loadedevents from localstorage:', rawEvents.value)
})

const eventsToDisplay = computed(() => rawEvents.value)

function getEventsForDay(date) {
  return rawEvents.value.filter((e) => e.start?.slice(0, 10) === date)
}

function renderEventContent(scope) {
  return h('div', {}, scope.event?.title || 'No Title')
}

function onDateClick({ scope }) {
  const date = scope.timestamp.date
  router.push({ path: '/schedule-meet', query: { date } })
}

// Add to refs
const selectedEvent = ref(null)
// const dialogVisible = ref(false)
const eventDialogVisible = ref(false)
const dialogPosition = ref({ top: 0, left: 0 })

// Update the onEventClick method
function onEventClick(event, e = null) {
  selectedEvent.value = event

  if (e?.target) {
    const rect = e.target.getBoundingClientRect()
    dialogPosition.value = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    }
  }

  eventDialogVisible.value = true
}

function onEditEvent(eventData) {
  if (!eventData.id) {
    console.error('Event is missing an ID. Cannot edit properly.', eventData)
    // Fallback ID generation if somehow an event in rawEvents doesn't have one
    eventData.id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString() + Math.random().toString(36).substring(2)
    // It's better if events always get IDs when saved.
  }

  const payload = {
    id: eventData.id, // Crucial for identifying the event to update
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    allDay: eventData.allDay,
    location: eventData.location,
    details: eventData.details,
    // Pass other relevant fields from the event object if they exist and should be editable
    invitees: eventData.participants ? eventData.participants.join(', ') : '',
    repeat: eventData.repeat,
    bypassLobby: eventData.bypassLobby,
    whoCanPresent: eventData.whoCanPresent,
    timezone: eventData.timezone,
    meetingLink: eventData.meetingLink, // Though meetingLink might be regenerated/confirmed on save
  }
  console.log('payload for edit:', payload)

  // This localStorage item is mostly for backup/prefill, the query param is primary
  localStorage.setItem('editing-event', JSON.stringify(payload))
  router.push({
    path: '/schedule-meet',
    query: { edit: 'true', data: btoa(JSON.stringify(payload)) },
  })
}

function deleteEvent(eventToDelete) {
  if (!eventToDelete || !eventToDelete.id) {
    $q.notify({
      type: 'negative',
      message: 'Cannot delete event: Invalid event data.',
    })
    return
  }

  // Optional: Confirm before deleting
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete the event "${eventToDelete.title}"? This action cannot be undone.`,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      unelevated: true,
    },
    cancel: {
      label: 'Cancel',
      flat: true,
    },
  }).onOk(() => {
    // 1. Remove from localStorage
    try {
      const storageKey = 'calendar-events'
      let existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const updatedEvents = existingEvents.filter((ev) => ev.id !== eventToDelete.id)
      localStorage.setItem(storageKey, JSON.stringify(updatedEvents))

      // 2. Remove from the local reactive array to update the UI
      const eventIndex = rawEvents.value.findIndex((ev) => ev.id === eventToDelete.id)
      if (eventIndex !== -1) {
        rawEvents.value.splice(eventIndex, 1)
      } else {
        // Fallback if not found in rawEvents but was in localStorage (should be rare)
        rawEvents.value = updatedEvents.map((ev) => ({
          // Re-map to ensure consistency if needed
          ...ev,
          id:
            ev.id ||
            (typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : Date.now().toString() + Math.random().toString(36).substring(2)),
          start: ev.start || ev.date,
          end: ev.end || ev.date,
        }))
      }

      // 3. Close the dialog
      eventDialogVisible.value = false
      selectedEvent.value = null // Clear the selected event

      // 4. Show success notification
      $q.notify({
        type: 'positive',
        message: `Event "${eventToDelete.title}" deleted successfully.`,
        position: 'top',
      })

      console.log('Event deleted:', eventToDelete.id)
    } catch (error) {
      console.error('Failed to delete event:', error)
      $q.notify({
        type: 'negative',
        message: 'An error occurred while trying to delete the event.',
        position: 'top',
      })
    }
  })
}

// QMenu management
const menuVisible = ref(false)
const menuEvents = ref([])
const menuAnchorEl = ref(null)
const menuAnchors = ref({})

function storeAnchorRef(date, el) {
  if (el) menuAnchors.value[date] = el
}

function showMore(date) {
  const anchorEl = menuAnchors.value[date]
  if (!anchorEl) return

  menuEvents.value = getEventsForDay(date).slice(2)

  nextTick(() => {
    menuAnchorEl.value = anchorEl
    menuVisible.value = true
  })
}

function formatEventTime(event) {
  if (!event?.start || !event?.end) return 'No time'

  const start = new Date(event.start)
  const end = new Date(event.end)

  return `${start.toLocaleString()} - ${end.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

function copyToClipboard(link) {
  navigator.clipboard
    .writeText(link)
    .then(() => {
      $q.notify({ type: 'positive', message: 'Link copied to clipboard' })
    })
    .catch(() => {
      $q.notify({ type: 'negative', message: 'Failed to copy link' })
    })
}

function joinMeeting() {
  const roomName = selectedEvent.value.roomName
  const userName = 'Guest' + Math.floor(Math.random() * 1000)

  const redirectUrl = `http://localhost:3000/rooms/${roomName}?pName=${encodeURIComponent(
    userName
  )}`

  // Redirect to the URL
  window.open(redirectUrl, '_blank')
}
</script>

<style>
.q-calendar__event-content {
  padding: 2px 4px;
  font-size: 0.8em;
  word-break: break-word;
  background-color: rgba(255, 255, 0, 0.5);
  color: black;
  min-height: 1em;
}
.dialogCustom {
  font-size: 12px;
  margin-top: 20px;
}
</style>
