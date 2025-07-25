<template>
  <q-page class="q-pa-md row justify-center items-center" @click="hideNotification">
    <q-card
      class="q-pa-md shadow-2"
      :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white'"
      style="width: 100%; max-width: 400px"
    >
      <div class="text-h4 q-mb-lg">Sign in to MeetingNT</div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          outlined
          v-model="email"
          label="Email"
          :error="!!emailError"
          :error-message="emailError"
        />

        <q-input
          outlined
          v-model="password"
          type="password"
          label="Password"
          :error="!!passwordError"
          :error-message="passwordError"
        />

        <div class="row items-center justify-start">
          <q-btn label="Forgot Password?" flat color="primary" to="/forgot_password" />
        </div>

        <q-btn
          label="Sign In"
          type="submit"
          color="primary"
          class="full-width"
          :disabled="isSubmitting"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

defineOptions({ name: 'LoginPage' })

const $q = useQuasar()

const email = ref('')
const password = ref('')
const emailError = ref(null)
const passwordError = ref(null)
const router = useRouter()
const isSubmitting = ref(false)
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)

let dismissNotification = null

const onSubmit = async () => {
  clearErrors()
  if (!validateInputs()) {
    return
  }

  isSubmitting.value = true // Disable the submit button
  const API_TIMEOUT = 10000 // 1 minute timeout
  const controller = new AbortController() // Create an AbortController instance
  const { signal } = controller // Get the signal from the controller

  // Set a timeout to abort the request
  const timeoutId = setTimeout(() => {
    controller.abort() // Abort the request
  }, API_TIMEOUT)
  try {
    const response = await api.post(
      'api/v1.0/users/login',
      {
        email: email.value,
        password: password.value,
        // staySignedIn: staySignedIn.value
      },
      { signal }
    )
    clearTimeout(timeoutId)
    // Handle successful login response.
    if (response.data.success) {
      // Clear the form fields.
      clearUI()

      // Redirect to the desired page after successful login.
      router.push('/')
    } else {
      const msg = response.data.message || 'Login failed. Please try again.'
      notifyMessage(msg)
    }
  } catch (error) {
    const msg =
      error.response?.data?.message || 'An error occurred while logging in. Please try again later.'
    notifyMessage(msg)
  } finally {
    isSubmitting.value = false // Enable the submit button after API call.
  }

  clearUI()
}

const clearUI = () => {
  email.value = ''
  password.value = ''
  clearErrors()
}

const clearErrors = () => {
  emailError.value = null
  passwordError.value = null
}

const hideNotification = () => {
  if (dismissNotification) {
    dismissNotification()
    dismissNotification = null
  }
}

const validateInputs = () => {
  emailError.value = null
  passwordError.value = null

  // Email.
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Invalid email format'
  }

  // Password.
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
  } else if (!validatePassword(password.value)) {
    passwordError.value =
      'Password must contain at least 1 uppercase letter, 1 number, and 1 special character'
  }

  return emailError.value === null && passwordError.value === null
}

const notifyMessage = (message) => {
  dismissNotification = $q.notify({
    type: 'negative',
    message: message,
    position: 'center',
    timeout: 0, // Do not hide automatically.
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }],
  })
}
</script>
