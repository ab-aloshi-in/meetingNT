<template>
  <PublicLayout>
    <q-page
      class="column items-center justify-center"
      :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-grey-1'"
    >
      <div class="text-center">
        <div class="text-h2 q-mb-sm">MeetingNT</div>
      </div>
    </q-page>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from 'src/layouts/PublicLayout.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>
