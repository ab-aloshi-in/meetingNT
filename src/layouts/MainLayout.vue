<template>
  <q-layout view="lHh Lpr lFf" @click="hideNotification">
    <!-- HEADER -->
    <q-header elevated :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">
      <q-toolbar>
        <!-- App Title -->
        <q-toolbar-title>Meeting NT</q-toolbar-title>

        <q-space />

        <!-- Dark Mode Toggle Icon -->
        <q-btn
          dense
          flat
          round
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
        >
          <q-tooltip>{{ $q.dark.isActive ? 'Light Mode' : 'Dark Mode' }}</q-tooltip>
        </q-btn>

        <!-- Profile Dropdown Menu -->
        <q-btn flat dense round icon="person" aria-label="User">
          <q-menu v-model="menuVisible" :offset="[5, 5]">
            <q-list>
              <q-item-label header>
                <b>{{ authStore.user?.name }}</b> <br />
                {{ authStore.user?.email }}
              </q-item-label>
              <q-item clickable tag="a" @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-no-wrap">Logout</q-item-label>
                  <q-item-label caption></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :mini="miniDrawer" :mini-width="76">
      <q-list>
        <q-btn
          :icon="miniDrawer ? 'chevron_right' : 'menu_open'"
          flat
          @click="miniDrawer = !miniDrawer"
          class="full-width"
        />
        <NavigationLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <!-- PAGE CONTAINER -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import NavigationLink from 'src/components/NavigationLink.vue'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()
// const userEmail = authStore.user?.email

const leftDrawerOpen = ref(false)
const miniDrawer = ref(false)

const isUserLoggedIn = async () => {
  await authStore.fetchCurrentUser()
  return authStore.isLoggedIn
}

// Redirect to the desired page if the user is already logged in
isUserLoggedIn().then((isLoggedIn) => {
  if (!isLoggedIn) {
    router.push('/login')
  }
})

const linksList = [
  {
    title: 'Chat',
    caption: 'Chat with individuals',
    icon: 'chat',
    link: '/chat',
  },
  {
    title: 'Channel',
    caption: 'Chat with groups',
    icon: 'forum',
    link: '/channel',
  },
  {
    title: 'Meet',
    caption: 'Start, join or schedule a meeting',
    icon: 'record_voice_over',
    link: '/meet',
  },
  {
    title: 'Minutes',
    caption: 'Create and manage meeting minutes',
    icon: 'event_note',
    link: '/minutes',
  },
  {
    title: 'Calendar',
    caption: 'Manage your calendar',
    icon: 'calendar_today',
    link: '/calendar',
  },
]

function toggleDarkMode() {
  const newMode = !$q.dark.isActive
  $q.dark.set(newMode)
  localStorage.setItem('darkMode', newMode)
}

onMounted(() => {
  // Load theme from localStorage if exists
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    $q.dark.set(saved === 'true')
  }
})

const hideNotification = async () => {
  if (dismissNotification) {
    dismissNotification()

    dismissNotification = null
  }
}

let dismissNotification = null

const notifyMessage = (message, color_and_type = 'negative') => {
  dismissNotification = $q.notify({
    type: color_and_type,
    message: message,
    position: 'center',
    timeout: 0, // Do not hide automatically
    textColor: 'white',
    actions: [
      {
        color: 'white',
        icon: 'close',
      },
    ],
  })
}

// const isAuthenticated = computed(() => authStore.isAuthenticated)
const logout = async () => {
  $q.loading.show({
    message: 'Logging Out... Please wait.',
  })
  try {
    await authStore.logout()
    if (!authStore.isSuccess) {
      const message = 'An error occurred while logging out. Please try again later.'
      notifyMessage(message)
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Adjust delay as needed
      router.push('/login')
    }
  } catch (error) {
    const message = 'An unexpected error occurred. Please try again.'
    notifyMessage(message)
    console.error('Logout error:', error)
  } finally {
    $q.loading.hide()
  }
}
</script>
