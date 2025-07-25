<template>
  <q-page padding>
    <!-- HEADER ROW -->
    <div class="row items-center justify-between q-mb-md">
      <!-- Left: Search Box -->
      <q-input
        v-model="searchQuery"
        placeholder="Search users..."
        outlined
        dense
        clearable
        class="search-box"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Right: Add User & Sort By -->
      <div class="row items-center q-gutter-md">
        <q-btn color="primary" label="Add User" icon="add">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                v-for="role in roles"
                :key="role"
                clickable
                v-close-popup
                @click="openAddUserDialog(role)"
              >
                <q-item-section>Add {{ role }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Sort By -->
        <div class="row items-center">
          <label class="text-bold q-mr-xs text-primary">SORT BY:</label>
          <q-select
            v-model="selectedCondition"
            :options="sortList"
            option-label="label"
            option-value="value"
            borderless
            dense
          />
        </div>
      </div>
    </div>

    <q-separator class="q-mb-md" />

    <!-- USERS TABLE -->
    <q-table
      :rows="users"
      row-key="id"
      :columns="columns"
      class="my-sticky-virtscroll-table"
      virtual-scroll
      :virtual-scroll-item-size="48"
    >
      <!-- Make Email Clickable -->
      <template v-slot:body-cell-email="props">
        <q-td :props="props">
          <span class="text-primary cursor-pointer" @click="goToProfileInfo(props.row.email)">
            {{ props.row.email }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            color="primary"
            icon="edit"
            @click="goToEditUser(props.row.id)"
            class="q-mr-sm"
          >
            <q-tooltip>Edit User</q-tooltip>
          </q-btn>
          <q-btn flat color="negative" icon="delete" @click="confirmDelete(props.row.id)">
            <q-tooltip>Delete User</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon name="sentiment_dissatisfied" size="2em" />
          <span>No users found</span>
        </div>
      </template>
    </q-table>

    <!-- ADD USER DIALOG -->
    <q-dialog v-model="showAddUserDialog" persistent>
      <q-card style="width: 450px">
        <q-card-section>
          <div class="text-h6">Add New Users</div>
        </q-card-section>

        <q-card-section>
          <!-- Multi-email Input -->
          <q-select
            v-model="model"
            :options="options"
            label="Enter emails"
            multiple
            use-input
            use-chips
            clearable
            hide-dropdown-icon
            input-debounce="0"
            @new-value="validateAndAddEmail"
          >
            <template v-slot:selected-item="scope">
              <q-chip
                removable
                @remove="removeEmail(scope.index)"
                color="primary"
                text-color="white"
              >
                {{ scope.opt }}
              </q-chip>
            </template>
          </q-select>

          <!-- Email Validation Error -->
          <div v-if="emailError" class="text-negative text-caption q-mt-sm">
            {{ emailErrorMessage }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="handleCancel" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="validateAndAddUsers" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()
const showAddUserDialog = ref(false)
const searchQuery = ref('')
const selectedRole = ref('')

const users = ref([
  { id: 1, email: 'john@example.com', role: 'Instructor' },
  { id: 2, email: 'john@example.com', role: 'Student' },
  { id: 3, email: 'alice@example.com', role: 'Instructor' },
])

const columns = [
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  { name: 'role', label: 'Role', field: 'role', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', align: 'right' },
]

const roles = ref(['Admin', 'Instructor', 'Student'])

const model = ref([])
const options = []
const newUsers = ref([])
const emailError = ref(false)
const emailErrorMessage = ref('')
const sortList = ref([])

sortList.value.push(
  { label: 'User Name A-Z', value: 'User Name A-Z' },
  { label: 'User Name Z-A', value: 'User Name Z-A' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Instructor', value: 'Instructor' },
  { label: 'Student', value: 'Student' }
)
const selectedCondition = ref(sortList.value[0])

// Open dialog with predefined role
const openAddUserDialog = (role) => {
  selectedRole.value = role
  model.value = []
  newUsers.value = []
  emailError.value = false
  emailErrorMessage.value = ''
  showAddUserDialog.value = true
}

const handleCancel = () => {
  model.value = []
  newUsers.value = []
  emailError.value = false
  emailErrorMessage.value = ''
  showAddUserDialog.value = false
}

const goToProfileInfo = (email) => {
  $router.push({
    name: 'profileInfo',
    query: { email },
  })
}

// Validate and Add Email
const validateAndAddEmail = (value, doneFn) => {
  if (!value || typeof value !== 'string' || !value.trim()) return

  const email = value.trim().toLowerCase()

  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    emailError.value = true
    emailErrorMessage.value = `Invalid email: ${email}`
    return
  }

  // Check if email is already in the list
  if (model.value.includes(email)) {
    emailError.value = true
    emailErrorMessage.value = `Duplicate email: ${email}`
    return
  }
  // Add valid email to the list
  model.value = [...model.value, email]
  newUsers.value.push({
    email,
    roles: [],
    roleError: false,
    roleErrorMessage: '',
  })

  if (doneFn) {
    doneFn('')
  }
  // Reset error state
  emailError.value = false
  emailErrorMessage.value = ''

  // Clear input field after entering email
  if (doneFn) doneFn(email)
}

// Remove a specific email
const removeEmail = (index) => {
  const removedEmail = model.value[index]
  model.value.splice(index, 1)
  newUsers.value = newUsers.value.filter((user) => user.email !== removedEmail)
}
// Validate and Add Users
const validateAndAddUsers = () => {
  if (!selectedRole.value) {
    alert('Error: No role selected!')
    return
  }

  newUsers.value.forEach((user) => {
    users.value.push({
      id: users.value.length + 1,
      email: user.email,
      role: selectedRole.value,
    })
  })

  // Reset & Close Dialog
  newUsers.value = []
  model.value = []
  showAddUserDialog.value = false
}

const goToEditUser = (userId) => {
  const user = users.value.find((u) => u.id === userId)
  if (!user) return

  // Find all roles associated with the same email
  const userRoles = users.value
    .filter((u) => u.email === user.email) // Find users with the same email
    .map((u) => u.role) // Extract roles

  $router.push({
    name: 'editUserPage',
    query: {
      email: user.email,
      roles: JSON.stringify(userRoles), // Convert roles array to string
    },
  })
}

const confirmDelete = (userId) => {
  users.value = users.value.filter((user) => user.id !== userId)
}
</script>

<style scoped>
.search-box {
  width: 100%;
  max-width: 300px;
}
</style>
