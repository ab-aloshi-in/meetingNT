<template>
  <q-page class="q-pa-md bg-grey-2">
    <q-card flat bordered class="q-pa-lg">
      <!-- Header -->
      <div class="row items-center q-mb-md">
        <q-icon name="event" class="q-mr-sm" />
        <div class="text-h6">New meeting</div>
        <q-space />
        <q-btn
          label="Save"
          color="primary"
          class="q-mr-sm"
          :loading="isSubmitting"
          @click="saveMeeting"
        />
        <q-btn label="Close" flat @click="goToCalendar" />
      </div>

      <q-separator />

      <!-- Form Content -->
      <q-form class="q-mt-md">
        <div class="q-mb-md">
          <div class="row items-center q-gutter-sm q-mb-sm">
            <q-icon name="language" color="primary" class="large-icon" />
            <q-select
              filled
              v-model="timezone"
              label="Time zone"
              :options="[
                '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                '(UTC+01:00) Amsterdam, Berlin, Rome, Paris',
                '(UTC-05:00) Eastern Time (US & Canada)',
                '(UTC+00:00) UTC',
                '(UTC+09:00) Tokyo, Seoul',
              ]"
              class="col"
              dense
            />
          </div>

          <q-banner class="bg-grey-1 text-black q-pa-sm" rounded outlined>
            <template v-slot:avatar>
              <q-icon name="info" color="primary" class="large-icon" />
            </template>
            With your current Teams plan, you get up to 60 minutes per meeting with up to 100
            participants.
            <a href="#" class="text-primary q-ml-xs">Learn more</a>
          </q-banner>
        </div>

        <!-- Title and Permissions Row -->
        <div class="row q-col-gutter-md q-mt-lg">
          <div class="col-12 col-md-6">
            <div class="row items-center q-gutter-sm">
              <q-icon name="edit" color="primary" class="large-icon" />
              <q-input
                filled
                v-model="title"
                label="Add title"
                dense
                class="col"
                :error="titleError !== null"
                :error-message="titleError"
              />
            </div>
          </div>

          <q-select
            filled
            v-model="whoCanPresent"
            :options="['Everyone', 'Only me']"
            label="Who can present"
            class="col-12 col-md-6"
            dense
          />
        </div>

        <!-- Invitees and Lobby Bypass -->
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <div class="row items-center q-gutter-sm">
              <q-icon name="person_add" color="primary" class="large-icon" />
              <q-input
                filled
                v-model="invitees"
                label="Enter name, email or phone number"
                type="text"
                dense
                class="col"
                :error="inviteesError !== null"
                :error-message="inviteesError"
              />
            </div>
          </div>

          <q-select
            filled
            v-model="bypassLobby"
            :options="['People who were invited', 'Everyone']"
            label="Who can bypass the lobby?"
            class="col-12 col-md-6"
            dense
          />
        </div>

        <!-- Date/Time Row -->
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-sm-3">
            <div class="row items-center q-gutter-sm">
              <q-icon name="event" color="primary" class="large-icon" />
              <q-input
                filled
                v-model="startDate"
                label="Start Date"
                type="date"
                dense
                class="col"
                :error="startDateError !== null"
                :error-message="startDateError"
              />
            </div>
          </div>

          <div class="col-12 col-sm-3">
            <div class="row items-center q-gutter-sm">
              <q-icon name="schedule" color="primary" class="large-icon" />
              <q-input
                filled
                v-model="startTime"
                label="Start Time"
                type="time"
                dense
                class="col"
                :error="!!startTimeError"
                :error-message="startTimeError"
              />
            </div>
          </div>

          <div class="col-12 col-sm-3">
            <div class="row items-center q-gutter-sm">
              <q-icon name="event_busy" color="primary" class="large-icon" />
              <q-input
                filled
                v-model="endDate"
                label="End Date"
                type="date"
                dense
                class="col"
                :error="!!endDateError"
                :error-message="endDateError"
              />
            </div>
          </div>

          <div class="col-12 col-sm-3">
            <div class="row items-center q-gutter-sm">
              <q-icon name="schedule" color="primary" class="large-icon" />
              <q-input
                filled
                v-model="endTime"
                label="End Time"
                type="time"
                dense
                class="col"
                :error="!!endTimeError"
                :error-message="endTimeError"
              />
            </div>
          </div>

          <div class="col-12 col-sm-3">
            <div class="row items-center q-gutter-sm">
              <q-icon name="today" color="primary" class="large-icon" />
              <q-toggle v-model="allDay" label="All day" class="col" />
            </div>
          </div>
        </div>

        <!-- All Day Toggle + Repeat Dropdown -->
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-sm-9">
            <div class="row items-center q-gutter-sm">
              <q-icon name="repeat" color="primary" class="large-icon" />
              <q-select
                filled
                v-model="repeat"
                :options="['Does not repeat', 'Daily', 'Weekly', 'Monthly']"
                label="Repeat"
                dense
                class="col"
              />
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="row items-center q-gutter-sm q-mt-md">
          <q-icon name="place" color="primary" class="large-icon" />
          <q-input filled v-model="location" label="Add location" class="col" dense />
        </div>

        <!-- Meeting Details -->
        <div class="row items-center q-gutter-sm q-mt-md">
          <q-icon name="notes" color="primary" class="large-icon" />
          <q-editor
            v-model="details"
            label="Type details for this new meeting"
            :definitions="{
              bold: { icon: 'format_bold' },
              italic: { icon: 'format_italic' },
              underline: { icon: 'format_underlined' },
            }"
            class="col bg-white"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

// const meetingForm = reactive({
//   title: '',
//   invitees: '',
//   startDate: '',
//   endDate: '',
//   startTime: '',
//   endTime: '',
//   allDay: false,
//   repeat: 'Does not repeat',
//   location: '',
//   details: '',
//   bypassLobby: 'People who were invited',
//   whoCanPresent: 'Everyone',
//   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// })

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const title = ref('')
const invitees = ref('')
const startDate = ref('')
const startTime = ref('')
const endDate = ref('')
const endTime = ref('')
const allDay = ref(false)
const repeat = ref('Does not repeat')
const location = ref('')
const details = ref('')
const bypassLobby = ref('People who were invited')
const whoCanPresent = ref('Everyone')
const timezone = ref('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi')
// Validation Errors
const titleError = ref(null)
const inviteesError = ref(null)
const startDateError = ref(null)
const endDateError = ref(null)
const startTimeError = ref(null)
const endTimeError = ref(null)
const isSubmitting = ref(false)
const editingEventId = ref(null) // To store the ID of the event being edited

onMounted(() => {
  const selectedDateQuery = route.query.date
  const isEdit = route.query.edit === 'true'
  const encodedData = route.query.data

  if (isEdit && encodedData) {
    try {
      const decoded = JSON.parse(atob(encodedData))
      console.log('decoded for edit:', decoded)

      editingEventId.value = decoded.id // Store the ID of the event being edited

      title.value = decoded.title || ''

      // Robust date/time parsing
      if (decoded.start) {
        // Assuming decoded.start is a string like "YYYY-MM-DDTHH:mm" or "YYYY-MM-DD"
        const startDateObj = new Date(decoded.start + 'Z')
        startDate.value = startDateObj.toISOString().slice(0, 10)
        if (!decoded.allDay) {
          startTime.value = startDateObj.toISOString().slice(11, 16)
        }
      } else {
        startDate.value = ''
        startTime.value = ''
      }

      if (decoded.end) {
        const endDateObj = new Date(decoded.end + 'Z')
        endDate.value = endDateObj.toISOString().slice(0, 10)
        if (!decoded.allDay) {
          endTime.value = endDateObj.toISOString().slice(11, 16)
        }
      } else {
        endDate.value = ''
        endTime.value = ''
      }

      allDay.value = decoded.allDay || false
      location.value = decoded.location || ''
      details.value = decoded.details || ''
      invitees.value = decoded.invitees || '' // Comes from payload
      repeat.value = decoded.repeat || 'Does not repeat'
      bypassLobby.value = decoded.bypassLobby || 'People who were invited'
      whoCanPresent.value = decoded.whoCanPresent || 'Everyone'
      timezone.value = decoded.timezone || '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi' // Default if not provided
    } catch (e) {
      console.error('Invalid meeting data for edit:', e)
      $q.notify({ type: 'negative', message: 'Error loading event data for editing.' })
      editingEventId.value = null // Clear ID if parsing failed
    }
  } else if (selectedDateQuery) {
    startDate.value = selectedDateQuery
    endDate.value = selectedDateQuery
    startTime.value = '' // Clear time for new event on specific date
    endTime.value = ''
  }
})

const validateMeeting = () => {
  titleError.value = null
  inviteesError.value = null
  startDateError.value = null
  endDateError.value = null
  startTimeError.value = null
  endTimeError.value = null
  let isValid = true

  if (!title.value) {
    titleError.value = 'Meeting title is required.'
    isValid = false
  }

  if (!validateInvitees()) {
    isValid = false
  }

  if (!startDate.value) {
    startDateError.value = 'Start date is required.'
    isValid = false
  }

  if (!endDate.value) {
    endDateError.value = 'End date is required.'
    isValid = false
  }

  if (!allDay.value) {
    if (!startTime.value) {
      startTimeError.value = 'Start time is required.'
      isValid = false
    }
    if (!endTime.value) {
      endTimeError.value = 'End time is required.'
      isValid = false
    }
  } else {
    startTimeError.value = null
    endTimeError.value = null
  }

  if (!validateDateRange()) {
    isValid = false
  }

  return isValid
}

const validateInvitees = () => {
  if (!invitees.value || invitees.value.length === 0) {
    inviteesError.value = 'Please add at least one invitee.'
    return false
  }
  inviteesError.value = null
  return true
}

const validateDateRange = () => {
  if (startDate.value && endDate.value) {
    const startDateTime = allDay.value
      ? new Date(startDate.value)
      : new Date(`${startDate.value}T${startTime.value || '00:00'}`)
    const endDateTime = allDay.value
      ? new Date(endDate.value)
      : new Date(`${endDate.value}T${endTime.value || '00:00'}`)

    if (endDateTime < startDateTime) {
      endDateError.value = 'End date/time cannot be before start date/time.'
      endTimeError.value = 'End date/time cannot be before start date/time.'
      return false
    }
  }
  return true
}

const saveMeeting = async () => {
  if (!validateMeeting()) {
    $q.notify({
      type: 'negative',
      message: 'Please correct the errors before submitting.',
      position: 'top',
    })
    return
  }

  isSubmitting.value = true

  let eventStart, eventEnd
  if (allDay.value) {
    eventStart = startDate.value // Should be YYYY-MM-DD
    eventEnd = endDate.value // Should be YYYY-MM-DD
  } else {
    eventStart = `${startDate.value}T${startTime.value || '00:00'}` // ISO-like string
    eventEnd = `${endDate.value}T${endTime.value || '00:00'}` // ISO-like string
  }

  // Determine event ID: use existing if editing, or generate new
  const eventId =
    editingEventId.value ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random().toString(36).substring(2))
  const meetingLink = `http://localhost:9000/schedule-meet/${eventId}`

  const eventForCalendar = {
    id: eventId, // Crucial: use the determined ID
    title: title.value,
    start: eventStart,
    end: eventEnd,
    allDay: allDay.value,
    details: details.value,
    location: location.value,
    meetingLink: meetingLink,
    participants: invitees.value ? invitees.value.split(',').map((s) => s.trim()) : [],
    repeat: repeat.value,
    bypassLobby: bypassLobby.value,
    whoCanPresent: whoCanPresent.value,
    timezone: timezone.value,
    roomName: generateRandomRoomName(),
  }

  try {
    const storageKey = 'calendar-events'
    let existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]')

    if (editingEventId.value) {
      // If this was an edit
      const eventIndex = existingEvents.findIndex((ev) => ev.id === editingEventId.value)
      if (eventIndex !== -1) {
        existingEvents[eventIndex] = eventForCalendar // Update existing event
        console.log('Event updated in localStorage:', eventForCalendar)
      } else {
        // Event not found, perhaps it was deleted? Add as new to prevent data loss.
        console.warn('Editing event not found by ID, adding as new:', editingEventId.value)
        existingEvents.push(eventForCalendar)
      }
    } else {
      // This is a new event
      existingEvents.push(eventForCalendar)
      console.log('New event saved to localStorage:', eventForCalendar)
    }

    localStorage.setItem(storageKey, JSON.stringify(existingEvents))

    // Clear editing ID after successful save
    if (editingEventId.value) {
      editingEventId.value = null
    }
  } catch (storageError) {
    console.error('Failed to save event to localStorage:', storageError)
    $q.notify({
      type: 'warning',
      message: 'Could not save event locally for calendar display.',
      position: 'top',
    })
  }

  isSubmitting.value = false
  clearForm()
  router.push({ path: '/calendar' }) // Redirect to calendar page
}

function goToCalendar() {
  router.push('/calendar')
}
const clearForm = () => {
  title.value = ''
  invitees.value = ''
  startDate.value = ''
  startTime.value = ''
  endDate.value = ''
  endTime.value = ''
  allDay.value = false
  repeat.value = 'Does not repeat'
  location.value = ''
  details.value = ''
  // Reset validation errors
  titleError.value = null
  inviteesError.value = null
  startDateError.value = null
  endDateError.value = null
  startTimeError.value = null
  endTimeError.value = null
}

function generateRandomRoomName() {
  const segment = () => Math.random().toString(36).substring(2, 6)
  return `${segment()}-${segment()}`
}
</script>

<style scoped>
.q-page {
  max-width: 1200px;
  margin: auto;
}

.q-card {
  width: 100%;
}
.large-icon {
  font-size: 24px;
}
</style> 