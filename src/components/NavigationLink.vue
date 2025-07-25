<template>
  <q-item :to="props.link" clickable :class="{ 'active-link': isActive }" exact>
    <q-item-section v-if="props.icon" avatar style="align-items: center">
      <q-icon :name="props.icon" :title="props.title" />
      <span class="title-under-icon">{{ props.title }}</span>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },
})

const route = useRoute()

const isActive = computed(() => {
  return route.path === props.link
})
</script>

<style lang="scss" scoped>
.title-under-icon {
  display: none;
}

.q-drawer--mini .title-under-icon {
  display: inline;
}

.active-link {
  background-color: #e0e0e0; /* Example: Light gray background */
  font-weight: bold;
}
</style>
