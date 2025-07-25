<template>
  <div class="q-pa-md" style="width: 100%">
    <div style="font-size: 24px">Users</div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      @update:model-value="onTabChange"
    >
      <q-tab no-caps name="all" label="All" />
      <q-tab no-caps name="pending" label="Pending" />
      <q-tab no-caps name="approved" label="Approved" />
      <q-tab no-caps name="rejected" label="Rejected" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="all">
        <div class="q-pa-md">
          <q-table
            :rows="user"
            :columns="allUserColumnHeader"
            row-key="name"
            :loading="allUserLoader"
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:loading>
              <div class="q-pa-md text-center">
                <q-spinner color="primary" size="50px" />
                <div class="text-grey-7 q-mt-sm">Loading all user data...</div>
              </div>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                <q-td key="status" :props="props">
                  <q-chip
                    :color="getChipColor(props.row.status)"
                    :label="props.row.status"
                    class="text-white"
                  />
                </q-td>
                <q-td key="disabled" :props="props">{{
                  props.row.disabled ? 'Disabled' : 'Enabled'
                }}</q-td>
                <q-td key="rejectedCount" :props="props">{{ props.row.rejectedCount }}</q-td>
                <q-td key="rejectedReason" :props="props">{{
                  props.row.rejectedReason || 'N/A'
                }}</q-td>
              </q-tr>
            </template>
            <template v-slot:no-data>
              <div class="row text-Left q-pa-sm no-wrap">
                <div class="row items-center q-mr-sm">
                  <q-icon name="group_off" size="sm" color="warning" />
                </div>
                <q-item-section>
                  <q-item-label>No users found</q-item-label>
                </q-item-section>
              </div>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <q-tab-panel name="pending">
        <div class="q-pa-md">
          <q-table
            :rows="pendingUserRow"
            :columns="pendingUserColumnHeader"
            row-key="name"
            :loading="pendingUserLoader"
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:loading>
              <div class="q-pa-md text-center">
                <q-spinner color="primary" size="50px" />
                <div class="text-grey-7 q-mt-sm">Loading pending user data...</div>
              </div>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                <q-td key="status" :props="props">
                  <q-chip
                    :color="getChipColor(props.row.status)"
                    :label="props.row.status"
                    class="text-white"
                  />
                </q-td>
                <q-td key="disabled" :props="props">{{
                  props.row.disabled ? 'Disabled' : 'Enabled'
                }}</q-td>
                <q-td key="rejectedCount" :props="props">{{ props.row.rejectedCount }}</q-td>
                <q-td key="rejectedReason" :props="props">{{
                  props.row.rejectedReason || 'N/A'
                }}</q-td>
                <q-td key="action" :props="props">
                  <q-btn label="Approve" no-caps color="green" @click="onApprove(props.row)" />
                  <q-dialog v-model="approveconfirm" persistent>
                    <q-card>
                      <q-card-section class="row items-center">
                        <span class="q-ml-sm">Are you sure you want to approve this user?</span>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" v-close-popup />
                        <q-btn
                          flat
                          label="Confirm"
                          color="primary"
                          v-close-popup
                          @click="approvedConfirmed('pending')"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                  <q-btn
                    label="Reject"
                    no-caps
                    color="red"
                    style="margin-left: 10px"
                    @click="onDisApprove(props.row)"
                  />
                  <q-dialog v-model="disApproveconfirm" persistent>
                    <q-card>
                      <q-card-section class="row items-center">
                        <span class="q-ml-sm">Are you sure you want to Reject this user?</span>
                      </q-card-section>
                      <q-card-section>
                        <q-input
                          v-model="disapproveComment"
                          label="Reason for Reject"
                          filled
                          type="textarea"
                          maxlength="500"
                          placeholder="Please provide a reason..."
                          autogrow
                          :error="!!commentError"
                          :error-message="commentError"
                        />
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" @click="disApprovedCancel" />
                        <q-btn
                          flat
                          label="Confirm"
                          color="primary"
                          @click="disApprovedConfirmed('pending')"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-td>
              </q-tr>
            </template>

            <template v-slot:no-data>
              <div class="row text-Left q-pa-sm no-wrap">
                <div class="row items-center q-mr-sm">
                  <q-icon name="group_off" size="sm" color="warning" />
                </div>
                <q-item-section>
                  <q-item-label>No users found</q-item-label>
                </q-item-section>
              </div>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <q-tab-panel name="approved">
        <div class="q-pa-md">
          <q-table
            :rows="approvedUsers"
            :columns="pendingUserColumnHeader"
            row-key="name"
            :loading="approvedUserLoader"
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:loading>
              <div class="q-pa-md text-center">
                <q-spinner color="primary" size="50px" />
                <div class="text-grey-7 q-mt-sm">Loading approved user data...</div>
              </div>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                <q-td key="status" :props="props">
                  <q-chip
                    :color="getChipColor(props.row.status)"
                    :label="props.row.status"
                    class="text-white"
                  />
                </q-td>
                <q-td key="disabled" :props="props">{{
                  props.row.disabled ? 'Disabled' : 'Enabled'
                }}</q-td>
                <q-td key="rejectedCount" :props="props">{{ props.row.rejectedCount }}</q-td>
                <q-td key="rejectedReason" :props="props">{{
                  props.row.rejectedReason || 'N/A'
                }}</q-td>
                <q-td key="action" :props="props">
                  <q-btn
                    :label="props.row.disabled ? 'Enable' : 'Disable'"
                    no-caps
                    :color="props.row.disabled ? 'teal-6' : 'blue-grey'"
                    @click="toggleDisable(props.row)"
                  />
                  <q-dialog v-model="disableConfirmDialog" persistent>
                    <q-card>
                      <q-card-section class="row items-center">
                        <span class="q-ml-sm"
                          >Are you sure you want to
                          {{ userSelectedRow.disabled ? 'Enable' : 'Disable' }}
                          this user?</span
                        >
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" v-close-popup />
                        <q-btn
                          flat
                          label="Confirm"
                          color="primary"
                          @click="confirmToggleDisable('Approved')"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:no-data>
              <div class="row text-Left q-pa-sm no-wrap">
                <div class="row items-center q-mr-sm">
                  <q-icon name="group_off" size="sm" color="warning" />
                </div>
                <q-item-section>
                  <q-item-label>No users found</q-item-label>
                </q-item-section>
              </div>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <q-tab-panel name="rejected">
        <div class="q-pa-md">
          <q-table
            :rows="rejectedUsers"
            :columns="pendingUserColumnHeader"
            row-key="name"
            :loading="rejectedUserLoader"
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:loading>
              <div class="q-pa-md text-center">
                <q-spinner color="primary" size="50px" />
                <div class="text-grey-7 q-mt-sm">Loading rejected user data...</div>
              </div>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                <q-td key="status" :props="props">
                  <q-chip
                    :color="getChipColor(props.row.status)"
                    :label="props.row.status"
                    class="text-white"
                  />
                </q-td>
                <q-td key="disabled" :props="props">{{
                  props.row.disabled ? 'Disabled' : 'Enabled'
                }}</q-td>
                <q-td key="rejectedCount" :props="props">{{ props.row.rejectedCount }}</q-td>
                <q-td key="rejectedReason" :props="props">{{
                  props.row.rejectedReason || 'N/A'
                }}</q-td>
                <q-td key="action" :props="props">
                  <q-btn label="Approve" no-caps color="green" @click="onApprove(props.row)" />
                  <q-dialog v-model="approveconfirm" persistent>
                    <q-card>
                      <q-card-section class="row items-center">
                        <span class="q-ml-sm">Are you sure you want to approve this user?</span>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" v-close-popup />
                        <q-btn
                          flat
                          label="Confirm"
                          color="primary"
                          v-close-popup
                          @click="approvedConfirmed('reject')"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                  <q-btn
                    v-if="!props.row.disabled"
                    label="Disable"
                    no-caps
                    color="blue-grey"
                    @click="toggleDisable(props.row)"
                    style="margin-left: 10px"
                  />
                  <q-dialog v-model="disableConfirmDialog" persistent>
                    <q-card>
                      <q-card-section class="row items-center">
                        <span class="q-ml-sm">Are you sure you want to Disable this user?</span>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" v-close-popup />
                        <q-btn
                          flat
                          label="Confirm"
                          color="primary"
                          @click="confirmToggleDisable('Rejected')"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:no-data>
              <div class="row text-Left q-pa-sm no-wrap">
                <div class="row items-center q-mr-sm">
                  <q-icon name="group_off" size="sm" color="warning" />
                </div>
                <q-item-section>
                  <q-item-label>No users found</q-item-label>
                </q-item-section>
              </div>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'

const approveconfirm = ref(false)
const disApproveconfirm = ref(false)
const disapproveComment = ref('')

const userSelectedRow = ref({})
const tab = ref('')
const $route = useRoute()
const $router = useRouter()
const disableConfirmDialog = ref(false)
const allUserLoader = ref(false)
const pendingUserLoader = ref(false)
const approvedUserLoader = ref(false)
const rejectedUserLoader = ref(false)
const allUserColumnHeader = ref([
  { name: 'email', align: 'left', label: 'Email' },
  { name: 'status', align: 'center', label: 'Status' },
  { name: 'disabled', align: 'center', label: 'Disabled/Enabled' },
  { name: 'rejectedCount', align: 'center', label: 'Rejected Count' },
  { name: 'rejectedReason', align: 'left', label: 'Rejected Reason' },
])
const user = ref([])
const pendingUserColumnHeader = ref([
  { name: 'email', align: 'left', label: 'Email' },
  { name: 'status', align: 'center', label: 'Status' },
  { name: 'disabled', align: 'center', label: 'Disabled/Enabled' },
  { name: 'rejectedCount', align: 'center', label: 'Rejected Count' },
  { name: 'rejectedReason', align: 'left', label: 'Rejected Reason' },
  { name: 'action', align: 'center', label: 'Action' },
])

const pendingUserRow = ref([])
const approvedUsers = ref([])
const rejectedUsers = ref([])

const getChipColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'green'
    case 'Pending':
      return 'blue'
    case 'Rejected':
      return 'red'
    default:
      return 'grey'
  }
}

onMounted(() => {
  reviewStatus()
})

const reviewStatus = () => {
  const routeTab = $route.params
  if (routeTab.reviewStatus === 'All') {
    tab.value = 'all'
    getAllUser()
  } else if (routeTab.reviewStatus === 'Pending') {
    tab.value = 'pending'
    getUserPending()
  } else if (routeTab.reviewStatus === 'Approved') {
    tab.value = 'approved'
    getApprovedUser()
  } else if (routeTab.reviewStatus === 'Rejected') {
    tab.value = 'rejected'
    getRejectedUser()
  } else {
    tab.value = 'all'
    getAllUser()
  }
}
const getAllUser = async () => {
  allUserLoader.value = true
  try {
    const response = await api.get(
      '/api/v1.0/organization/' + $route.params.uniqueName + '/users?status=All'
    )

    if (response.status == 200) {
      user.value = response.data.users
      allUserLoader.value = false
    } else {
      console.error('An error occurred while getting all user details. Please try again later.')
      allUserLoader.value = false
    }
  } catch (error) {
    console.error(
      'An error occurred while getting all user details. Please try again later.',
      error
    )
    allUserLoader.value = false
  }
}

const getApprovedUser = async () => {
  approvedUserLoader.value = true
  try {
    const response = await api.get(
      '/api/v1.0/organization/' + $route.params.uniqueName + '/users?status=Approved'
    )

    if (response.status == 200) {
      approvedUsers.value = response.data.users
      approvedUserLoader.value = false
    } else {
      console.error(
        'An error occurred while getting approved user details. Please try again later.'
      )
      approvedUserLoader.value = false
    }
  } catch (error) {
    console.error(
      'An error occurred while getting approved user details. Please try again later.',
      error
    )
    approvedUserLoader.value = false
  }
}

const getRejectedUser = async () => {
  rejectedUserLoader.value = true
  try {
    const response = await api.get(
      '/api/v1.0/organization/' + $route.params.uniqueName + '/users?status=Rejected'
    )

    if (response.status == 200) {
      rejectedUsers.value = response.data.users
      rejectedUserLoader.value = false
    } else {
      console.error(
        'An error occurred while getting Rejected user details. Please try again later.'
      )
      rejectedUserLoader.value = false
    }
  } catch (error) {
    console.error(
      'An error occurred while getting Rejected user details. Please try again later.',
      error
    )
    rejectedUserLoader.value = false
  }
}

const getUserPending = async () => {
  pendingUserLoader.value = true
  try {
    const response = await api.get(
      '/api/v1.0/organization/' + $route.params.uniqueName + '/users?status=Pending'
    )

    if (response.status == 200) {
      pendingUserRow.value = response.data.users
      pendingUserLoader.value = false
    } else {
      console.error('An error occurred while getting pending user details. Please try again later.')
      pendingUserLoader.value = false
    }
  } catch (error) {
    console.error(
      'An error occurred while getting pending user details. Please try again later.',
      error
    )
    pendingUserLoader.value = false
  }
}

const Rejectuser = async (rejectCon) => {
  try {
    const response = await api.put(
      '/api/v1.0/organization/' +
        $route.params.uniqueName +
        '/users/' +
        userSelectedRow.value.userId +
        '/status',
      { approvalStatus: 'Rejected', rejectedReason: disapproveComment.value }
    )

    if (response.status == 200) {
      if (rejectCon == 'pending') {
        getUserPending()
      } else if (rejectCon == 'approve') {
        getApprovedUser()
      }
    } else {
      console.error('An error occurred while Reject user. Please try again later.')
    }
  } catch (error) {
    console.error('An error occurred while Reject user. Please try again later.', error)
  }
  disapproveComment.value = ''
}

const Approveuser = async (pageLoadCondition) => {
  try {
    const response = await api.put(
      '/api/v1.0/organization/' +
        $route.params.uniqueName +
        '/users/' +
        userSelectedRow.value.userId +
        '/status',
      { approvalStatus: 'Approved' }
    )

    if (response.status == 200) {
      if (pageLoadCondition === 'pending') {
        getUserPending()
      } else if (pageLoadCondition === 'reject') {
        getRejectedUser()
      }
    } else {
      console.error('An error occurred while Approved user. Please try again later.')
    }
  } catch (error) {
    console.error('An error occurred while Approved user. Please try again later.', error)
  }
}

const onTabChange = (newTab) => {
  performActionBasedOnTab(newTab)
}
const performActionBasedOnTab = (tabName) => {
  if (tabName === 'all') {
    routeTab('All')
    getAllUser()
  } else if (tabName === 'pending') {
    routeTab('Pending')
    getUserPending()
  } else if (tabName === 'approved') {
    routeTab('Approved')
    getApprovedUser()
  } else if (tabName === 'rejected') {
    routeTab('Rejected')
    getRejectedUser()
  } else {
    routeTab('All')
    getAllUser()
  }
}

const routeTab = (tabName) => {
  $router.push({
    name: 'userPage',
    params: {
      uniqueName: $route.params.uniqueName,
      user: 'users',
      reviewStatus: tabName,
    },
  })
}

const onApprove = (row) => {
  userSelectedRow.value = row
  approveconfirm.value = true
}
const approvedConfirmed = (pageLoadvalue) => {
  approveconfirm.value = false
  Approveuser(pageLoadvalue)
}
const onDisApprove = (row) => {
  userSelectedRow.value = row
  disApproveconfirm.value = true
}

const showError = ref(false) // Track whether to show the error message
const commentError = computed(() => {
  if (showError.value && disapproveComment.value.trim() === '') {
    return 'Please provide a reason for rejection'
  }
  return ''
})
const disApprovedConfirmed = (rejectCondition) => {
  showError.value = true // Enable error display when the button is clicked

  if (!disapproveComment.value.trim()) {
    return // Prevent further execution if the input is invalid
  }
  // Clear error and proceed
  showError.value = false
  disApproveconfirm.value = false
  Rejectuser(rejectCondition)
}

const disApprovedCancel = () => {
  disApproveconfirm.value = false
  disapproveComment.value = ''
  showError.value = false
}
const toggleDisable = (row) => {
  userSelectedRow.value = row
  disableConfirmDialog.value = true
}
const confirmToggleDisable = async (tabStatus) => {
  const userUpdateStatus = {
    approvalStatus: tabStatus,
    rejectedReason: userSelectedRow.value.rejectedReason
      ? userSelectedRow.value.rejectedReason
      : '',
    disabled: !userSelectedRow.value.disabled,
  }
  try {
    const response = await api.put(
      '/api/v1.0/organization/' +
        $route.params.uniqueName +
        '/users/' +
        userSelectedRow.value.userId +
        '/status',
      userUpdateStatus
    )

    if (response.status == 200) {
      if (tabStatus === 'Approved') {
        getApprovedUser()
      } else {
        getRejectedUser()
      }
    } else {
      console.error('An error occurred while user status. Please try again later.')
    }
  } catch (error) {
    console.error('An error occurred while user status. Please try again later.', error)
  }
  disableConfirmDialog.value = false
}
</script>
