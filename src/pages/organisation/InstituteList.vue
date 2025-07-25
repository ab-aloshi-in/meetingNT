<template>
  <q-page padding @click="hideNotification">
    <div class="row items-center q-mb-md q-ml-xs q-mr-md q-mb-md q-gutter-xs justify-end">
      <q-btn
        flat
        no-caps
        style="background-color: #bbdefb; margin-right: 5px"
        color="primary"
        icon="filter_list"
        aria-label="Filter"
        @click="showFilters"
        v-if="!isFilterActive"
      >
        <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]"> Show Filters </q-tooltip>
      </q-btn>

      <q-btn
        flat
        no-caps
        style="background-color: #bbdefb; margin-right: 5px"
        color="primary"
        icon="filter_list_off"
        aria-label="Filter"
        @click="hideFilters"
        v-if="isFilterActive"
      >
        <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]"> Hide Filters </q-tooltip>
      </q-btn>
      <q-input
        v-model="searchQuery"
        placeholder="Search institutions..."
        outlined
        dense
        clearable
        style="width: 230px"
        @update:model-value="setSearchQuery"
      >
        <template v-slot:append> <q-icon name="search" /> </template
      ></q-input>
      <q-space />
      <!-- Button to create institution as a link -->
      <q-btn
        no-caps
        style="margin-right: 5px"
        label="Create Institution"
        color="primary"
        icon="add_circle"
        @click="goToCreateInstitution({})"
      />
      <div class="row items-center no-wrap q-gutter-xs" v-if="isWideScreen">
        <!-- View label -->
        <label class="text-bold q-mt-xs-none q-mr-xs text-primary">View:</label>
        <!-- Dropdown showing 2 options table view and card view -->
        <q-select
          v-model="displayView"
          :options="views"
          option-label="label"
          option-value="value"
          borderless
          class="q-mb-xs"
          @update:model-value="switchView"
        />
      </div>

      <div class="row items-center no-wrap q-gutter-xs">
        <!-- Sort By label -->
        <label class="text-bold q-mt-xs-none q-mr-xs text-primary">SORT BY:</label>
        <!-- Dropdown Select -->
        <q-select
          v-model="selectedCondition"
          :options="sortList"
          option-label="label"
          option-value="value"
          borderless
          class="q-mb-xs"
        />
      </div>
    </div>

    <!-- Horizontal line with reduced margin -->
    <q-separator class="q-mt-xs q-mb-md" />

    <div class="q-gutter-md filter-row items-center q-mb-md justify-end" v-if="isFilterActive">
      <q-select
        v-model="institutionType"
        :options="institutionOptions"
        label="Filter by Type"
        outlined
        dense
        clearable
        style="width: 250px"
        option-label="institutionType"
        option-value="institutionType.value"
        @update:model-value="setInstitutionTypeFilter"
      />
      <!-- Status Filter -->
      <q-select
        v-model="selectedEnabled"
        :options="enabledOptions"
        label="Filter by Enabled/Disabled"
        outlined
        dense
        clearable
        style="width: 250px"
        @update:model-value="setInstitutionStatusFilter"
      />
      <q-space />
      <!-- button to clear all filters -->
      <q-btn
        no-caps
        style="margin-right: 5px"
        label="Clear Filters"
        color="blue-grey"
        @click="removeFilters"
      >
        <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
          Clear All Filters
        </q-tooltip>
      </q-btn>
    </div>

    <!-- Horizontal line with reduced margin -->
    <q-separator class="q-mt-xs q-mb-md" v-if="isFilterActive" />

    <!-- filters row [Start]-->
    <div class="q-gutter-md filter-row" v-if="isSortActive" style="margin-bottom: 16px">
      <!-- Sort by Name -->
      <q-select
        v-model="selectedNameSort"
        :options="nameSortOptions"
        label="Sort by Name"
        outlined
        dense
        clearable
        style="width: 230px"
      />
      <q-select
        v-model="selectedNameSort"
        :options="nameSortOptions"
        label="Sort by Name"
        outlined
        dense
        clearable
        style="width: 230px"
      />

      <!-- Sort by Date Created -->
      <q-select
        v-model="selectedDateSort"
        :options="dateSortOptions"
        label="Sort by Date Created"
        outlined
        dense
        clearable
        style="width: 230px"
      />
      <q-select
        v-model="selectedDateSort"
        :options="dateSortOptions"
        label="Sort by Date Created"
        outlined
        dense
        clearable
        style="width: 230px"
      />
    </div>
    <!-- filters row [End]-->
    <div class="row q-gutter-xs">
      <!-- Card view [Start] -->
      <div v-if="isCardView" class="cards-container">
        <div class="cards-container">
          <q-card v-if="filteredAndSortedInstitutions.length === 0">
            <q-item>
              <q-item-section avatar>
                <q-icon name="info" size="2em" color="warning" />
              </q-item-section>
              <q-item-section>
                <q-item-label>No institutions found</q-item-label>
                <q-item-label caption v-if="isFilterActive">
                  No institutions match your filters.
                </q-item-label>
                <q-item-label caption v-if="!isFilterActive">
                  No institutions found. Consider creating a new one
                  <a href="#" @click.prevent="goToCreateInstitution({})" class="text-primary">
                    here</a
                  >.
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>

          <div class="row q-gutter-md flex-wrap justify-center">
            <q-card
              class="my-card"
              v-for="institution in filteredAndSortedInstitutions"
              :key="institution.id"
            >
              <q-card-section class="q-pb-sm">
                <div class="row items-center no-wrap">
                  <img
                    :src="institution.logo"
                    alt="Logo"
                    style="width: 50px; height: 50px; margin-right: 10px; border-radius: 50%"
                    class="cursor-pointer"
                    @click.prevent="navigateToInstitution(institution.uniqueName)"
                  />
                  <div
                    class="text-h6 text-primary cursor-pointer ellipsis organization-label"
                    @click.prevent="navigateToInstitution(institution.uniqueName)"
                  >
                    {{ institution.organizationName }}
                    <q-tooltip anchor="top middle" self="bottom middle" :class="tooltipClass">
                      {{ institution.organizationName }}</q-tooltip
                    >
                    <div
                      class="text-subtitle2 text-primary cursor-pointer ellipsis organization-label"
                      @click.prevent="navigateToInstitution(institution.uniqueName)"
                    >
                      <q-tooltip anchor="top middle" self="bottom middle" :class="tooltipClass">
                        {{ institution.uniqueName }}</q-tooltip
                      >
                    </div>
                  </div>
                </div>
                <q-card-section
                  style="border-bottom: 1px solid #f0f0f0"
                  class="q-pt-xs q-pb-xs role-chip"
                >
                  <q-item-label caption style="font-size: 1rem">
                    <span class="text-caption">Your role: </span>
                    <q-chip
                      outline
                      color="secondary"
                      text-color="white"
                      size="x-small"
                      v-for="userRole in institution.userRoles"
                      :key="userRole"
                    >
                      {{ userRole }}
                      <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                        Your role: {{ userRole }}
                      </q-tooltip>
                    </q-chip>
                  </q-item-label>
                </q-card-section>
                <div>
                  <q-expansion-item
                    expand-separator
                    icon="link"
                    label="Invite Users"
                    caption="Invite users to join this institution"
                    class="text-subtitle2 text-positive"
                    style="border-bottom: 1px solid #f0f0f0"
                  >
                    <q-card>
                      <q-card-section class="q-pa-xs">
                        <div class="text-subtitle2 text-blue-grey">Invitation Link</div>
                        <!-- TODO get Invitation link from backend -->
                        <span class="text-caption q-item__label--caption">
                          https://localhost/join/organization/{{
                            institution.uniqueName
                          }}/?invite=506f53de-b8b6-42f0-9e4e-17b8e6006c2e
                        </span>
                      </q-card-section>
                      <q-card-section class="q-pa-none">
                        <div class="row justify-center q-pa-xs">
                          <q-btn
                            icon="content_copy"
                            size="sm"
                            color="positive"
                            @click="copyToClipboard(selectedInstitution.invitationInfo)"
                          >
                            <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                              Copy Invitation Link
                            </q-tooltip>
                            Copy Invitation Link
                          </q-btn>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </div>
              </q-card-section>

              <q-card-actions class="q-pb-md">
                <q-btn
                  no-caps
                  color="primary"
                  icon="edit_square"
                  size="sm"
                  @click="goToEditInstitution(institution)"
                  v-ripple
                >
                  <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                    Edit Institution
                  </q-tooltip>
                  Edit
                </q-btn>
                <q-btn
                  no-caps
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteconfirmBtn(institution.organizationId)"
                >
                  <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                    Delete Institution
                  </q-tooltip>
                  Delete</q-btn
                >

                <q-space />
                <q-toggle
                  color="secondary"
                  size="sm"
                  :model-value="!institution.disabled"
                  @update:model-value="handleToggle(institution)"
                >
                  <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                    {{ institution.disabled ? 'Enable' : 'Disable' }}
                    Institution
                  </q-tooltip>
                </q-toggle>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <!-- Card view [End] -->

      <!-- Table view [Start]-->
      <div v-if="!isCardView" class="col">
        <q-table
          @row-click="(evt, row) => showRowDetails(row)"
          v-model:selected.sync="selected"
          :class="darkMode ? 'sticky-header-table-dark' : 'sticky-header-table'"
          :rows="filteredAndSortedInstitutions"
          row-key="organizationId"
          :columns="[
            {
              name: 'organizationName',
              label: 'Institution Name',
              field: 'organizationName',
              align: 'left',
              style: 'width: 100px',
            },
            {
              name: 'roles',
              label: 'Your Roles',
              field: 'userRoles',
              align: 'left',
            },
            {
              name: 'arrow',
              label: '',
              align: 'right',
              field: 'arrow',
              sortable: false,
              style: 'width: 15px',
              classes: ['auto-width', darkMode ? 'text-dark' : 'text-light'],
            },
          ]"
          v-model:pagination="updateInstition.pagination"
          @request="setPagination"
          header-class="bg-primary text-white"
        >
          <template v-slot:no-data>
            <div class="row text-Left q-pa-sm no-wrap">
              <div class="row items-center q-mr-sm">
                <q-icon name="info" size="sm" color="warning" />
              </div>
              <q-item-section>
                <q-item-label>No institutions found</q-item-label>
                <q-item-label :class="darkMode ? 'q-item--dark' : ''" caption v-if="isFilterActive">
                  No institutions match your filters.
                </q-item-label>
                <q-item-label
                  :class="darkMode ? 'q-item--dark' : ''"
                  caption
                  v-if="!isFilterActive"
                >
                  No institutions found. Consider creating a new one
                  <a href="#" @click.prevent="goToCreateInstitution({})" class="text-primary">
                    here</a
                  >.
                </q-item-label>
              </q-item-section>
            </div>
          </template>
          <template v-slot:body-cell-arrow="props">
            <q-td :props="props">
              <q-icon
                name="arrow_forward"
                class="cursor-pointer"
                @click="showRowDetails(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-roles="props">
            <q-td :props="props">
              <div class="row justify-right">
                <q-chip
                  v-for="role in props.row.userRoles"
                  :key="role"
                  color="secondary"
                  text-color="white"
                  size="10px"
                  square
                  outline
                >
                  {{ role }}
                </q-chip>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-organizationName="props">
            <q-td :props="props">
              <span class="row no-wrap items-center text-primary">
                <span
                  class="cursor-pointer ellipsis organization-labels"
                  @click="navigateToInstitution(props.row.uniqueName)"
                >
                  {{ props.row.organizationName }}
                  <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                    Click to view details
                  </q-tooltip>
                </span>
              </span>
            </q-td>
          </template>
        </q-table>
      </div>
      <!-- Table view [End]-->

      <!--Institution details side card view [Start] -->
      <q-card v-if="!isCardView && showDetailsCard" class="full-height-card details-card">
        <q-card-section :class="darkMode ? 'text-dark' : 'text-light'">
          <div v-if="selectedInstitution" class="q-pa-md">
            <div class="row items-center cursor-pointer q-mb-md">
              <img
                :src="selectedInstitution.logo"
                alt="Logo"
                style="width: 100px; height: 100px; margin-right: 20px; border-radius: 50%"
                @click.prevent="navigateToInstitution(selectedInstitution.uniqueName)"
              />
              <div>
                <div
                  class="text-subtitle1 text-primary cursor-pointer ellipsis organization-label"
                  @click.prevent="navigateToInstitution(selectedInstitution.uniqueName)"
                >
                  {{ selectedInstitution.organizationName }}
                  <q-tooltip anchor="top middle" self="bottom middle" :class="tooltipClass">
                    {{ selectedInstitution.organizationName }}</q-tooltip
                  >
                </div>
                <div
                  class="text-subtitle2 text-blue-8 cursor-pointer ellipsis organization-label"
                  @click.prevent="navigateToInstitution(selectedInstitution.uniqueName)"
                >
                  {{ selectedInstitution.uniqueName }}
                  <q-tooltip anchor="top middle" self="bottom middle" :class="tooltipClass">
                    {{ selectedInstitution.uniqueName }}</q-tooltip
                  >
                </div>
              </div>
            </div>
            <q-separator
              class="q-mb-md"
              v-if="
                getRole.selectedRole.includes('Admin') || getRole.selectedRole.includes('Owner')
              "
            />
            <div
              class="row q-mb-md justify-end"
              v-if="
                getRole.selectedRole.includes('Admin') || getRole.selectedRole.includes('Owner')
              "
            >
              <strong>Invitation Link:</strong>
              <q-space />
              <div class="row items-center">
                <q-btn
                  icon="content_copy"
                  size="sm"
                  color="positive"
                  @click="copyToClipboard(selectedInstitution.invitationInfo)"
                >
                  <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                    Copy Invitation Link
                  </q-tooltip>
                  Copy
                </q-btn>
              </div>
            </div>
            <q-separator class="q-mb-md" />
            <div
              class="q-mb-md row items-center"
              v-if="
                getRole.selectedRole.includes('Admin') || getRole.selectedRole.includes('Owner')
              "
            >
              <strong>Status:</strong>
              <span>&nbsp;</span>
              {{ selectedInstitution.disabled ? 'Disabled' : 'Enabled' }}
              <q-space />
              <q-toggle
                color="secondary"
                size="md"
                :model-value="!selectedInstitution.disabled"
                @update:model-value="handleToggle(selectedInstitution)"
              >
                <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                  {{ selectedInstitution.disabled ? 'Enable' : 'Disable' }}
                  Institution
                </q-tooltip>
              </q-toggle>
            </div>
            <div class="q-mb-md">
              <strong>Institution Type:</strong>
              {{ selectedInstitution.organizationType }}
            </div>

            <div class="q-mb-md">
              <strong>Contact Name:</strong>
              {{ selectedInstitution.contactName }}
            </div>
            <div class="q-mb-md">
              <strong>Contact Email:</strong>
              {{ selectedInstitution.contactEmail }}
            </div>
            <div class="q-mb-md">
              <strong>Contact Number:</strong>
              {{ selectedInstitution.contactPhoneNumber }}
            </div>
            <div class="q-mb-md">
              <strong>Address:</strong>
              <div>{{ selectedInstitution.addressLine1 }}</div>
              <div>{{ selectedInstitution.addressLine2 }}</div>
              <div>
                {{ selectedInstitution.city }}, {{ selectedInstitution.state }}
                {{ selectedInstitution.postalCode }}
              </div>
              <div>{{ selectedInstitution.country }}</div>
            </div>
            <div class="row items-center">
              <strong>Website URL:</strong>
              <span>&nbsp;</span>
              <a
                class="text-primary"
                :href="getWebsiteURL(selectedInstitution.websiteURL)"
                target="_blank"
                >{{ selectedInstitution.websiteURL }}</a
              >
              <a
                :href="getWebsiteURL(selectedInstitution.websiteURL)"
                target="_blank"
                v-if="selectedInstitution.websiteURL"
              >
                <q-btn dense flat icon="open_in_new" color="primary">
                  <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                    Open in new tab
                  </q-tooltip>
                </q-btn>
              </a>
            </div>
            <q-separator class="q-mb-md" />
            <div
              class="q-mb-md row items-center justify-end"
              v-if="
                getRole.selectedRole.includes('Admin') || getRole.selectedRole.includes('Owner')
              "
            >
              <q-btn
                no-caps
                color="primary"
                icon="edit"
                size="md"
                class="q-mr-sm"
                @click="goToEditInstitution(selectedInstitution)"
                v-ripple
              >
                <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                  Edit Institution
                </q-tooltip>
                Edit
              </q-btn>
              <q-btn
                no-caps
                color="negative"
                icon="delete"
                size="md"
                @click="deleteconfirmBtn(selectedInstitution.organizationId)"
              >
                <q-tooltip class="bg-gray text-body3 shadow-2" :offset="[5, 5]">
                  Delete Institution
                </q-tooltip>
                Delete
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-btn
          flat
          icon="close"
          color="blue-grey"
          class="absolute-top-right"
          @click="hideDetailsCard"
        />
      </q-card>
      <!--Institution details side card view [End] -->

      <!-- Toggle Institution Status Dialog [Start] -->
      <q-dialog v-model="toggleConfirmDialog" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">
              Are you sure you want to
              {{ toggleTarget.disabled ? 'enable' : 'disable' }} this institution?
            </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup @click="cancelToggleChange" />
            <q-btn
              flat
              label="Confirm"
              color="primary"
              v-close-popup
              @click="confirmToggleChange"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Toggle Institution Status Dialog [End] -->

      <!-- Delete Institution Dialog [Start] -->
      <q-dialog v-model="deleteconfirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">Are you sure you want to delete this institution?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteConfirmed()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Delete Institution Dialog [End] -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { api } from 'src/boot/axios'

import { institionListStore } from '../../stores/institionListStore'
import { useQuasar } from 'quasar'

import { roleStore } from '../../stores/roleStore'

defineOptions({
  name: 'InstituteList',
})

const $q = useQuasar()
const $router = useRouter()

const updateInstition = institionListStore()
const deleteconfirm = ref(false)
let institutions = ref([]) || []
const institutionOptions = ref([])
const showDetailsCard = ref(false)
const selectedInstitution = ref(null)
const selected = ref([])
const sortList = ref([])
const route = useRoute()
const searchQuery = ref('')
const isFilterActive = ref(false)
const isSortActive = ref(false)
const institutionType = ref(null)

const selectedEnabled = ref(null)
const selectedNameSort = ref(null)
const selectedDateSort = ref(null)
const InsdeleteId = ref()
const toggleConfirmDialog = ref(false)
const toggleTarget = ref(false)
const institutionStatusFilter = ref(null)
const institutionTypeFilter = ref(null)
const searchData = ref(null)
const isCardView = ref(false) // Default to table view
const isWideScreen = ref(false)
const views = ref([])
const displayView = ref(null)
const darkMode = ref(localStorage.getItem('darkMode') || false)
const getRole = roleStore()

const updateScreenWidth = () => {
  if ($q && $q.screen && $q.screen.width !== undefined) {
    isCardView.value = $q.screen.width <= 768
    isWideScreen.value = $q.screen.width > 768
  } // Adjust breakpoint if needed
}

views.value.push({ label: 'Card View', value: true }, { label: 'Table View', value: false })

if (updateScreenWidth) {
  displayView.value = views.value[0]
} else {
  displayView.value = views.value[1]
}

sortList.value.push(
  { label: 'Institution Name A-Z', value: 'Institution Name A-Z' },
  { label: 'Institution Name Z-A', value: 'Institution Name Z-A' },
  { label: 'Enabled', value: 'Enabled' },
  { label: 'Disabled', value: 'Disabled' }
)
const selectedCondition = ref(sortList.value[0])

const navigateToInstitution = (institutionName) => {
  $router.push(`/lms/institutions/${institutionName}`)
}

const goToCreateInstitution = () => {
  $router.push({
    name: 'create_institutions',
    params: { mode: 'Create' },
  })
}
const setDefaultView = () => {
  if (isCardView.value) {
    displayView.value = { label: 'Card View', value: true }
  } else {
    displayView.value = { label: 'Table View', value: false }
  }
}

onMounted(() => {
  fetchInstitutionTypes()
  UpdateInstitutionStore()
  updateScreenWidth()
  setDefaultView()
  darkMode.value = JSON.parse(localStorage.getItem('darkMode')) || false
})

window.addEventListener('dark-mode-changed', (event) => {
  darkMode.value = event.detail.darkMode
})

onBeforeRouteLeave((to, from) => {
  // Check if navigating away from the institutions details view
  if (to.name === 'institutions_details') {
    if (from.name === 'institutions_details' && !to.query.selectedInstitution) {
      hideDetailsCard() // Hide the details card only if navigating away from details view and no selectedInstitution in query params
    }
  }
})

watch(institutions, (newInstitutions) => {
  if (route.params.uniqueName && route.params.uniqueName !== '') {
    const institution = newInstitutions.find((inst) => inst.uniqueName === route.params.uniqueName)
    if (institution) {
      showRowDetails(institution)
    }
  }
})
const statusParam = ref('')
const pageSizeParam = ref(null)
const pageCountParam = ref(null)
const institutionTypeParam = ref('')
const searchInstitution = ref('')

const setPagination = async (props) => {
  await updateInstition.setPagination(
    props.pagination.page,
    props.pagination.rowsPerPage,
    props.pagination.rowsNumber
  )
  route.params.pageSize = updateInstition.pagination.rowsPerPage
  route.params.pageCount = updateInstition.pagination.page
  searchInstitution.value =
    route.params.searchQuery === 'none' || !route.params.searchQuery
      ? null
      : route.params.searchQuery
  statusParam.value =
    route.params.status === 'none' || !route.params.status
      ? null
      : route.params.status.charAt(0).toLowerCase() + route.params.status.slice(1)

  institutionTypeParam.value =
    route.params.institutionType === 'none' || !route.params.institutionType
      ? null
      : route.params.institutionType
  await updateInstition.updateInstition(
    institutionTypeParam.value,
    statusParam.value,
    searchInstitution.value,
    props.pagination.page,
    props.pagination.rowsPerPage
  )
}

const UpdateInstitutionStore = async () => {
  route.params.pageSize = updateInstition.pagination.rowsPerPage
  route.params.pageCount = updateInstition.pagination.page
  pageCountParam.value = route.params.pageCount ? route.params.pageCount : null
  pageSizeParam.value = route.params.pageSize ? route.params.pageSize : null
  searchInstitution.value =
    route.params.searchQuery === 'none' || !route.params.searchQuery
      ? null
      : route.params.searchQuery
  statusParam.value =
    route.params.status === 'none' || !route.params.status
      ? null
      : route.params.status.charAt(0).toLowerCase() + route.params.status.slice(1)

  institutionTypeParam.value =
    route.params.institutionType === 'none' || !route.params.institutionType
      ? null
      : route.params.institutionType

  await updateInstition.updateInstition(
    institutionTypeParam.value,
    statusParam.value,
    searchInstitution.value,
    pageCountParam.value,
    pageSizeParam.value
  )
}

const setInstitutionStatusFilter = async () => {
  institutionStatusFilter.value =
    selectedEnabled.value === 'none' || !selectedEnabled.value
      ? null
      : selectedEnabled.value.label.charAt(0).toLowerCase() + selectedEnabled.value.label.slice(1)
  statusParam.value =
    route.params.status === 'none' || !route.params.status
      ? null
      : route.params.status.charAt(0).toLowerCase() + route.params.status.slice(1)
  institutionTypeParam.value =
    route.params.institutionType === 'none' || !route.params.institutionType
      ? null
      : route.params.institutionType
  searchInstitution.value =
    route.params.searchQuery === 'none' || !route.params.searchQuery
      ? null
      : route.params.searchQuery
  await updateInstition.updateInstition(
    institutionTypeParam.value,
    institutionStatusFilter.value,
    searchInstitution.value,
    pageCountParam.value,
    pageSizeParam.value
  )
}
const setSearchQuery = async () => {
  searchData.value = searchQuery.value === 'none' || !searchQuery.value ? null : searchQuery.value
  statusParam.value =
    route.params.status === 'none' || !route.params.status
      ? null
      : route.params.status.charAt(0).toLowerCase() + route.params.status.slice(1)

  institutionTypeParam.value =
    route.params.institutionType === 'none' || !route.params.institutionType
      ? null
      : route.params.institutionType
  await updateInstition.updateInstition(
    institutionTypeFilter.value,
    statusParam.value,
    searchData.value,
    pageCountParam.value,
    pageSizeParam.value
  )
}
const setInstitutionTypeFilter = async () => {
  searchInstitution.value =
    route.params.searchQuery === 'none' || !route.params.searchQuery
      ? null
      : route.params.searchQuery
  institutionTypeFilter.value =
    institutionType.value === 'none' || !institutionType.value
      ? null
      : institutionType.value.institutionType

  statusParam.value =
    route.params.status === 'none' || !route.params.status
      ? null
      : route.params.status.charAt(0).toLowerCase() + route.params.status.slice(1)

  institutionTypeParam.value =
    route.params.institutionType === 'none' || !route.params.institutionType
      ? null
      : route.params.institutionType
  await updateInstition.updateInstition(
    institutionTypeFilter.value,
    statusParam.value,
    searchInstitution.value,
    pageCountParam.value,
    pageSizeParam.value
  )
}

window.addEventListener('resize', updateScreenWidth)

// Filter options for enabled/disabled
//Note: in backend we only have disabled true or false. So, we are using the disabled value for enabled and disabled.
const enabledOptions = [
  { label: 'Enabled', value: false },
  { label: 'Disabled', value: true },
]

// Sort options for name and dateCreated
const nameSortOptions = [
  { label: 'A to Z', value: 'name-asc' },
  { label: 'Z to A', value: 'name-desc' },
]

const dateSortOptions = [
  { label: 'Newest First', value: 'date-desc' },
  { label: 'Oldest First', value: 'date-asc' },
]

const deleteconfirmBtn = (val) => {
  deleteconfirm.value = true
  InsdeleteId.value = val
}

const deleteConfirmed = async () => {
  try {
    const response = await api.post('/api/v1.0/organization/delete/' + InsdeleteId.value)
    if (response.data.success && response.status == 200) {
      UpdateInstitutionStore()
      // if selected institution is deleted, hide the details card
      if (
        selectedInstitution.value &&
        selectedInstitution.value.organizationId === InsdeleteId.value
      ) {
        const message = 'Institution is Deleted successfully.'
        notifyMessage(message, 'positive')
        selectedInstitution.value = null
        setTimeout(() => {
          hideDetailsCard()
        }, 1000)
      }
    } else {
      const msg = 'An error occurred while deleting the institution. Please try again later.'
      notifyMessage(msg)
    }
  } catch {
    const msg = 'An error occurred while deleting the institution. Please try again later.'
    notifyMessage(msg)
    deleteconfirm.value = false
  }

  deleteconfirm.value = false
}
const handleToggle = (institution) => {
  hideNotification()
  openToggleDialog(institution)
}
const openToggleDialog = (institution) => {
  toggleTarget.value = institution
  toggleConfirmDialog.value = true
}

const cancelToggleChange = () => {
  toggleConfirmDialog.value = false
}

const confirmToggleChange = async () => {
  const disable_enable_error = toggleTarget.value.disabled ? 'Disable' : 'Enable'
  try {
    const responce = await api.post('/api/v1.0/organization/status', {
      organizationId: toggleTarget.value.organizationId,
      enabled: toggleTarget.value.disabled,
    })

    if (responce.data.success && responce.status == 200) {
      toggleTarget.value.disabled = responce.data.disabled
      const disable_enable_success = responce.data.disabled ? 'Disabled' : 'Enabled'
      const message = `Institution is ${disable_enable_success} successfully.`
      notifyMessage(message, 'positive')
    } else {
      const msg =
        'An error occurred while ' +
        disable_enable_error +
        ' the institution. Please try again later.'
      notifyMessage(msg)
    }
    toggleConfirmDialog.value = false
  } catch {
    const msg =
      'An error occurred while ' +
      disable_enable_error +
      ' the institution. Please try again later.'
    notifyMessage(msg)
    toggleConfirmDialog.value = false
  }
}

const goToEditInstitution = (institution) => {
  $router.push({
    name: 'update_institutions',
    params: { mode: 'Edit', organizationId: institution.organizationId },
  })
}

const showFilters = () => {
  isFilterActive.value = true
  routeBasedFilter()
}

const routeBasedFilter = () => {
  $router.push({
    name: 'institutions_details',
    params: {
      isFilterActive: isFilterActive.value,
      uniqueName: selected.value.length ? selected.value[0].uniqueName : 'none',
      institutionType: institutionType.value ? institutionType.value.institutionType : 'none',
      status: selectedEnabled.value ? selectedEnabled.value.label : 'none',
      searchQuery: searchQuery.value ? searchQuery.value : '',

      pageSize: updateInstition.pagination.rowsPerPage
        ? updateInstition.pagination.rowsPerPage
        : 'none',
      pageCount: updateInstition.pagination.page ? updateInstition.pagination.page : 'none',
      displayView: displayView.value.label,
      Sortby: selectedCondition.value.value,
    },
  })
}

const removeFilters = () => {
  institutionStatusFilter.value = null
  institutionTypeFilter.value = null
  institutionType.value = null
  selectedEnabled.value = null
  hideFilters()
}

const hideFilters = () => {
  isFilterActive.value = false
  routeBasedFilter()
}

// Create an AbortController to handle potential request cancellation
const API_TIMEOUT = 10000 // 1 minute timeout
const controller = new AbortController() // Create an AbortController instance
const { signal } = controller // Get the signal from the controller
// Set a timeout to abort the request
setTimeout(() => {
  controller.abort() // Abort the request
}, API_TIMEOUT)
const fetchInstitutionTypes = async () => {
  try {
    const response = await api.get('/api/v1.0/organization/types?category=lms', { signal })
    institutionOptions.value = response.data.organizationTypes
      .map((type) => ({
        institutionType: type.organizationType,
        description: type.description,
      }))
      .sort((a, b) => a.institutionType.localeCompare(b.institutionType))
  } catch (error) {
    if (error.response) {
      const errorMsg = 'An error occurred while fetching institution types. Please try again later.'
      notifyMessage(errorMsg)
    } else {
      const errorMsg = 'An error occurred while fetching institution types. Please try again later.'
      notifyMessage(errorMsg)
    }
  }
}
institutions = computed(() => updateInstition.institionList)

// Computed property to filter and search institutions
const filteredInstitutions = computed(() => {
  let result = institutions.value
  if (result) {
    routeBasedFilter()
    return result
  } else {
    return []
  }
})

// Computed property to sort the filtered institutions
const filteredAndSortedInstitutions = computed(() => {
  let result = filteredInstitutions.value

  if (result) {
    const condition = selectedCondition.value?.value?.trim() || ''
    // [FS] LMS-93 Update sort behavior for institution lists

    // Create a shallow copy of the result array to prevent mutation of the original array
    const sortedResult = [...result]
    // const sortedResult = result
    //     .map(item => {
    //         const target = item['[[Target]]'] || item; // Handle Proxy if applicable
    //         return { ...target }; // Shallow copy the object to sortedResul
    //     })
    //     .filter(target =>
    //         Array.isArray(target.userRoles) &&
    //         (target.userRoles.includes('admin') || target.userRoles.includes('owner'))
    //     );
    if (condition === 'Institution Name A-Z') {
      // Sort by organization name (alphabetically A-Z)
      return sortedResult.sort((a, b) =>
        (a.organizationName || '').localeCompare(b.organizationName || '')
      )
    } else if (condition === 'Institution Name Z-A') {
      // Sort by organization name (alphabetically Z-A)
      return sortedResult.sort((a, b) =>
        (b.organizationName || '').localeCompare(a.organizationName || '')
      )
    } else if (condition === 'Enabled') {
      // Sort by enabled status (enabled first), then by organization name alphabetically
      return sortedResult.sort(
        (a, b) => a.disabled - b.disabled || a.organizationName.localeCompare(b.organizationName)
      )
    } else if (condition === 'Disabled') {
      // Sort by disabled status (disabled first), then by organization name alphabetically
      return sortedResult.sort(
        (a, b) => b.disabled - a.disabled || a.organizationName.localeCompare(b.organizationName)
      )
    }

    if (institutionType.value) {
      return result.filter(
        (institution) => institution.organizationType === institutionType.value.institutionType
      )
    }

    // Sort by name
    if (selectedNameSort.value) {
      result = result.slice().sort((a, b) => {
        if (selectedNameSort.value.value === 'name-asc') {
          return a.organizationName.localeCompare(b.organizationName)
        } else if (selectedNameSort.value.value === 'name-desc') {
          return b.organizationName.localeCompare(a.organizationName)
        }
      })
    }

    // Sort by dateCreated
    if (selectedDateSort.value) {
      result = result.slice().sort((a, b) => {
        const aDate = new Date(a.createdDate)
        const bDate = new Date(b.createdDate)

        if (selectedDateSort.value.value === 'date-asc') {
          return aDate - bDate
        } else if (selectedDateSort.value.value === 'date-desc') {
          return bDate - aDate
        }
      })
    }

    return result
  } else {
    return []
  }
})

let dismissNotification = null

const notifyMessage = (message, color_and_type = 'negative', timeout = 0) => {
  dismissNotification = $q.notify({
    type: color_and_type,
    message: message,
    position: 'center',
    timeout: timeout,
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
  hideNotification()
})

const copyToClipboard = (invitationInfo) => {
  const textToCopy = `Hi there! \nAlready registered? Use this link to join:\n ${invitationInfo.joiningLink}\nIf you're new, please register here:\n ${invitationInfo.registrationLink}`
  navigator.clipboard.writeText(textToCopy).then(
    () => {
      const message = 'Invitation link is copied to clipboard.'
      notifyMessage(message, 'positive', 3000)
    },
    () => {
      const message = 'Failed to copy invitation link to clipboard.'
      notifyMessage(message)
    }
  )
}

// Switch between card and table view
const switchView = () => {
  isCardView.value = !isCardView.value
  routeBasedFilter()
}

// Show the selected institution details card
const showRowDetails = async (row) => {
  await fetchRole(row.uniqueName)
  if (getRole.roleStatus === 'Pending') {
    const message =
      'Your account is awaiting approval. Once approved by the admin, you can access the institution.'
    notifyMessage(message, 'positive') // Pass resolve to handle after dismissal
    return
  }
  selected.value = [row]
  showDetailsCard.value = true
  selectedInstitution.value = row
  routeBasedFilter()
}

// Hide the selected institution details card
const hideDetailsCard = () => {
  showDetailsCard.value = false
  selectedInstitution.value = null
  selected.value = []
  routeBasedFilter()
}

const getWebsiteURL = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url // Already a full URL
  } else {
    return 'https://' + url // Prepend "https://" (or "http://" if appropriate)
  }
}
const tooltipClass = computed(() => ($q.dark.isActive ? 'tooltip-dark-mode' : 'tooltip-light-mode'))
onMounted(async () => {
  // await updateInstition.setPagination( route.params.pageSize,route.params.pageCount)

  if (route.name === 'institutions_details') {
    isFilterActive.value = route.params.isFilterActive === 'true'
    selected.value =
      route.params.uniqueName !== 'none' ? [{ uniqueName: route.params.uniqueName }] : []
    institutionType.value =
      route.params.institutionType !== 'none'
        ? { institutionType: route.params.institutionType }
        : null
    selectedEnabled.value = route.params.status !== 'none' ? { label: route.params.status } : null
    searchQuery.value = route.params.searchQuery === '' ? '' : route.params.searchQuery
    updateInstition.pagination.rowsPerPage =
      route.params.pageSize !== 'none' ? route.params.pageSize : ''
    updateInstition.pagination.page =
      route.params.pageCount !== 'none' ? route.params.pageCount : ''

    if (route.params.displayView === 'Table View') {
      displayView.value = { label: 'Table View', value: false }
      isCardView.value = false
    } else {
      displayView.value = { label: 'Card View', value: true }
      isCardView.value = true
    }
    selectedCondition.value = sortList.value.find((item) => item.value === route.params.Sortby)
  }
})
const fetchRole = async (institution) => {
  try {
    const response = await api.post('/api/v1.0/users/getroles', {
      organizationName: institution,
    })
    // Check if 'admin or owner' exists in the roles array and assign it to `role`
    const rolesArray = response.data.roles || []
    const filteredRoles = rolesArray.filter(
      (role) => role === 'Admin' || role === 'Owner' || role === 'Guest'
    )
    // update roles in the store
    getRole.setRoles(filteredRoles)
    const roleStatus = response.data.userApprovalStatus
    getRole.setRoleStatus(roleStatus)
    return rolesArray
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response)
    }
  }
}
onUnmounted(() => {
  updateInstition.clearPagination()
})
</script>

<style>
.input-row {
  display: flex;
}

.flt_srt_btn {
  height: 40px;
}

.active-btn {
  background-color: #26a69a !important;
  color: white !important;
}

.filter-row {
  display: flex;
  justify-content: row;
}

.q-mt-xs-none {
  margin-top: 0px !important;
}

.my-card {
  width: calc(50% - 16px);
  box-sizing: border-box;
}

.institution-link {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

@media (max-width: 768px) {
  .my-card {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .my-card {
    width: 100%;
  }
}

.my-card {
  width: 100%;
  max-width: 350px;
}
.role-chip {
  min-height: 40px;
}
/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
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

.sticky-header-table {
  /* height or max-height is important */
  height: 680px;
  max-height: 680px;
}
.q-table__top,
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #1976d2;
  color: white;
}

thead tr th {
  position: sticky;
  z-index: 1;
}
thead tr:first-child th {
  top: 0;
}

/* this is when the loading indicator appears */
.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}

/* prevent scrolling behind sticky top row on focus */
tbody {
  /* height of all previous header rows */
  scroll-margin-top: 48px;
}

.sticky-header-table-dark {
  /* height or max-height is important */
  height: 680px;
  max-height: 680px;
}
.q-table__top,
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #1d1d1d;
  color: #c0c0c0;
}

thead tr th {
  position: sticky;
  z-index: 1;
}
thead tr:first-child th {
  top: 0;
}

/* this is when the loading indicator appears */
.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}

/* prevent scrolling behind sticky top row on focus */
tbody {
  /* height of all previous header rows */
  scroll-margin-top: 48px;
}

.details-card {
  min-height: 680px;
  max-height: 680px;
}
.text-color {
  color: #44546f;
}
.text-light {
  color: #44546f !important;
}
.text-dark {
  color: #c0c0c0 !important;
}
.sticky-header-table .selected {
  background-color: #e1f1ff !important;
}

.sticky-header-table-dark .selected {
  background-color: #37474f !important;
  color: #c0c0c0 !important;
}
.cards-container {
  width: 100%;
}
.organization-label {
  max-width: 100px; /* Adjust as needed */
}
.organization-labels {
  max-width: 600px; /* Adjust as needed */
}
.tooltip-dark-mode {
  background-color: #2b2e31 !important;
  color: rgb(255, 255, 255) !important;
  font-size: 16px !important; /* Adjust font size as needed */
  box-shadow: var(--q-shadow-10); /* Optional for consistent styling */
  margin-left: 10px; /* Adjust left margin as needed */
}
.tooltip-light-mode {
  background-color: #6c7580 !important;
  color: rgb(255, 251, 251) !important;
  font-size: 16px !important; /* Adjust font size as needed */
  box-shadow: var(--q-shadow-10); /* Optional for consistent styling */
  margin-left: 10px; /* Adjust left margin as needed */
}
</style>
