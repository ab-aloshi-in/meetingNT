<template>
  <!-- Success UI -->
  <q-page class="q-pa-md row justify-center items-center bg-grey-2" v-if="isSuccess">
    <q-card
      :class="[
        $q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white',
        'q-pa-md card-container shadow-2 bordered',
      ]"
    >
      <div class="text-h4 q-mb-lg text-positive nowrap-text">Registration Successful!</div>
      <div class="text-body1 q-mb-md">
        A confirmation email has been "virtually" sent. Please verify to complete the registration.
      </div>
    </q-card>
  </q-page>

  <!-- Registration Form -->
  <q-page v-else class="q-pa-md row justify-center items-center" @click="hideNotification">
    <q-card
      :class="[
        $q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white',
        'q-pa-md card-container shadow-2',
      ]"
    >
      <div class="text-h4 q-mb-lg">Register for MeetingNT</div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          outlined
          v-model="firstName"
          label="First Name"
          :error="!!firstNameError"
          :error-message="firstNameError"
        />
        <q-input
          outlined
          v-model="lastName"
          label="Last Name"
          :error="!!lastNameError"
          :error-message="lastNameError"
        />
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
        <q-input
          outlined
          v-model="confirmPassword"
          type="password"
          label="Confirm Password"
          :error="!!confirmPasswordError"
          :error-message="confirmPasswordError"
        />

        <div class="flex-center">
          <q-checkbox v-model="agreeToTerms" />
          <span class="ml-0">
            Agree to the
            <span class="terms-link" :style="{ color: $q.dark.isActive ? '#90caf9' : 'blue' }"
              >Terms of Service</span
            >
            and
            <span class="terms-link" :style="{ color: $q.dark.isActive ? '#90caf9' : 'blue' }"
              >Privacy Policy</span
            >
          </span>
        </div>

        <span v-if="termsError" class="error-message">
          You must agree to the terms and conditions
        </span>

        <div class="row items-center justify-start">
          <q-btn label="Already have an account?" flat color="primary" to="/login" />
        </div>

        <div>
          <q-btn type="submit" color="primary" class="full-width" :disabled="isSubmitting">
            <q-circular-progress v-if="isSubmitting" indeterminate color="white" size="25px" />
            <span v-else>Register</span>
          </q-btn>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'RegisterPage',
})

const router = useRouter()
const $q = useQuasar()
const isSubmitting = ref(false)
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const termsErrorr = ref(false)
const firstNameError = ref(null)
const lastNameError = ref(null)
const emailError = ref(null)
const passwordError = ref(null)
const confirmPasswordError = ref(null)
const termsError = ref(null)
const isSuccess = ref(false)
let dismissNotification = null

const onSubmit = async () => {
  if (!validateInputs()) return
  isSubmitting.value = true
  const API_TIMEOUT = 10000
  const controller = new AbortController()
  const { signal } = controller
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await api.post(
      'api/v1.0/users/register',
      {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      },
      { signal }
    )
    clearTimeout(timeoutId)

    if (response.data.success) {
      clearUI()
      isSuccess.value = true
    } else {
      const msg = 'An error occurred while registering your account. Please try again later.'
      notifyMessage(msg, false)
    }
  } catch (error) {
    if (
      error.response?.status === 409 &&
      error.response.data?.error === 'Email is already registered'
    ) {
      notifyMessage(
        "An account with this email already exists. If you forgot your password, please click 'Forgot Password' to recover it.",
        true
      )
    } else {
      notifyMessage(
        error.response?.data?.message ||
          'An error occurred while registering your account. Please try again later.',
        false
      )
    }
  } finally {
    isSubmitting.value = false
  }
}

const clearUI = () => {
  clearErrors()
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  agreeToTerms.value = false
}

const clearErrors = () => {
  firstNameError.value = null
  lastNameError.value = null
  emailError.value = null
  passwordError.value = null
  confirmPasswordError.value = null
  termsError.value = null
}

const validateInputs = () => {
  clearErrors()

  if (!firstName.value) firstNameError.value = 'First Name is required'
  else if (!validateName(firstName.value)) firstNameError.value = 'Only alphabets are allowed'

  if (!lastName.value) lastNameError.value = 'Last Name is required'
  else if (!validateName(lastName.value)) lastNameError.value = 'Only alphabets are allowed'

  if (!email.value) emailError.value = 'Email is required'
  else if (!validateEmail(email.value)) emailError.value = 'Invalid email format'

  if (!password.value) passwordError.value = 'Password is required'
  else if (password.value.length < 8)
    passwordError.value = 'Password must be at least 8 characters long'
  else if (!/[A-Z]/.test(password.value))
    passwordError.value = 'Password must contain at least one uppercase letter'
  else if (!/\d/.test(password.value))
    passwordError.value = 'Password must contain at least one number'
  else if (!/[#?!@$%^&*-]/.test(password.value))
    passwordError.value = 'Password must contain at least one special character'

  if (!confirmPassword.value) confirmPasswordError.value = 'Confirm Password is required'
  else if (confirmPassword.value !== password.value)
    confirmPasswordError.value = 'Passwords do not match'

  if (!agreeToTerms.value) {
    termsErrorr.value = true
    termsError.value = 'You must agree to the terms and conditions.'
  } else {
    termsErrorr.value = false
  }

  return (
    !firstNameError.value &&
    !lastNameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    !termsError.value
  )
}

const validateName = (name) => /^[\p{L} \p{M}'-]+$/u.test(name)
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const notifyMessage = (message, showForgotPassword = false) => {
  const actions = [
    ...(showForgotPassword
      ? [
          {
            label: 'Forgot Password',
            color: 'white',
            handler: () => router.push('/forgot_password'),
          },
        ]
      : []),
    {
      icon: 'close',
      color: 'white',
      handler: () => {},
    },
  ]

  dismissNotification = $q.notify({
    type: 'negative',
    message,
    position: 'center',
    timeout: 0,
    textColor: 'white',
    actions,
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
.nowrap-text {
  white-space: nowrap;
}
.card-container {
  width: 100%;
  max-width: 400px;
}
.ml-0 {
  margin-left: 0px;
}
.error-message {
  color: var(--q-negative);
  font-size: 12px;
  margin-left: 27px;
}
.terms-link {
  text-decoration: underline;
  font-size: 13px;
}
</style>
