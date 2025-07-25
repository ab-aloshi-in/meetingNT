<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated :style="{ backgroundColor: $q.dark.isActive ? '#333' : '#1976d2' }">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat size="lg" class="q-mr-md" aria-label="MeetingNT" to="/" label="MeetingNT" />
        </q-toolbar-title>

        <!-- Dark Mode Toggle -->
        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'brightness_7' : 'brightness_4'"
          @click="toggleDarkMode"
        >
          <q-tooltip>{{
            $q.dark.isActive ? 'Switch to Light Mode' : 'Switch to Dark Mode'
          }}</q-tooltip>
        </q-btn>

        <!-- Login/Register -->
        <q-btn flat class="q-mx-xs q-px-md" to="/login" label="Login" aria-label="Login" />
        <q-btn flat class="q-ml-xs q-px-md" to="/register" label="Register" aria-label="Register" />
      </q-toolbar>
    </q-header>

    <!-- PAGE CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'

defineOptions({ name: 'PublicLayout' })

const $q = useQuasar()

const toggleDarkMode = () => {
  $q.dark.set(!$q.dark.isActive)
  localStorage.setItem('darkMode', $q.dark.isActive ? 'true' : 'false')
  const event = new CustomEvent('dark-mode-changed', {
    detail: { darkMode: $q.dark.isActive },
  })
  window.dispatchEvent(event)
}

onMounted(() => {
  const darkModePreference = localStorage.getItem('darkMode')
  $q.dark.set(darkModePreference === 'true')
})
</script>
