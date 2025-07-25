<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="edit-user-card">
      <q-card-section>
        <div class="text-h6">Edit User</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Email Label -->
        <div class="q-mb-md">
          <span class="text-bold">Email:</span>
          <span class="q-ml-sm">{{ user.email }}</span>
        </div>

        <!-- Roles Selection -->
        <div class="row items-center">
          <span class="text-bold">Role:</span>
          <q-option-group
            v-model="selectedRole"
            :options="roles"
            type="checkbox"
            inline
            class="q-ml-sm"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="Save" @click="updateUser" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const user = ref({ email: '', role: '' })
const selectedRole = ref([])
const roles = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Instructor', value: 'Instructor' },
  { label: 'Student', value: 'Student' },
]

onMounted(() => {
  user.value.email = route.query.email || ''

  // Parse and assign multiple roles
  if (route.query.roles) {
    try {
      selectedRole.value = JSON.parse(route.query.roles)
    } catch (e) {
      console.error('Failed to parse roles:', e)
      selectedRole.value = [route.query.roles] // fallback
    }
  } else {
    selectedRole.value = []
  }
})

const updateUser = () => {
  console.log('Updated User:', user.value.email, selectedRole.value)
  router.push(`create_user`)
}
</script>

<style scoped>
.edit-user-card {
  width: 400px;
  padding: 16px;
}
</style>
