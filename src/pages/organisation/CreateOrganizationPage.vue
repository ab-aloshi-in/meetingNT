<template>
  <q-page padding @click="hideNotification">
    <q-card class="q-pa-md card-container q-mb-md">
      <div class="text-h5 q-mb-sm text-center">
        {{ mode === 'Edit' ? 'UPDATE ORGANIZATION' : 'CREATE ORGANIZATION' }}
      </div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="institutionName"
              label="Institution Name"
              :error="!!institutionNameError"
              :error-message="institutionNameError"
              @blur="handleBlurInstitutionName"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="addressLine1"
              label="Address Line 1"
              :error="!!addressLine1Error"
              :error-message="addressLine1Error"
              @blur="handleBlurAddressLine1"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="addressLine2"
              label="Address Line 2"
              :error="addressLine2Error != null"
              :error-message="addressLine2Error"
              @blur="handleBlurAddressLine2"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="city"
              label="City"
              :error="cityError != null"
              :error-message="cityError"
              @blur="handleBlurCity"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="state"
              label="State/Province"
              :error="stateError != null"
              :error-message="stateError"
              @blur="handleBlurState"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="postalCode"
              label="Postal/Zip Code"
              :error="postalCodeError != null"
              :error-message="postalCodeError"
              @blur="handleBlurPostalCode"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="country"
              label="Country"
              :error="countryError != null"
              :error-message="countryError"
              :options="filteredCountries"
              option-value="label"
              option-label="label"
              @filter="filterOptionss"
              use-input
              @blur="handleBlurCountry"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="contactName"
              label="Contact Name"
              :error="contactNameError != null"
              :error-message="contactNameError"
              @blur="handleBlurContactEmail"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="contactEmail"
              label="Contact Email"
              :error="contactEmailError != null"
              :error-message="contactEmailError"
              @blur="handleBlurContactEmail"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="contactPhoneNumber"
              label="Contact Phone Number"
              type="tel"
              :error="contactPhError != null"
              :error-message="contactPhError"
              @blur="handleBlurContactPhoneNumber"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="institutionType"
              :options="institutionOptions"
              label="Institution Type"
              :error="institutionTypeError != null"
              :error-message="institutionTypeError"
              option-label="institutionType"
              option-value="institutionType.value"
              use-
              @blur="handleBlurInstitutionType"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    {{ scope.opt.institutionType }}
                  </q-item-section>
                  <q-tooltip
                    class="bg-gray shadow-10 text-body2"
                    :offset="[10, 10]"
                    v-if="scope.opt.description"
                  >
                    {{ scope.opt.description }}
                  </q-tooltip>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              outlined
              v-model="websiteUrl"
              label="Website URL"
              :error="weburlError != null"
              :error-message="weburlError"
              @blur="handleBlurWebsiteUrl"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md">
          <div class="col-12 col-md-6">
            <div v-if="mode != 'Edit'" class="image-container q-mt-md">
              <label
                class="q-mt-md q-field__label q-field__label--float q-field__label--stacked"
                style="padding: 12px; font-size: small"
                >Institution Logo</label
              >
              <img :src="imageUrl ? imageUrl : editLogoUrl" alt="Logo" class="default-logo" />
              <q-btn
                v-if="logoFiles.length == 0"
                no-caps
                color="light-blue-10"
                class="overlay-button"
                icon="edit_square"
                label="Change Logo"
                @click="showUploader"
                :disable="isSubmitting"
                v-show="$q.screen.gt.sm"
              ></q-btn>
              <q-btn
                v-if="logoFiles.length != 0"
                no-caps
                color="red-10"
                class="overlay-button"
                icon="delete"
                label="Remove Logo"
                @click="removeLogoFile"
                :disable="isSubmitting"
                v-show="$q.screen.gt.sm"
              >
              </q-btn>
            </div>

            <div v-if="mode === 'Edit' && !uploaderVisible" class="image-container q-mt-md">
              <label
                class="q-mt-md q-field__label q-field__label--float q-field__label--stacked"
                style="padding: 12px; font-size: small"
                >Institution Logo</label
              >
              <img :src="editLogoUrl" alt="Default Logo" class="default-logo" />
              <q-btn
                no-caps
                color="light-blue-10"
                class="overlay-button"
                icon="edit_square"
                label="Change Logo"
                @click="showUploader"
                :disable="isSubmitting"
                v-show="$q.screen.gt.sm"
              >
              </q-btn>
            </div>
            <div
              v-if="mode === 'Edit' && uploaderVisible && logoFiles != null"
              class="image-container q-mt-md"
            >
              <img v-if="logoFiles != null" :src="imageUrl" alt="Logo" class="default-logo" />
              <q-btn
                no-caps
                color="red-10"
                class="overlay-button"
                icon="delete"
                label="Remove Logo"
                @click="removeLogoFile"
                :disable="isSubmitting"
                v-show="$q.screen.gt.sm"
              >
              </q-btn>
            </div>

            <div v-if="!$q.screen.gt.sm" class="row justify-center">
              <q-btn
                v-if="logoFiles.length == 0"
                no-caps
                color="light-blue-10"
                icon="edit_square"
                label="Change Logo"
                @click="showUploader"
                :disable="isSubmitting"
                class="q-mt-sm"
              ></q-btn>
              <q-btn
                v-if="logoFiles.length != 0"
                no-caps
                color="red-10"
                icon="delete"
                label="Remove Logo"
                @click="removeLogoFile"
                class="q-mt-sm"
              ></q-btn>
            </div>

            <q-file
              clearable
              v-model="logoFiles"
              label="Upload Logo"
              accept=".jpg,.png,.gif, image/*"
              ref="logoFile"
              @update:model-value="setImagePreview"
              @clear="removeLogoFile"
              :error="imageError != null"
              style="display: none; max-width: 300px"
              @blur="handleBlurLogoFile"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file"></q-icon>
              </template>
            </q-file>

            <div v-if="imageError" class="text-negative q-mt-md">
              {{ imageError }}
            </div>
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              v-model="adminUsersModel"
              use-input
              use-chips
              multiple
              input-debounce="0"
              label="Institution Admin Emails"
              @new-value="createValue"
              :options="filterOptions"
              @filter="filterFn"
              style="max-height: 300px; overflow-y: scroll"
              :error="institutionAdminError != null"
              :error-message="institutionAdminError"
              @blur="handleBlurAdminUsers"
              :class="{
                'dark-mode': $q.dark.isActive,
                'light-mode': !$q.dark.isActive,
              }"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    {{ scope.opt }}
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <q-chip removable @remove="scope.removeAtIndex(scope.index)">
                  {{ scope.opt }}
                </q-chip>
              </template>
            </q-select>
            <!-- <div v-if="institutionAdminError" class="text-negative q-mt-md">
              {{ institutionAdminError }}
            </div> -->
          </div>
        </div>

        <div
          class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md justify-end"
          style="margin: auto"
        >
          <div class="col-12 col-md-4">
            <q-btn
              type="submit"
              color="primary"
              class="full-width"
              :disabled="isSubmitting"
              no-caps
            >
              <q-circular-progress v-if="isSubmitting" indeterminate color="white" size="25px" />
              <template v-else>
                <span v-if="mode === 'Edit'" class="fw-bold">Update Institution</span>
                <span v-else class="fw-bold">Create Institution</span>
              </template>
            </q-btn>
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              type="button"
              color="warning"
              class="full-width"
              no-caps
              @click="$router.push('/institutions')"
            >
              Cancel
            </q-btn>
          </div>
        </div>
        <div
          class="row q-col-gutter-md q-col-gutter-lg q-mb-md q-ml-xs q-mr-md q-mb-md justify-end"
          style="margin: auto"
        >
          <div v-if="formValidationError" class="text-negative q-mt-md">
            <label v-if="mode != 'Edit'"
              >Failed to create institution. Please correct the validation errors above.</label
            >
            <label v-if="mode === 'Edit'"
              >Failed to update institution. Please correct the validation errors above.</label
            >
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { ref, onMounted, watchEffect, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRoute, useRouter } from 'vue-router'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json' // Optional for localization
import postalCodes from 'postal-codes-js'
// import { data } from "autoprefixer";
import { institionListStore } from '../../stores/institionListStore'

const handleBlurAddressLine1 = () => {
  markTouched('addressLine1')
  validateInputs()
}
const handleBlurAddressLine2 = () => {
  markTouched('addressLine2')
  validateInputs()
}

const handleBlurCity = () => {
  markTouched('city')
  validateInputs()
}

const handleBlurState = () => {
  markTouched('state')
  validateInputs()
}

const handleBlurPostalCode = () => {
  markTouched('postalCode')
  validateInputs()
}

const handleBlurCountry = () => {
  markTouched('country')
  validateInputs()
}

const handleBlurContactEmail = () => {
  markTouched('contactEmail')
  validateInputs()
}

const handleBlurContactPhoneNumber = () => {
  markTouched('contactPhoneNumber')
  validateInputs()
}

const handleBlurInstitutionType = () => {
  markTouched('institutionType')
  validateInputs()
}

const handleBlurWebsiteUrl = () => {
  markTouched('websiteUrl')
  validateInputs()
}

const handleBlurAdminUsers = () => {
  markTouched('adminUsersModel')
  validateInputs()
}

const handleBlurLogoFile = () => {
  markTouched('logoFiles')
  validateInputs()
}

const $router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()

const userEmail = authStore.user?.email
authStore.fetchCurrentUser()
const updateInstition = institionListStore()
// const editLogoVisible = ref(false);
const uploaderVisible = ref(true)
const editLogoUrl = ref('')
const isSubmitting = ref(false)
const validationResult = ref(false)
const institutionName = ref('')
const addressLine1 = ref('')
const addressLine2 = ref('')
const city = ref('')
const state = ref('')
const postalCode = ref('')
const country = ref('')
const contactName = ref('')
const contactEmail = ref('')
const contactPhoneNumber = ref('')
const websiteUrl = ref('')
const institutionType = ref('')
const defaultInstitutionType = ref('')
const logoFiles = ref([])

const countryOptions = ref([])
const filteredCountries = ref([])
const institutionOptions = ref([])
const institutionAdmin = ref([])
const institutionNameError = ref(null)
const addressLine1Error = ref(null)
const addressLine2Error = ref(null)
const cityError = ref(null)
const stateError = ref(null)
const postalCodeError = ref(null)
const countryError = ref(null)
const contactNameError = ref(null)
const contactEmailError = ref(null)
const contactPhError = ref(null)
const weburlError = ref(null)
const institutionTypeError = ref(null)
const institutionAdminError = ref(null)
const imageError = ref(null)

let imageUrl = ref('')
let logoFile = ref(null)

const hasErrors = ref(false)

const institutionNameTouched = ref(false)
const addressLine1Touched = ref(false)
const addressLine2Touched = ref(false)
const cityTouched = ref(false)
const stateTouched = ref(false)
const postalCodeTouched = ref(false)
const countryTouched = ref(false)
const contactNameTouched = ref(false)
const contactEmailTouched = ref(false)
const contactPhoneNumberTouched = ref(false)
const websiteUrlTouched = ref(false)
const institutionTypeTouched = ref(false)
const logoFilesTouched = ref(false)
const institutionAdminTouched = ref(false)
let formValidationError = ref(false)

const mode = ref(route.params.mode || 'create')
const institutionId = ref(route.params.organizationId)
let previousInstitutionName = ref('')

const userEmails = authStore.user?.email
if (userEmails) {
  localStorage.setItem('userEmail', userEmails)
}
const savedUserEmail = localStorage.getItem('userEmail')

const loadCountries = () => {
  countries.registerLocale(enLocale) // Optional: register locale for other languages
  const countryNames = countries.getNames('en', { select: 'official' })
  countryOptions.value = Object.entries(countryNames).map(([value, label]) => ({
    value,
    label: label,
  }))
  filteredCountries.value = [...countryOptions.value] // Initial filtered countries
}

const filterOptionss = (val, update) => {
  const search = val.toLowerCase()
  update(() => {
    filteredCountries.value = countryOptions.value.filter((option) =>
      option.label.toLowerCase().includes(search)
    )
  })
}

// Fetch institution types from the API
const fetchInstitutionTypes = async () => {
  try {
    const response = await api.get('/api/v1.0/organization/types?category=lms', { signal })
    institutionOptions.value = response.data.organizationTypes
      .map((type) => ({
        institutionType: type.organizationType,
        description: type.description,
      }))
      .sort((a, b) => a.institutionType.localeCompare(b.institutionType))
    // Set the default institution type to "Educational Institution" for the dropdown
    defaultInstitutionType.value = institutionOptions.value.find(
      (type) => type.institutionType === 'Educational Institution'
    )
  } catch (error) {
    if (error.response) {
      const errorMsg = 'An error occurred while fetching institution types. Please try again later.'
      notifyMessage(errorMsg)
    }
    // Handle all other cases
    else {
      const errorMsg = 'An error occurred while fetching institution types. Please try again later.'
      notifyMessage(errorMsg)
    }
  }
}

// Fetch institution admin users emails from the API
const fetchInstitutionAdminUsers = async () => {
  // TODO : uncomment this code after the API is ready
  // try {
  //   const response = await api.get(
  //     `/api/v1.0/organization/${institutionId.value}/admin_users`
  //   );
  //   if (response.status === 200) {
  //     adminUsers = response.data.adminUsers;
  //     adminUsersModel.value = adminUsers;
  //     filterOptions.value = adminUsers;
  //   }
  // } catch (error) {
  //   console.error("Error fetching admin users: ", error);
  //   $q.notify({
  //     type: "negative",
  //     message: "Failed to fetch admin users. Please try again later.",
  //     position: "center",
  //     timeout: 2000,
  //     textColor: "white",
  //     actions: [{ icon: "close", color: "white" }],
  //   });
  // }
}

onMounted(() => {
  fetchInstitutionTypes()
  loadCountries()
  institutionAdmin.value = userEmail
  if (mode.value == 'Edit' && institutionId.value) {
    uploaderVisible.value = false
    fetchInstitutionDetails(institutionId.value)
  }
})

const validateInstitutionName = async () => {
  try {
    // Make the API call to validate the institution name
    await api.post('/api/v1.0/organization/validate/name', {
      organizationName: institutionName.value,
    })
    // If the name is valid, clear the error
    institutionNameError.value = null
  } catch (error) {
    if (error.response) {
      if (
        error.response.status === 400 &&
        error.response.data?.error ===
          'Organization name already exists. Please choose another name.'
      ) {
        institutionNameError.value =
          'Institution name already exists. Please choose another unique name.'
      }
    }
  }
}

const getInstitutionName = async () => {
  // Check if the institution name has changed
  if (mode.value === 'Edit') {
    if (institutionName.value !== previousInstitutionName.value) {
      if (institutionName.value !== '') {
        await validateInstitutionName()
      }
    }
  } else {
    if (institutionName.value !== '') {
      await validateInstitutionName()
    }
  }
}
const fetchInstitutionDetails = async (institutionId) => {
  try {
    const response = await api.get('/api/v1.0/organization/details/' + institutionId)
    if (response.status == 200) {
      institutionName.value = response.data.organizationName
      addressLine1.value = response.data.addressLine1
      addressLine2.value = response.data.addressLine2
      city.value = response.data.city
      state.value = response.data.state
      postalCode.value = response.data.postalCode
      country.value = filteredCountries.value.find(
        (country) => country.label.toLowerCase() === response.data.country.toLowerCase()
      )
      contactName.value = response.data.contactName
      contactEmail.value = response.data.contactEmail
      contactPhoneNumber.value = response.data.contactPhoneNumber
      institutionType.value = institutionOptions.value.find(
        (Institutiontype) => Institutiontype.institutionType === response.data.organizationType
      )
      websiteUrl.value = response.data.websiteURL
      editLogoUrl.value = response.data.logo || ''
      adminUsersModel.value = response.data.adminEmails
      previousInstitutionName.value = response.data.organizationName
    }
  } catch (error) {
    console.error('Error Getting the institution: ', error)
  }
}

let showUploader = () => {
  logoFile.value.pickFiles()
}

let removeLogoFile = () => {
  uploaderVisible.value = false
  logoFiles.value = []
  imageUrl.value = ''
}

const setImagePreview = () => {
  if (logoFiles.value) {
    imageUrl.value = URL.createObjectURL(logoFiles.value)
  }
  uploaderVisible.value = true
}

const onSubmit = async () => {
  institutionNameTouched.value = true
  addressLine1Touched.value = true
  addressLine2Touched.value = true
  cityTouched.value = true
  stateTouched.value = true
  postalCodeTouched.value = true
  countryTouched.value = true
  contactNameTouched.value = true
  contactEmailTouched.value = true
  contactPhoneNumberTouched.value = true
  websiteUrlTouched.value = true
  institutionTypeTouched.value = true
  institutionAdminTouched.value = true
  await getInstitutionName()
  if (institutionNameError.value) {
    formValidationError.value = true
    return
  }
  if (!validateInputs()) {
    formValidationError.value = true

    return
  }
  isSubmitting.value = true

  const formData = new FormData()

  // Append each field to FormData
  formData.append('organizationName', institutionName.value)
  formData.append('addressLine1', addressLine1.value)
  formData.append('addressLine2', addressLine2.value)
  formData.append('city', city.value)
  formData.append('state', state.value)
  formData.append('postalCode', postalCode.value)
  formData.append('country', country.value.label)
  formData.append('contactName', contactName.value)
  formData.append('contactEmail', contactEmail.value)
  formData.append('contactPhoneNumber', contactPhoneNumber.value)
  formData.append('websiteURL', websiteUrl.value)
  formData.append('organizationType', institutionType.value.institutionType)

  // Appends each email from the adminUsersModel to the formData object under the key "adminEmails".
  // This approach is necessary because when managing a string array in FormData,
  // we need to append each element of the array individually to ensure that all values are included in the form data.
  adminUsersModel.value.forEach((email) => {
    formData.append('adminEmails', email)
  })

  if (logoFiles.value) {
    formData.append('logo', logoFiles.value)
  }

  if (mode.value === 'Edit') {
    formData.append('organizationId', institutionId.value)
    updateInstitution(formData)
  } else {
    createInstitution(formData)
  }
}

// Create an AbortController to handle potential request cancellation
const API_TIMEOUT = 10000 // 1 minute timeout
const controller = new AbortController() // Create an AbortController instance
const { signal } = controller // Get the signal from the controller
// Set a timeout to abort the request
setTimeout(() => {
  controller.abort() // Abort the request
}, API_TIMEOUT)
const updateListInstitionStore = () => {
  updateInstition.updateInstition().then((success) => {
    if (success) {
      $router.push('/institutions')
    } else {
      console.error('Failed to update institution list')
    }
  })
}
const createInstitution = async (formData) => {
  isSubmitting.value = true

  try {
    const response = await api.post(
      '/api/v1.0/organization/create_organization',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      { signal }
    )
    if (response.data.success) {
      clearUI()

      const success = 'Institution is created successfully.'
      notifyMessage(success, 'positive')
      localStorage.removeItem('userEmail')
      updateListInstitionStore()
    } else {
      const msg = 'An error occurred while creating the institution. Please try again later.'
      notifyMessage(msg)
    }
  } catch (error) {
    if (error.response) {
      // Handle unsupported file type
      if (error.response.status === 415 && error.response.data?.error === 'Unsupported file type') {
        const errorMsg = 'Unsupported file type'
        notifyMessage(errorMsg)
        isSubmitting.value = false
      } else if (
        error.response.status === 400 &&
        error.response.data?.error ===
          'Organization name already exists. Please choose another name.'
      ) {
        const errorMsg = 'Institution name already exists. Please choose another unique name.'
        notifyMessage(errorMsg)
        isSubmitting.value = false
      }
      // Handle all other cases
      else {
        const errorMsg =
          error.response?.data?.message ||
          'An error occurred while creating the institution. Please try again later.'
        notifyMessage(errorMsg)
        isSubmitting.value = false
      }
    }
  } finally {
    isSubmitting.value = false // Reset submitting state
  }
}
const updateInstitution = async (formData) => {
  isSubmitting.value = true
  try {
    const response = await api.post(
      '/api/v1.0/organization/update/' + institutionId.value,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    if (response.data.success) {
      const success = 'Institution is updated successfully.'
      notifyMessage(success, 'positive')
      updateListInstitionStore()
    } else {
      const msg = 'An error occurred while updating the institution. Please try again later.'
      notifyMessage(msg)
    }
  } catch (error) {
    if (error.response.status === 403) {
      const errorMsg = 'Organization not found'
      notifyMessage(errorMsg)
    } else {
      const msg = 'An error occurred while updating the institution. Please try again later.'
      notifyMessage(msg)
    }
  } finally {
    isSubmitting.value = false
  }
}

const clearUI = () => {
  clearErrors()
  institutionName.value = ''
  addressLine1.value = ''
  addressLine2.value = ''
  city.value = ''
  state.value = ''
  postalCode.value = ''
  country.value = ''
  contactName.value = ''
  contactEmail.value = ''
  contactPhoneNumber.value = ''
  websiteUrl.value = ''
  institutionType.value = defaultInstitutionType.value
  adminUsersModel.value = []
  editLogoUrl.value = '/organizations/default/logo.png' // TODO: test this
  imageUrl.value = ''
  clearFiles()
}
const clearFiles = () => {
  // Reset the array to clear v-model
  logoFiles.value = []
}
const clearErrors = () => {
  institutionNameError.value = null
  addressLine1Error.value = null
  addressLine2Error.value = null
  cityError.value = null
  stateError.value = null
  postalCodeError.value = null
  countryError.value = null
  contactNameError.value = null
  contactEmailError.value = null
  contactPhError.value = null
  weburlError.value = null
  institutionTypeError.value = null
  institutionAdminError.value = null
  imageError.value = null
}

const validateInputs = () => {
  addressLine1Error.value = null
  addressLine2Error.value = null
  cityError.value = null
  stateError.value = null
  postalCodeError.value = null
  countryError.value = null
  contactNameError.value = null
  contactEmailError.value = null
  contactPhError.value = null
  weburlError.value = null
  institutionTypeError.value = null
  institutionAdminError.value = null
  imageError.value = null
  // getInstitutionName();
  const file = logoFiles.value[0]
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (file && !validImageTypes.includes(file.type)) {
    imageError.value = 'Only .jpg, .jpeg, .png, and .gif files are allowed.'
  }
  if (institutionNameTouched.value) {
    if (!institutionName.value) {
      hasErrors.value = true
      institutionNameError.value = 'Institution Name is required'
    } else if (!validateName(institutionName.value)) {
      hasErrors.value = true
      institutionNameError.value = 'Only alphabets, digits, hyphens, spaces, and dots are allowed'
    }
  }

  if (addressLine1Touched.value) {
    if (!addressLine1.value) {
      hasErrors.value = true
      addressLine1Error.value = 'Address Line 1 is required'
    }
  }

  if (cityTouched.value) {
    if (!city.value) {
      hasErrors.value = true
      cityError.value = 'City is required'
    }
  }

  if (stateTouched.value) {
    if (!state.value) {
      hasErrors.value = true
      stateError.value = 'State is required'
    }
  }

  if (postalCodeTouched.value) {
    if (!postalCode.value) {
      hasErrors.value = true
      postalCodeError.value = 'Postal code is required'
    } else if (!validatePostalCode(postalCode.value)) {
      hasErrors.value = true
      postalCodeError.value = 'Invalid postal code format'
    }
  }

  // Country Dropdown
  if (countryTouched.value) {
    if (!country.value) {
      hasErrors.value = true
      countryError.value = 'Country is required'
    }
  }
  // Contact Name
  if (contactNameTouched.value) {
    if (!contactName.value) {
      hasErrors.value = true
      contactNameError.value = 'Contact Name is required'
    } else if (!validateName(contactName.value)) {
      hasErrors.value = true
      contactNameError.value = 'Only alphabets, digits, hyphens, spaces, and dots are allowed'
    }
  }

  // Contact Email
  if (contactEmailTouched.value) {
    if (!contactEmail.value) {
      hasErrors.value = true
      contactEmailError.value = 'Contact Email is required'
    } else if (!validateEmail(contactEmail.value)) {
      hasErrors.value = true
      contactEmailError.value = 'Must be a valid email format'
    }
  }
  // Contact Phone Number
  if (contactPhoneNumberTouched.value) {
    if (!contactPhoneNumber.value) {
      hasErrors.value = true
      contactPhError.value = 'Contact Phone Number is required'
    } else if (!validatePhone(contactPhoneNumber.value)) {
      hasErrors.value = true
      contactPhError.value = 'Invalid phone number format, digits only'
    }
  }
  // Website URL (optional field)
  if (websiteUrlTouched.value) {
    if (websiteUrl.value && !validateURL(websiteUrl.value)) {
      hasErrors.value = true
      weburlError.value = 'Must be a valid URL format'
    }
  }

  // Institution Type Dropdown
  if (institutionTypeTouched.value) {
    if (!institutionType.value) {
      hasErrors.value = true
      institutionTypeError.value = 'Institution Type is required'
    }
  }
  if (institutionAdminTouched.value) {
    // Check if adminUsersModel.value is an empty array or not
    if (!adminUsersModel.value || adminUsersModel.value.length === 0) {
      hasErrors.value = true
      institutionAdminError.value = 'Admin Email is required'
    } else {
      // Validate each email in the array
      const invalidEmails = adminUsersModel.value.filter((email) => !validateEmail(email))

      if (invalidEmails.length > 0) {
        hasErrors.value = true
        institutionAdminError.value = 'Must be a valid email format'
      }
    }
  }

  // Check if both country and postal code are provided
  if (country.value.value && postalCode.value) {
    // Correct the postal code validation logic by passing the postal code first and then the country code
    validationResult.value =
      postalCodes.validate(
        country.value.value, // Country code
        postalCode.value // Postal code
      ) === true
    if (validationResult.value == false) {
      hasErrors.value = true
      postalCodeError.value = 'Invalid postal code'
    }
  } else {
    // Reset the validation result if inputs are empty
    validationResult.value = null
  }

  return (
    institutionNameError.value === null &&
    addressLine1Error.value === null &&
    addressLine2Error.value === null &&
    cityError.value === null &&
    stateError.value === null &&
    postalCodeError.value === null &&
    countryError.value === null &&
    contactNameError.value === null &&
    contactEmailError.value === null &&
    contactPhError.value === null &&
    weburlError.value === null &&
    institutionTypeError.value === null &&
    institutionAdminError.value === null &&
    imageError.value === null
  )
}

const markTouched = (field) => {
  const touchedFields = {
    institutionName: institutionNameTouched,
    addressLine1: addressLine1Touched,
    addressLine2: addressLine2Touched,
    city: cityTouched,
    state: stateTouched,
    postalCode: postalCodeTouched,
    country: countryTouched,
    contactName: contactNameTouched,
    contactEmail: contactEmailTouched,
    contactPhoneNumber: contactPhoneNumberTouched,
    websiteUrl: websiteUrlTouched,
    institutionType: institutionTypeTouched,
    logoFiles: logoFilesTouched,
    adminUsersModel: institutionAdminTouched,
  }

  if (touchedFields[field] !== undefined) {
    touchedFields[field].value = true
    formValidationError.value = false
  }
}

const validateName = (name) => {
  // eslint-disable-next-line no-useless-escape
  const namePattern = /^[\p{L}\p{N} \-\.]+$/u
  return namePattern.test(name)
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  const phoneRegex = /^\d+$/ // Allows only digits
  return phoneRegex.test(phone)
}
const validatePostalCode = (name) => {
  // Regular expression for alphabets and numbers only
  const namePattern = /^[a-zA-Z0-9'-]+$/
  return namePattern.test(name)
}
const validateURL = (url) => {
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/
  return urlRegex.test(url)
}

// Admin users Multiselect dropdown related code [Start].

let adminUsersModel = ref([])
let adminUsers = []
if (mode.value == 'Edit') {
  // Fetch admin users from the API
  fetchInstitutionAdminUsers()
} else {
  adminUsers.push(savedUserEmail)
}
const filterOptions = ref(adminUsers)
const createValue = (val, done) => {
  if (val.length > 0) {
    if (validateEmail(val)) {
      if (!adminUsers.includes(val)) {
        adminUsers.push(val)
      }
      done(val, 'toggle')
    } else {
      const message = val + ' is not a valid email format. Please enter a valid email address.'
      notifyMessage(message)
      institutionAdminError.value = 'Must be a valid email format'
      setTimeout(() => {
        institutionAdminError.value = null
      }, 2000)
    }
  }
}

const filterFn = (val, update) => {
  update(() => {
    if (val === '') {
      filterOptions.value = adminUsers
    } else {
      const needle = val.toLowerCase()
      filterOptions.value = adminUsers.filter((v) => v.toLowerCase().indexOf(needle) > -1)
    }
  })
}

// Admin users Multiselect dropdown related code [End].

watchEffect(() => {
  mode.value = route.params.mode || 'create'
  const institutionId = ref(route.params.organizationId)
  if (mode.value == 'Edit') {
    fetchInstitutionDetails(institutionId.value)
  } else {
    clearUI()
    uploaderVisible.value = true
  }
  // Logs every time the component renders or mode changes
})
// [FS] LMS-90  Change notifications behavior
let dismissNotification = null
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

$router.afterEach(() => {
  clearUI()
  clearErrors()
  hideNotification()
})

onBeforeUnmount(() => {
  // Clear the specific item from local storage when the component is destroyed
  localStorage.removeItem('userEmail') // Clears only 'userEmail'
})

function handleBlurInstitutionName() {
  markTouched('institutionName')
  getInstitutionName()
  validateInputs()
}
</script>

<style scoped>
.card-container {
  max-width: 800px;
  margin: auto;
}

.image-container {
  margin: 0px auto;
  position: relative;
  width: 300px;
  height: 300px;
  border: 1px solid #c2c2c2;
}

.default-logo {
  width: 100%;
  /* Make the image fill the container */
  height: calc(100% - 24px);
  /* label height is 24px */
  object-fit: contain;
  color: #757575;
  /* Maintain aspect ratio */
}

.overlay-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  /* Initially hidden */
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.image-container:hover .overlay-button {
  display: block;
  /* Show button on hover */
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: grey;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: grey;
}
</style>
