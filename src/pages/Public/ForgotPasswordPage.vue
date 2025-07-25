<template>
  <q-page class="q-pa-md row justify-center items-center" @click="hideNotification">
    <q-card class="q-pa-md" style="width: 100%; max-width: 400px">
      <div class="text-h4 q-mb-lg">Forgot Password?</div>

      <!-- Form -->
      <q-form v-if="!resetLinkSent" @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          outlined
          v-model="email"
          label="Email"
          :error="emailError != null"
          :error-message="emailError"
          :class="{
            'dark-mode': $q.dark.isActive,
            'light-mode': !$q.dark.isActive,
          }"
        />

        <div>
          <q-btn
            label="Send Reset Link"
            type="submit"
            color="primary"
            class="full-width"
            :disabled="isLoading"
          />
        </div>
      </q-form>

      <!-- Success Message -->
      <div v-else class="q-mt-md column items-center">
        <q-icon name="check_circle" color="positive" size="30px" />
        <div class="text-h6 text-positive q-mt-sm">Password reset link sent!</div>
        <div class="text-caption q-mt-xs text-center">
          Please check your email for further instructions.
        </div>
      </div>

      <!-- Back to Login -->
      <q-btn label="Go to Login" class="q-mt-md" flat color="primary" to="/login" />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
defineOptions({
  name: 'ForgotPasswordPage',
})
const $q = useQuasar()
const isLoading = ref(false)
const resetLinkSent = ref(false)
const email = ref('')
const emailError = ref(null)
let dismissNotification = null

const onSubmit = async () => {
  if (!validateEmailInputs()) {
    return
  }

  isLoading.value = true
  const API_TIMEOUT = 10000 // 1 minute timeout
  const controller = new AbortController() // Create an AbortController instance
  const { signal } = controller // Get the signal from the controller
  // Set a timeout to abort the request
  const timeoutId = setTimeout(() => {
    controller.abort() // Abort the request
  }, API_TIMEOUT)
  try {
    await api.post(
      '\\api/v1.0/users/reset_password/request',
      {
        email: email.value,
      },
      { signal }
    )
    // Handle successful request response
    // Redirect to the confirmation page after successful request
    // (e.g., using router.push('/forgot_password_confirmation'))
    resetLinkSent.value = true
    clearTimeout(timeoutId)
  } catch (error) {
    // Handle request error
    if (error.response && error.response.status === 403) {
      const errorMsg = error.response?.data?.message || 'No account found with that email address'
      notifyMessage(errorMsg)
    } else {
      const msg = 'An error occurred while processing your request. Please try again later.'
      notifyMessage(msg)
    }
    // Display an error message to the user
  } finally {
    isLoading.value = false
  }
}

const validateEmailInputs = () => {
  emailError.value = null

  // Email.
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Invalid email format'
  }

  return emailError.value === null
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const notifyMessage = (message, color_and_type = 'negative') => {
  dismissNotification = $q.notify({
    type: color_and_type,
    message: message,
    position: 'center',
    timeout: 0, // Do not hide automatically.
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }],
  })
}

const hideNotification = () => {
  if (dismissNotification) {
    dismissNotification()
    dismissNotification = null
  }
}
</script>
<style scoped>
.text-center {
  text-align: center;
}
</style>
