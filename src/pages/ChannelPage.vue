<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-xs full-page-height">
      <div class="col-3 full-height-card">
        <q-card class="full-height">
          <q-card-section>
            <div class="text-h6">Channels</div>
          </q-card-section>
          <q-separator />
          <q-scroll-area
            class="channel-scroll-area"
            :thumb-style="thumbStyle"
            :bar-style="barStyle"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                v-for="channel in channels"
                :key="channel.id"
                :active="selectedChannel && selectedChannel.id === channel.id"
                active-class="bg-primary text-white"
                @click="selectChannel(channel)"
              >
                <q-item-section avatar>
                  <q-avatar :color="channel.avatarColor" text-color="white">
                    {{ getAvatarText(channel.name) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ channel.name }}</q-item-label>
                  <q-item-label caption>{{ channel.lastMessage }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card>
      </div>
      <div class="col-9 full-height-card">
        <q-card class="full-height">
          <q-card-section class="bg-grey-2">
            <div v-if="selectedChannel" class="text-h6">{{ selectedChannel.name }}</div>
            <div v-else class="text-h6">Select a channel to start chatting</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <q-scroll-area
              class="message-scroll-area"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <div
                v-for="message in messages"
                :key="message.id"
                :class="[
                  'q-pa-md',
                  'row',
                  message.sender === 'me' ? 'justify-end' : 'justify-start',
                ]"
              >
                <q-avatar
                  v-if="message.sender !== 'me'"
                  class="q-mr-sm"
                  :color="getAvatarColor(message.sender)"
                  text-color="white"
                >
                  {{ getAvatarText(message.sender) }}
                </q-avatar>
                <q-chip
                  :color="message.sender === 'me' ? 'secondary' : getAvatarColor(message.sender)"
                  text-color="white"
                >
                  {{ message.text }}
                </q-chip>
                <q-avatar
                  v-if="message.sender === 'me'"
                  class="q-ml-sm"
                  color="secondary"
                  text-color="white"
                >
                  {{ getAvatarText('me') }}
                </q-avatar>
              </div>
            </q-scroll-area>
          </q-card-section>
          <q-separator />
          <q-card-section class="row items-center">
            <q-input
              v-model="newMessage"
              outlined
              placeholder="Type your message"
              class="col"
              @keyup.enter="sendMessage"
            >
              <template v-slot:append>
                <q-btn round dense flat icon="send" @click="sendMessage" />
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { uid } from 'quasar'

const thumbStyle = {
  right: '3px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: 0.75,
}

const barStyle = {
  right: '2px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: 0,
}

const channels = ref([
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
  {
    id: uid(),
    name: 'General',
    lastMessage: 'Welcome to the channel!',
    avatarColor: 'primary',
  },
  {
    id: uid(),
    name: 'Project Alpha',
    lastMessage: 'Meeting tomorrow',
    avatarColor: 'secondary',
  },
  {
    id: uid(),
    name: 'Team Bravo',
    lastMessage: 'Great work everyone!',
    avatarColor: 'accent',
  },
])

const selectedChannel = ref(null)
const messages = ref([])
const newMessage = ref('')

const getAvatarText = (name) => {
  if (name === 'me') return 'M'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
  }
  return name.charAt(0).toUpperCase()
}

const getAvatarColor = (name) => {
  if (name === 'me') return 'secondary'
  const channel = channels.value.find((c) => c.name === name)
  return channel ? channel.avatarColor : 'primary'
}

const selectChannel = (channel) => {
  selectedChannel.value = channel
  messages.value = [
    { id: uid(), sender: 'me', text: 'Hi everyone!' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'John Doe', text: 'Hello!', color: 'primary' },
    { id: uid(), sender: 'Jane Smith', text: 'Hi there!', color: 'secondary' },
    { id: uid(), sender: 'Peter Jones', text: 'Hey!', color: 'accent' },
    { id: uid(), sender: 'me', text: 'Hi everyone!' },
  ]
}

selectChannel(channels.value[0])

const sendMessage = () => {
  if (newMessage.value.trim() === '') return
  messages.value.push({ id: uid(), sender: 'me', text: newMessage.value, color: 'secondary' })
  newMessage.value = ''
}
</script>

<style scoped>
.full-page-height {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
}

.full-height-card {
  display: flex;
  flex-direction: column;
}

.channel-scroll-area {
  height: calc(100vh - 160px);
  max-height: calc(100vh - 160px);
}

.message-scroll-area {
  height: calc(100vh - 220px);
  max-height: calc(100vh - 220px);
}

.text-white .q-item__label--caption {
  color: white;
}
</style>
