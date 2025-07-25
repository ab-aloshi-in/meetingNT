<template>
  <q-page class="q-pa-md row justify-center items-center">
    <q-card class="q-pa-md" style="width: 100%; max-width: 400px">
      <div class="text-h4 q-mb-lg">Reset Password</div>
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input outlined v-model="password" label="New Password" type="password" required />
        <q-input
          outlined
          v-model="confirmPassword"
          label="Confirm New Password"
          type="password"
          required
        />
      </q-form>
      <q-btn
        label="Reset Password"
        @click="onResetPasswordBtnClick"
        color="primary"
        class="full-width q-mt-md"
        :disable="isSubmittingResetPassword"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'ResetPasswordPage',
})

const $q = useQuasar()
const route = useRoute()
const isSuccess = ref(false)
const isFailed = ref(false)
const errorMessage = ref(null)
const isSubmittingResetPassword = ref(false)
const password = ref('')
const confirmPassword = ref('')
const resetPassword = async () => {
  // Validate password and confirm password.
  if (password.value !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: 'Passwords do not match.',
      position: 'center',
      timeout: 5000,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
    })
    return
  }

  // isLoading.value = true;
  isSubmittingResetPassword.value = true
  const API_TIMEOUT = 10000 // 1 minute timeout
  const controller = new AbortController() // Create an AbortController instance
  const { signal } = controller // Get the signal from the controller
  // Set a timeout to abort the request
  const timeoutId = setTimeout(() => {
    controller.abort() // Abort the request
  }, API_TIMEOUT)
  try {
    const token = route.query.token
    const response = await api.post(
      '\\api/v1.0/users/reset_password/reset',
      {
        password: password.value,
        token: token,
      },
      { signal }
    )
    clearTimeout(timeoutId)

    if (response.data.success) {
      isSuccess.value = true
    } else {
      isFailed.value = true
      // errorMessage.value = response.data.message;
    }
  } catch {
    isFailed.value = true
    errorMessage.value = 'An error occurred. Please try again later.'
  } finally {
    // isLoading.value = false;
    isSubmittingResetPassword.value = false
  }
}

const onResetPasswordBtnClick = async () => {
  await resetPassword()
}

const onSubmit = async () => {
  await resetPassword()
}
</script>
