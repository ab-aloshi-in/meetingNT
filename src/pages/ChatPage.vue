<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-xs full-page-height">
      <!-- Left Side: Contact List [Start] -->
      <div class="col-3 full-height-card">
        <q-card class="full-height">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">Chat</div>
              <div class="row items-center">
                <q-btn flat dense round icon="videocam" @click="onMeetNow" class="q-ml-sm">
                  <q-tooltip>Meet Now</q-tooltip>
                </q-btn>
                <q-btn flat dense round icon="add_comment" @click="onStartNewChat" class="q-ml-sm">
                  <q-tooltip>Start New Chat</q-tooltip>
                </q-btn>
                <q-menu
                  v-model="showUserSearch"
                  anchor="bottom right"
                  self="top right"
                  :offset="[0, 8]"
                  :persistent="true"
                  :no-parent-event="true"
                  @hide="resetUserSearch"
                >
                  <div style="min-width: 220px; padding: 8px 12px">
                    <q-input
                      ref="userSearchInput"
                      v-model="userSearchText"
                      dense
                      outlined
                      placeholder="Search users..."
                      autofocus
                      @blur="onUserSearchBlur"
                      @keyup.esc="showUserSearch = false"
                      @keyup.enter="selectFirstUser"
                    />
                    <q-list v-if="filteredUserList.length">
                      <q-item
                        v-for="user in filteredUserList"
                        :key="user.id"
                        clickable
                        @click="selectUser(user)"
                      >
                        <q-item-section avatar>
                          <q-avatar color="primary" text-color="white">{{
                            user.initials
                          }}</q-avatar>
                        </q-item-section>
                        <q-item-section>{{ user.name }}</q-item-section>
                      </q-item>
                    </q-list>
                    <div v-else class="text-caption text-grey q-mt-sm">No users found</div>
                  </div>
                </q-menu>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <!-- Filter Input [Start] -->
          <q-card-section class="q-pa-sm">
            <div class="row items-center">
              <q-input
                v-model="filterText"
                outlined
                dense
                placeholder="Filter contacts"
                class="col"
                clearable
                @update:model-value="onFilterTextChange"
              >
                <template v-slot:prepend>
                  <q-chip
                    v-if="showUnreadOnly"
                    removable
                    color="primary"
                    text-color="white"
                    class="q-mr-sm"
                    @remove="toggleUnreadFilter"
                  >
                    Unread
                  </q-chip>
                </template>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn
                flat
                dense
                round
                icon="mark_chat_unread"
                class="q-ml-sm"
                :color="showUnreadOnly ? 'primary' : 'default'"
                @click="toggleUnreadFilter"
              >
                <q-tooltip>
                  {{ showUnreadOnly ? 'Show All' : 'Show Unread' }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          <!-- Filter Input [End] -->

          <q-scroll-area
            class="contact-scroll-area"
            :thumb-style="thumbStyle"
            :bar-style="barStyle"
          >
            <q-list>
              <q-item
                clickable
                v-ripple
                v-for="contact in filteredRecentChats"
                :key="contact.id"
                :active="selectedContact && selectedContact.id === contact.id"
                active-class="bg-primary text-white"
                @click="selectContact(contact)"
              >
                <q-item-section avatar>
                  <q-avatar :color="contact.avatarColor" text-color="white">
                    {{
                      contact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label :class="{ 'text-weight-bold': contact.unread }">
                    {{ contact.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ contact.lastMessage }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge
                    v-if="contact.unread"
                    color="red"
                    text-color="white"
                    rounded
                    class="q-mr-sm"
                  >
                    New
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card>
      </div>
      <!-- Left Side: Contact List [End] -->

      <!-- Right Side: Chat Area [Start] -->
      <div class="col-9 full-height-card bg-white">
        <q-card class="full-height bg-white">
          <div v-if="!selectedContact" class="full-height full-width flex flex-center">
            <div class="text-h5 text-grey-7">Start a conversation</div>
          </div>
          <div v-else>
            <q-card-section class="bg-grey-2">
              <div class="row items-center">
                <div class="text-h6 col">{{ selectedContact.name }}</div>
                <q-input
                  v-model="messageSearchText"
                  outlined
                  dense
                  placeholder="Search messages"
                  class="col-4"
                  clearable
                  @update:model-value="onMessageSearchTextChange"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <!-- Filter Button for Bookmarked Messages [Start] -->
                <q-btn
                  flat
                  dense
                  round
                  :icon="showBookmarkedOnly ? 'bookmark' : 'bookmark_border'"
                  class="q-ml-sm"
                  :color="showBookmarkedOnly ? 'primary' : 'default'"
                  @click="toggleBookmarkedFilter"
                >
                  <q-tooltip>
                    {{ showBookmarkedOnly ? 'Show All' : 'Show Bookmarked' }}
                  </q-tooltip>
                </q-btn>
                <!-- Filter Button for Bookmarked Messages [End] -->
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <q-scroll-area
                ref="messageScrollArea"
                class="message-scroll-area"
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
              >
                <div
                  v-if="
                    messagesByUser[selectedContact.id] && messagesByUser[selectedContact.id].length
                  "
                >
                  <div
                    v-for="msg in messagesByUser[selectedContact.id]"
                    :key="msg.id"
                    class="row items-start q-pt-md q-px-md message-container"
                  >
                    <q-avatar class="q-mr-sm" color="primary" text-color="white" size="md">
                      {{
                        msg.sender === 'me'
                          ? 'M'
                          : selectedContact.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                      }}
                    </q-avatar>
                    <div>
                      <div class="text-subtitle2">{{ msg.sender }}</div>
                      <div class="message-time text-caption text-grey">
                        {{ new Date(msg.timestamp).toLocaleTimeString() }}
                      </div>
                      <div
                        class="markdown-container q-pa-xs"
                        v-html="renderMarkdown(msg.text)"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-grey q-pa-md">No messages yet. Start the conversation!</div>
              </q-scroll-area>
            </q-card-section>
            <q-separator />
            <q-card-section class="message-input-container column items-center absolute-bottom">
              <q-dialog
                v-model="showMentionMenu"
                :offset="[0, 10]"
                anchor="top left"
                self="bottom left"
                no-focus
                allow-focus-outside
              >
                <q-list style="min-width: 100px; max-height: 50vh" class="bg-white">
                  <q-item
                    clickable
                    v-ripple
                    v-for="contact in filteredContactsForMention"
                    :key="contact.id"
                    @click="insertMention(contact)"
                  >
                    <q-item-section avatar>
                      <q-avatar :color="contact.avatarColor" text-color="white">
                        {{ getAvatarText(contact.name) }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ contact.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-dialog>
              <!-- Markdown Toolbar [Start] -->
              <q-toolbar class="bg-grey-1 q-mb-sm">
                <q-btn
                  flat
                  dense
                  icon="format_bold"
                  @click="applyMarkdown('bold')"
                  :class="{ 'active-markdown': isMarkdownActive('bold') }"
                >
                  <q-tooltip>
                    Bold
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + B)</span>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="format_italic"
                  @click="applyMarkdown('italic')"
                  :class="{ 'active-markdown': isMarkdownActive('italic') }"
                >
                  <q-tooltip>
                    Italic
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + I)</span>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="strikethrough_s"
                  @click="applyMarkdown('strikethrough')"
                  :class="{ 'active-markdown': isMarkdownActive('strikethrough') }"
                >
                  <q-tooltip>
                    Strikethrough
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + S)</span>
                  </q-tooltip>
                </q-btn>
                <q-separator vertical class="q-mx-sm" />
                <q-btn
                  flat
                  dense
                  icon="format_list_numbered"
                  @click="applyMarkdown('numberedlist')"
                  :class="{ 'active-markdown': isMarkdownActive('numberedlist') }"
                >
                  <q-tooltip>
                    Numbered List
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + K)</span>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="format_list_bulleted"
                  @click="applyMarkdown('list')"
                  :class="{ 'active-markdown': isMarkdownActive('list') }"
                >
                  <q-tooltip>
                    List
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + L)</span>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="task_alt"
                  @click="applyMarkdown('tasklist')"
                  :class="{ 'active-markdown': isMarkdownActive('tasklist') }"
                >
                  <q-tooltip>
                    Task List
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + T)</span>
                  </q-tooltip>
                </q-btn>
                <q-separator vertical class="q-mx-sm" />
                <q-btn
                  flat
                  dense
                  icon="link"
                  @click="applyMarkdown('link')"
                  :class="{ 'active-markdown': isMarkdownActive('link') }"
                >
                  <q-tooltip>
                    Link
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + U)</span>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="format_quote"
                  @click="applyMarkdown('quote')"
                  :class="{ 'active-markdown': isMarkdownActive('quote') }"
                >
                  <q-tooltip>
                    Quote
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + Q)</span>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="title"
                  @click="applyMarkdown('heading')"
                  :class="{ 'active-markdown': isMarkdownActive('heading') }"
                >
                  <q-tooltip>
                    Heading
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + H)</span>
                  </q-tooltip>
                </q-btn>
                <q-separator vertical class="q-mx-sm" />
                <q-btn
                  flat
                  dense
                  icon="code"
                  @click="applyMarkdown('code')"
                  :class="{ 'active-markdown': isMarkdownActive('code') }"
                >
                  <q-tooltip>
                    Code
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + C)</span>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="developer_mode"
                  @click="applyMarkdown('codeblock')"
                  :class="{ 'active-markdown': isMarkdownActive('codeblock') }"
                >
                  <q-tooltip>
                    Code Block
                    <span class="shortcut-tooltip">({{ isMac ? 'Cmd' : 'Ctrl' }} + Shift + B)</span>
                  </q-tooltip>
                </q-btn>
              </q-toolbar>
              <!-- Markdown Toolbar [End] -->
              <q-input
                ref="messageInput"
                v-model="newMessage"
                outlined
                placeholder="Type your message"
                class="full-width"
                type="textarea"
                autogrow
                style="max-height: 60vh; overflow-y: auto"
                @keydown.enter.exact.prevent.stop="sendMessage"
                @keydown.shift.enter.exact.prevent="insertLineBreak"
                @keydown.ctrl.enter.exact.prevent="insertLineBreak"
                @keydown.meta.enter.exact.prevent="insertLineBreak"
                @keydown.ctrl.b.prevent="applyMarkdown('bold')"
                @keydown.meta.b.prevent="applyMarkdown('bold')"
                @keydown.ctrl.i.prevent="applyMarkdown('italic')"
                @keydown.meta.i.prevent="applyMarkdown('italic')"
                @keydown.ctrl.shift.s.prevent="applyMarkdown('strikethrough')"
                @keydown.meta.shift.s.prevent="applyMarkdown('strikethrough')"
                @keydown.ctrl.shift.k.prevent="applyMarkdown('numberedlist')"
                @keydown.meta.shift.k.prevent="applyMarkdown('numberedlist')"
                @keydown.ctrl.shift.l.prevent="applyMarkdown('list')"
                @keydown.meta.shift.l.prevent="applyMarkdown('list')"
                @keydown.ctrl.shift.t.prevent="applyMarkdown('tasklist')"
                @keydown.meta.shift.t.prevent="applyMarkdown('tasklist')"
                @keydown.ctrl.u.prevent="showLinkDialog = true"
                @keydown.meta.u.prevent="showLinkDialog = true"
                @keydown.ctrl.shift.q.prevent="applyMarkdown('quote')"
                @keydown.meta.shift.q.prevent="applyMarkdown('quote')"
                @keydown.ctrl.shift.h.prevent="applyMarkdown('heading')"
                @keydown.meta.shift.h.prevent="applyMarkdown('heading')"
                @keydown.ctrl.shift.c.prevent="applyMarkdown('code')"
                @keydown.meta.shift.c.prevent="applyMarkdown('code')"
                @keydown.ctrl.shift.b.prevent="applyMarkdown('codeblock')"
                @keydown.meta.shift.b.prevent="applyMarkdown('codeblock')"
                @input="updateMarkdownStyles"
                @selectionchange="updateMarkdownStyles"
                @keydown="handleAtMention"
              >
                <template v-slot:append>
                  <q-btn round dense flat icon="send" color="primary" @click="sendMessage">
                    <q-tooltip>Send</q-tooltip>
                  </q-btn>
                </template>
                <!-- </q-input> -->
              </q-input>
            </q-card-section>
          </div>
        </q-card>
      </div>
      <!-- Right Side: Chat Area [End] -->
    </div>

    <!-- Delete Confirmation Dialog [Start] -->
    <q-dialog v-model="showDeleteConfirmation">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Confirm Delete</div>
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-auto" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure you want to delete this message?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDeleteMessage" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Delete Confirmation Dialog [End] -->

    <!-- Forward Message Dialog [Start] -->
    <q-dialog v-model="showForwardDialog">
      <q-card style="width: 500px; max-width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Forward Message</div>
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-auto" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            v-model="selectedForwardItems"
            :options="filteredForwardItems"
            option-label="name"
            option-value="id"
            multiple
            outlined
            dense
            placeholder="Select contacts/channels"
            class="q-mb-md"
            clearable
            use-input
            fill-input
            input-debounce="0"
            @filter="filterForwardItems"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-avatar :color="scope.opt.avatarColor" text-color="white">
                    {{ getAvatarText(scope.opt.name) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
              <q-chip
                removable
                :label="scope.opt.name"
                color="primary"
                text-color="white"
                class="q-mr-sm"
                @remove="scope.removeAtIndex(scope.index)"
              />
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Forward" color="primary" @click="forwardToSelectedItems" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Forward Message Dialog [End] -->

    <!-- Insert Link Dialog [Start] -->
    <q-dialog v-model="showLinkDialog" @hide="clearLinkDialogFields">
      <q-card style="width: 500px; max-width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6">Insert Link</div>
          <q-btn icon="close" flat round dense v-close-popup class="q-ml-auto" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="linkText" outlined dense placeholder="Display Text" class="q-mb-md" />
          <q-input v-model="linkUrl" outlined dense placeholder="URL" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="clearLinkDialogFields" />
          <q-btn
            flat
            label="Insert"
            color="primary"
            @click="insertLink"
            :disable="isLinkInsertDisabled"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Insert Link Dialog [End] -->
  </q-page>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useQuasar, uid, date } from 'quasar'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useSocket } from '../composables/useSocket.js'

// Markdown Tokenization using Marked Library [Start]
import { Lexer } from 'marked'

const getTokenTypesAtPosition = (markdown, position, options = {}) => {
  // Tokenize the Markdown input
  // const tokens = Lexer.lex(markdown, options)
  const tokens = Lexer.lexInline(markdown, options)

  // Helper function to recursively check tokens
  const findTokenTypes = (tokens, currentIndex = 0) => {
    const tokenTypes = []
    for (const token of tokens) {
      const tokenStart = currentIndex
      const tokenEnd = currentIndex + token.raw.length

      // Check if the position falls within the current token's range
      if (position >= tokenStart && position < tokenEnd) {
        // If the token has nested tokens, check them recursively
        const children = token.type === 'list' ? token.items : token.tokens
        if (children) {
          const nestedTokenTypes = findTokenTypes(children, tokenStart)
          tokenTypes.push(...nestedTokenTypes)
        }
        // Add the current token type
        tokenTypes.push(token.type)
      }

      // Update the current index to the next token's start
      currentIndex = tokenEnd
    }
    return tokenTypes
  }

  // Start checking from the top-level tokens
  return findTokenTypes(tokens)
}
// Markdown Tokenization using Marked Library [End]

const $q = useQuasar()

const isMac = computed(() => {
  return $q.platform.is.mac
})

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
  // opacity: 0.2,
  opacity: 0,
}

const contacts = ref([
  // Start with an empty array; users will be added via 'New Chat'
])

// Add channels data
const channels = ref([
  { id: uid(), name: 'General Channel', avatarColor: 'teal' },
  { id: uid(), name: 'Project X', avatarColor: 'purple' },
  { id: uid(), name: 'Random', avatarColor: 'orange' },
])

const allContactsAndChannels = computed(() => {
  return [
    ...contacts.value.map((contact) => ({ ...contact, type: 'contact' })),
    ...channels.value.map((channel) => ({ ...channel, type: 'channel' })),
  ]
})

const messageScrollArea = ref(null)
const messageInput = ref(null)

const selectedContact = ref(null)
const messages = ref([])
const newMessage = ref('')
const filterText = ref('')
const showUnreadOnly = ref(false)
const showDeleteConfirmation = ref(false)
const messageToDelete = ref(null)
const reactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '😠']
const showForwardDialog = ref(false)
const messageToForward = ref(null)
// Selected forward type (contacts or channels)
// const forwardType = ref('contacts')

// Filter text for contacts/channels
// const forwardFilterText = ref('')
const selectedForwardItems = ref([])
const forwardFilterText = ref('')
const messageSearchText = ref('')
const messageToEdit = ref(null)

const showLinkDialog = ref(false)
const linkText = ref('')
const linkUrl = ref('')

const showMentionMenu = ref(false)
const mentionStartIndex = ref(null)
// const mentionMenuPosition = ref({ left: 0, top: 0 })

const filteredContactsForMention = computed(() => {
  if (!mentionStartIndex.value) return []
  return contacts.value.filter((contact) =>
    contact.name
      .toLowerCase()
      .includes(newMessage.value.substring(mentionStartIndex.value + 1).toLowerCase()),
  )
})

const handleAtMention = (event) => {
  const input = messageInput.value.$el.querySelector('textarea')
  const start = input.selectionStart
  // const end = input.selectionEnd
  const char = event.key

  if (char === '@') {
    mentionStartIndex.value = start
    showMentionMenu.value = true
    // updateMenuPosition()
  } else if (showMentionMenu.value) {
    if (char === ' ' || char === '\n' || char === '\t' || char === '\r' || char === 'Enter') {
      showMentionMenu.value = false
      mentionStartIndex.value = null
    } else if (mentionStartIndex.value !== null) {
      if (start < mentionStartIndex.value) {
        showMentionMenu.value = false
        mentionStartIndex.value = null
      }
    }
  }
}

const insertMention = (contact) => {
  const input = messageInput.value.$el.querySelector('textarea')
  const start = mentionStartIndex.value
  const end = input.selectionEnd
  const textBeforeMention = newMessage.value.substring(0, start)
  const textAfterMention = newMessage.value.substring(end)
  const mentionText = `@${contact.name}`
  newMessage.value = `${textBeforeMention}${mentionText} ${textAfterMention}`
  mentionStartIndex.value = null
  showMentionMenu.value = false
  nextTick(() => {
    input.focus()
    input.setSelectionRange(start + mentionText.length + 1, start + mentionText.length + 1)
  })
}

// const updateMenuPosition = () => {
//   nextTick(() => {
//     const input = messageInput.value.$el.querySelector('textarea')
//     const cursorPosition = mentionStartIndex.value
//     const rects = input.getClientRects()
//     if (rects.length > 0) {
//       const rect = rects[0]
//       const charWidth = rect.width / input.value.length
//       const charHeight = rect.height
//       const cursorX = rect.left + cursorPosition * charWidth
//       const cursorY = rect.top + charHeight
//       const inputRect = input.getBoundingClientRect()

//       mentionMenuPosition.value.left = cursorX - inputRect.left
//       mentionMenuPosition.value.top = cursorY - inputRect.top
//     }
//   })
// }

const allForwardItems = computed(() => {
  return allContactsAndChannels.value.map((item) => ({ ...item }))
})

const filteredForwardItems = computed(() => {
  if (forwardFilterText.value) {
    return allForwardItems.value.filter((item) =>
      item.name.toLowerCase().includes(forwardFilterText.value.toLowerCase()),
    )
  }
  return allForwardItems.value
})

const filterForwardItems = (val, update) => {
  update(() => {
    forwardFilterText.value = val
  })
}

const forwardToSelectedItems = () => {
  if (messageToForward.value && selectedForwardItems.value.length > 0) {
    selectedForwardItems.value.forEach((itemId) => {
      const item = allForwardItems.value.find((i) => i.id === itemId)
      if (item) {
        console.log(`Forwarding message to ${item.name}: ${messageToForward.value.text}`)
      }
    })
    showForwardDialog.value = false
    messageToForward.value = null
    selectedForwardItems.value = []
  }
}

// // Computed property to filter items based on selected type AND filter text
// const filteredForwardItems = computed(() => {
//   let items = []

//   if (forwardFilterText.value) {
//     items = allContactsAndChannels.value.filter((item) =>
//       item.name.toLowerCase().includes(forwardFilterText.value.toLowerCase()),
//     )
//   }

//   return items
// })

const markdownStyles = ref({
  bold: false,
  italic: false,
  strikethrough: false,
  code: false,
  numberedlist: false,
  list: false,
  tasklist: false,
  link: false,
  quote: false,
  heading: false,
  codeblock: false,
})

const updateMarkdownStyles = () => {
  const input = messageInput.value.$el.querySelector('textarea')
  const start = input.selectionStart
  const text = newMessage.value

  const codeblock = isWithinCodeBlockContext(text, start)

  const tokenTypes = getTokenTypesAtPosition(text, start, { gfm: true })
  markdownStyles.value.bold = tokenTypes.includes('strong')
  markdownStyles.value.italic = tokenTypes.includes('em')
  markdownStyles.value.strikethrough = tokenTypes.includes('del')
  markdownStyles.value.link = tokenTypes.includes('link')
  markdownStyles.value.code = tokenTypes.includes('codespan') && !codeblock
  markdownStyles.value.codeblock = tokenTypes.includes('code') || codeblock
  markdownStyles.value.quote =
    tokenTypes.includes('blockquote') || isWithinQuoteContext(text, start)
  markdownStyles.value.heading =
    tokenTypes.includes('heading') || isWithinHeadingContext(text, start)

  markdownStyles.value.numberedlist = isWithinNumberedListContext(text, start)
  markdownStyles.value.list = isWithinListContext(text, start)
  markdownStyles.value.tasklist = isWithinTaskContext(text, start)
}

const isWithinContext = (text, cursorPosition, delimiter) => {
  const beforeCursor = text.substring(0, cursorPosition)

  if (delimiter === '_') {
    // Special handling for italic with `_`

    // Leading _ character:
    // Match one or more spaces followed by `_`. Or an _ preceded by nothing: At the start of the string (i.e., no character before it)
    // And ensure that `_` is not followed by a space.
    const prefixMatch = beforeCursor.match(/(?<=^|\s+)_(?!\s)/)
    if (!prefixMatch) return false

    // Trailing _ character:
    // Match `_` followed by one or more spaces '\s+' or a newline '\n' or end of string '$'
    // And ensure that `_` is not preceded by a space (?!\s)
    const suffixMatch = text.substring(cursorPosition).match(/(?<!\s)_(\s+|\n|$)/)

    // Ensure that another leading _ character is not present before the trailing _ character
    const inBetweenMatch = text.substring(cursorPosition).match(/\s+_(?!\s)/)
    if (inBetweenMatch && suffixMatch) {
      if (inBetweenMatch.index < suffixMatch.index) {
        return false
      }
    }

    return !!suffixMatch
  }

  if (delimiter === '**') {
    // Special handling for bold
    const boldCountBeforeCursor = (beforeCursor.match(/\*\*/g) || []).length
    return boldCountBeforeCursor % 2 !== 0 // Odd number means we're inside a bold context
  } else if (delimiter === '*') {
    // Special handling for italic
    // Check if we are inside a bold context, if so, return false
    if (isWithinContext(text, cursorPosition, '**')) {
      return false
    }
    const italicCountBeforeCursor = (beforeCursor.match(/(?<!\\)\*/g) || []).length
    return italicCountBeforeCursor % 2 !== 0 // Odd number means we're inside an italic context
  } else if (delimiter === '`') {
    // Special handling for code
    // Check if we are inside a code block, if so, return false
    if (isWithinCodeBlockContext(text, cursorPosition)) {
      return false
    }
    const codeCountBeforeCursor = (beforeCursor.match(/(?<!\\)`/g) || []).length
    return codeCountBeforeCursor % 2 !== 0 // Odd number means we're inside a code context
  } else if (delimiter === '~~') {
    // Special handling for strikethrough
    const strikethroughCountBeforeCursor = (beforeCursor.match(/~~/g) || []).length
    return strikethroughCountBeforeCursor % 2 !== 0
  } else {
    const lastDelimiterStart = beforeCursor.lastIndexOf(delimiter)
    const nextDelimiterEnd = text.substring(cursorPosition).indexOf(delimiter)
    return (
      lastDelimiterStart !== -1 &&
      nextDelimiterEnd !== -1 &&
      beforeCursor.substring(lastDelimiterStart).indexOf(delimiter) === 0
    )
  }
}

const isWithinCodeBlockContext = (text, cursorPosition) => {
  const beforeCursor = text.substring(0, cursorPosition)
  const codeBlockCountBeforeCursor = (beforeCursor.match(/```/g) || []).length
  return codeBlockCountBeforeCursor % 2 !== 0
}

const isWithinNumberedListContext = (text, cursorPosition) => {
  // Check if the cursor is within a code block
  if (isWithinCodeBlockContext(text, cursorPosition)) {
    return false // If inside a code block, it's not a numbered list
  }

  const currentLineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1
  const currentLine = text.substring(currentLineStart, cursorPosition)
  return /^\s*\d+\.\s/.test(currentLine)
}

const isWithinListContext = (text, cursorPosition) => {
  // Check if the cursor is within a code block
  if (isWithinCodeBlockContext(text, cursorPosition)) {
    return false // If inside a code block, it's not a regular list
  }
  const currentLineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1
  const currentLine = text.substring(currentLineStart, cursorPosition)
  return /^\s*-\s(?!\[( |x)\]\s)/.test(currentLine)
}

const isWithinTaskContext = (text, cursorPosition) => {
  // Check if the cursor is within a code block
  if (isWithinCodeBlockContext(text, cursorPosition)) {
    return false // If inside a code block, it's not a task list
  }
  const currentLineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1
  const currentLine = text.substring(currentLineStart, cursorPosition)
  return /^\s*-\s\[( |x)\]\s/.test(currentLine)
}

const isWithinQuoteContext = (text, cursorPosition) => {
  const currentLineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1
  const currentLine = text.substring(currentLineStart, cursorPosition)
  // Updated regex to match blockquotes within lists, numbered lists, and task lists
  return /^\s*([-\s]|\d+\.\s)*(\[( |x)\]\s)*>\s/.test(currentLine)
}

const isWithinHeadingContext = (text, cursorPosition) => {
  const currentLineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1
  const currentLine = text.substring(currentLineStart, cursorPosition)
  // Updated regex to match headings within lists, numbered lists, and task lists
  return /^\s*([-\s]|\d+\.\s)*(\[( |x)\]\s)*#+\s/.test(currentLine)
}

const applyMarkdown = async (type) => {
  const input = messageInput.value.$el.querySelector('textarea')
  let start = input.selectionStart
  let end = input.selectionEnd
  const selectedText = newMessage.value.substring(start, end)
  let replacement = ''
  let cursorAdjustment = 0

  switch (type) {
    case 'bold': {
      // Check if the cursor is within a bold context
      const beforeCursor = newMessage.value.substring(0, start)
      const afterCursor = newMessage.value.substring(end)
      const lastBoldStart = beforeCursor.lastIndexOf('**')
      const nextBoldEnd = afterCursor.indexOf('**')

      if (
        lastBoldStart !== -1 &&
        nextBoldEnd !== -1 &&
        beforeCursor.substring(lastBoldStart).indexOf('**') === 0
      ) {
        // Cursor is within a bold context, remove bold
        const boldStart = lastBoldStart
        const boldEnd = end + nextBoldEnd + 2 // +2 for the closing **
        const boldText = newMessage.value.substring(boldStart + 2, boldEnd - 2)
        replacement = boldText
        newMessage.value =
          newMessage.value.substring(0, boldStart) +
          replacement +
          newMessage.value.substring(boldEnd)
        start = boldStart
        end = start + replacement.length
        cursorAdjustment = 0
      } else {
        // Trim leading and trailing spaces from selected text
        const trimmedSelectedText = selectedText.trim()
        const leadingSpaces = selectedText.length - selectedText.trimStart().length
        const trailingSpaces = selectedText.length - selectedText.trimEnd().length

        replacement = `**${trimmedSelectedText}**`
        cursorAdjustment = 2
        start += leadingSpaces
        end -= trailingSpaces
      }
      break
    }
    case 'italic': {
      const beforeCursor = newMessage.value.substring(0, start)
      const afterCursor = newMessage.value.substring(end)
      const lastItalicStart = beforeCursor.lastIndexOf('*')
      const nextItalicEnd = afterCursor.indexOf('*')
      const lastBoldStart = beforeCursor.lastIndexOf('**')
      const nextBoldEnd = afterCursor.indexOf('**')

      const isWithinBold =
        lastBoldStart !== -1 &&
        nextBoldEnd !== -1 &&
        beforeCursor.substring(lastBoldStart).indexOf('**') === 0

      const isWithinItalic =
        lastItalicStart !== -1 &&
        nextItalicEnd !== -1 &&
        beforeCursor.substring(lastItalicStart).indexOf('*') === 0 &&
        beforeCursor.substring(lastItalicStart - 1, lastItalicStart) !== '\\' &&
        afterCursor.substring(nextItalicEnd - 1, nextItalicEnd) !== '\\'

      if (isWithinItalic && !isWithinBold) {
        // Remove italic only if not within bold
        const italicStart = lastItalicStart
        const italicEnd = end + nextItalicEnd + 1
        const italicText = newMessage.value.substring(italicStart + 1, italicEnd - 1)
        replacement = italicText
        newMessage.value =
          newMessage.value.substring(0, italicStart) +
          replacement +
          newMessage.value.substring(italicEnd)
        start = italicStart
        end = start + replacement.length
        cursorAdjustment = 0
      } else {
        // Apply italic, even if within bold
        const trimmedSelectedText = selectedText.trim()
        const leadingSpaces = selectedText.length - selectedText.trimStart().length
        const trailingSpaces = selectedText.length - selectedText.trimEnd().length

        replacement = `*${trimmedSelectedText}*`
        cursorAdjustment = 1
        start += leadingSpaces
        end -= trailingSpaces
      }
      break
    }
    case 'strikethrough': {
      // Check if the cursor is within a strikethrough context
      const beforeCursor = newMessage.value.substring(0, start)
      const afterCursor = newMessage.value.substring(end)
      const lastStrikethroughStart = beforeCursor.lastIndexOf('~~')
      const nextStrikethroughEnd = afterCursor.indexOf('~~')

      if (
        lastStrikethroughStart !== -1 &&
        nextStrikethroughEnd !== -1 &&
        beforeCursor.substring(lastStrikethroughStart).indexOf('~~') === 0
      ) {
        // Cursor is within a strikethrough context, remove strikethrough
        const strikethroughStart = lastStrikethroughStart
        const strikethroughEnd = end + nextStrikethroughEnd + 2 // +2 for the closing ~~
        const strikethroughText = newMessage.value.substring(
          strikethroughStart + 2,
          strikethroughEnd - 2,
        )
        replacement = strikethroughText
        newMessage.value =
          newMessage.value.substring(0, strikethroughStart) +
          replacement +
          newMessage.value.substring(strikethroughEnd)
        start = strikethroughStart
        end = start + replacement.length
        cursorAdjustment = 0
      } else {
        // Trim leading and trailing spaces from selected text
        const trimmedSelectedText = selectedText.trim()
        const leadingSpaces = selectedText.length - selectedText.trimStart().length
        const trailingSpaces = selectedText.length - selectedText.trimEnd().length

        // Cursor is not within a strikethrough context, apply strikethrough
        replacement = `~~${trimmedSelectedText}~~`
        cursorAdjustment = 2
        start += leadingSpaces
        end -= trailingSpaces
      }
      break
    }
    case 'code': {
      // Check if the cursor is within a code context
      const beforeCursor = newMessage.value.substring(0, start)
      const afterCursor = newMessage.value.substring(end)
      const lastCodeStart = beforeCursor.lastIndexOf('`')
      const nextCodeEnd = afterCursor.indexOf('`')

      if (
        lastCodeStart !== -1 &&
        nextCodeEnd !== -1 &&
        beforeCursor.substring(lastCodeStart).indexOf('`') === 0 &&
        beforeCursor.substring(lastCodeStart - 1, lastCodeStart) !== '\\' &&
        afterCursor.substring(nextCodeEnd - 1, nextCodeEnd) !== '\\'
      ) {
        // Cursor is within a code context, remove code formatting
        const codeStart = lastCodeStart
        const codeEnd = end + nextCodeEnd + 1 // +1 for the closing `
        const codeText = newMessage.value.substring(codeStart + 1, codeEnd - 1)
        replacement = codeText
        newMessage.value =
          newMessage.value.substring(0, codeStart) +
          replacement +
          newMessage.value.substring(codeEnd)
        start = codeStart
        end = start + replacement.length
        cursorAdjustment = 0
      } else {
        // Cursor is not within a code context, apply code formatting
        // Trim leading and trailing spaces from selected text
        const trimmedSelectedText = selectedText.trim()
        const leadingSpaces = selectedText.length - selectedText.trimStart().length
        const trailingSpaces = selectedText.length - selectedText.trimEnd().length

        replacement = `\`${trimmedSelectedText}\``
        cursorAdjustment = 1
        start += leadingSpaces
        end -= trailingSpaces
      }
      break
    }
    case 'codeblock': {
      // Check if the cursor is within a code block context
      const beforeCursor = newMessage.value.substring(0, start)
      const afterCursor = newMessage.value.substring(end)
      const lastCodeBlockStart = beforeCursor.lastIndexOf('```')
      const nextCodeBlockEnd = afterCursor.indexOf('```')

      if (
        lastCodeBlockStart !== -1 &&
        nextCodeBlockEnd !== -1 &&
        beforeCursor.substring(lastCodeBlockStart).indexOf('```') === 0 &&
        (beforeCursor.substring(lastCodeBlockStart - 1, lastCodeBlockStart) === '\n' ||
          lastCodeBlockStart === 0) &&
        (afterCursor.substring(nextCodeBlockEnd + 3, nextCodeBlockEnd + 4) === '\n' ||
          nextCodeBlockEnd === afterCursor.length - 3)
      ) {
        // Cursor is within a code block context, remove code block formatting
        const codeBlockStart = lastCodeBlockStart
        const codeBlockEnd = end + nextCodeBlockEnd + 3 // +3 for the closing ```
        const codeBlockText = newMessage.value.substring(codeBlockStart + 3, codeBlockEnd - 3)
        replacement = codeBlockText.trim()
        newMessage.value =
          newMessage.value.substring(0, codeBlockStart) +
          replacement +
          newMessage.value.substring(codeBlockEnd)
        start = codeBlockStart
        end = start + replacement.length
        cursorAdjustment = 0
      } else {
        // Cursor is not within a code block context, apply code block formatting
        // Get the current cursor position
        const input = messageInput.value.$el.querySelector('textarea')
        let start = input.selectionStart

        // Check if there is text before the cursor
        if (start > 0) {
          // Check if the character before the cursor is not a newline
          if (newMessage.value.charAt(start - 1) !== '\n') {
            // Prepend a newline character
            replacement = `\n\`\`\`\n${selectedText}\n\`\`\`\n`
            cursorAdjustment = 5
          } else {
            replacement = `\`\`\`\n${selectedText}\n\`\`\`\n`
            cursorAdjustment = 5
          }
        } else {
          replacement = `\`\`\`\n${selectedText}\n\`\`\`\n`
          cursorAdjustment = 5
        }
      }
      break
    }
    case 'numberedlist': {
      // Get the current line start
      const currentLineStart = newMessage.value.lastIndexOf('\n', start - 1) + 1
      // Get the current line
      const currentLine = newMessage.value.substring(currentLineStart, start)
      // Check if the current line is already a numbered list
      const isAlreadyNumberedList = /^\s*\d+\.\s/.test(currentLine)
      if (isAlreadyNumberedList) {
        // If it's already a numbered list, remove the numbering
        const match = currentLine.match(/^(\s*)(\d+)\.\s/)
        if (match) {
          const leadingSpaces = match[1] || ''
          const textAfterNumber = currentLine.substring(match[0].length)
          replacement = `${leadingSpaces}${textAfterNumber}`
          newMessage.value =
            newMessage.value.substring(0, currentLineStart) +
            replacement +
            newMessage.value.substring(start)
          start = currentLineStart + replacement.length
          end = start
          cursorAdjustment = 0
          await nextTick()
          input.focus()
          input.setSelectionRange(start, end)
          return
        }
      } else {
        // If it's not a numbered list, add "1. " to the beginning of the line
        const textAfterCursor = newMessage.value.substring(start)
        replacement = `1. ${currentLine}`
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) + replacement + textAfterCursor
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
        await nextTick()
        input.focus()
        input.setSelectionRange(start, end)
        return
      }
      break
    }
    case 'list': {
      // Get the current line start
      const currentLineStart = newMessage.value.lastIndexOf('\n', start - 1) + 1
      // Get the current line
      const currentLine = newMessage.value.substring(currentLineStart, start)
      // Check if the current line is already a list item
      const isAlreadyList = /^\s*-\s/.test(currentLine)
      if (isAlreadyList) {
        // If it's already a list item, remove the list character
        replacement = currentLine.replace(/^\s*-\s/, '')
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      } else {
        // If it's not a list item, add "- " to the beginning of the line
        replacement = `- ${currentLine}`
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      }
      await nextTick()
      input.focus()
      input.setSelectionRange(start, end)
      return
    }
    case 'tasklist': {
      // Get the current line start
      const currentLineStart = newMessage.value.lastIndexOf('\n', start - 1) + 1
      // Get the current line
      const currentLine = newMessage.value.substring(currentLineStart, start)
      // Check if the current line is already a task list item
      const isAlreadyTask = /^\s*-\s\[( |x)\]\s/.test(currentLine)
      if (isAlreadyTask) {
        // If it's already a task list item, remove the task list characters
        replacement = currentLine.replace(/^\s*-\s\[( |x)\]\s/, '')
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      } else {
        // If it's not a task list item, add "- [ ] " to the beginning of the line
        replacement = `- [ ] ${currentLine}`
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      }
      await nextTick()
      input.focus()
      input.setSelectionRange(start, end)
      return
    }
    case 'link': {
      // Check if the cursor is within a link
      const linkDetails = getLinkDetailsAtCursor(newMessage.value, start)
      if (linkDetails) {
        // If within a link, populate the dialog with existing link details
        linkText.value = linkDetails.text
        linkUrl.value = linkDetails.url
      } else {
        // If not within a link, set the linkText to the selected text
        linkText.value = selectedText
      }
      showLinkDialog.value = true
      return
    }
    case 'quote': {
      // Get the current line start
      const currentLineStart = newMessage.value.lastIndexOf('\n', start - 1) + 1
      // Get the current line
      const currentLine = newMessage.value.substring(currentLineStart, start)
      // Check if the current line is already a blockquote
      const isAlreadyBlockquote = currentLine.trimStart().startsWith('> ')
      if (isAlreadyBlockquote) {
        // If it's already a blockquote, remove the blockquote character
        replacement = currentLine.replace(/^\s*>\s/, '')
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      } else {
        // If it's not a blockquote, add "> " to the beginning of the line
        replacement = `> ${currentLine.trim()}`
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      }
      await nextTick()
      input.focus()
      input.setSelectionRange(start, end)
      return
    }
    case 'heading': {
      // Get the current line start
      const currentLineStart = newMessage.value.lastIndexOf('\n', start - 1) + 1
      // Get the current line
      const currentLine = newMessage.value.substring(currentLineStart, start)
      // Check if the current line is already a heading
      const isAlreadyHeading = currentLine.trimStart().startsWith('#')
      if (isAlreadyHeading) {
        // If it's already a heading, remove the heading character
        replacement = currentLine.replace(/^\s*#+\s*/, '')
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      } else {
        // If it's not a heading, add "# " to the beginning of the line
        replacement = `# ${currentLine.trim()}`
        newMessage.value =
          newMessage.value.substring(0, currentLineStart) +
          replacement +
          newMessage.value.substring(start)
        start = currentLineStart + replacement.length
        end = start
        cursorAdjustment = 0
      }
      await nextTick()
      input.focus()
      input.setSelectionRange(start, end)
      return
    }
  }

  newMessage.value =
    newMessage.value.substring(0, start) + replacement + newMessage.value.substring(end)

  // Adjust cursor position after applying markdown
  await nextTick()
  input.focus()
  input.setSelectionRange(start + replacement.length, start + replacement.length - cursorAdjustment)
  updateMarkdownStyles()
}

const getLinkDetailsAtCursor = (text, cursorPosition) => {
  // Regular expression to match Markdown links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    const linkStart = match.index
    const linkEnd = linkStart + match[0].length

    // Check if the cursor is within the current link
    if (cursorPosition >= linkStart && cursorPosition <= linkEnd) {
      return {
        text: match[1], // Text inside the brackets
        url: match[2], // URL inside the parentheses
      }
    }
  }

  return null // No link found at the cursor position
}

const insertLink = () => {
  const input = messageInput.value.$el.querySelector('textarea')
  let start = input.selectionStart
  let end = input.selectionEnd
  const selectedText = newMessage.value.substring(start, end)

  // Trim leading and trailing spaces from selected text
  const trimmedSelectedText = selectedText.trim()
  const leadingSpaces = selectedText.length - selectedText.trimStart().length
  const trailingSpaces = selectedText.length - selectedText.trimEnd().length
  start += leadingSpaces
  end -= trailingSpaces

  const replacement = `[${linkText.value || trimmedSelectedText}](${linkUrl.value})`

  newMessage.value =
    newMessage.value.substring(0, start) + replacement + newMessage.value.substring(end)

  // Adjust cursor position after applying markdown
  nextTick(() => {
    input.focus()
    input.setSelectionRange(start + replacement.length, start + replacement.length)
  })

  showLinkDialog.value = false
}

const clearLinkDialogFields = () => {
  linkText.value = ''
  linkUrl.value = ''
}

const isMarkdownActive = (type) => {
  return markdownStyles.value[type]
}

const toggleUnreadFilter = () => {
  showUnreadOnly.value = !showUnreadOnly.value
}

const filteredContacts = computed(() => {
  let filtered = contacts.value

  if (showUnreadOnly.value) {
    filtered = filtered.filter((contact) => contact.unread)
  }

  if (filterText.value) {
    filtered = filtered.filter((contact) =>
      contact.name.toLowerCase().includes(filterText.value.toLowerCase()),
    )
  }

  return filtered
})

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
  const contact = contacts.value.find((c) => c.name === name)
  return contact ? contact.avatarColor : 'primary'
}

const selectContact = (contact) => {
  if (!contact) return
  newMessage.value = contact.draft || ''
  selectedContact.value = contact
  messages.value = []
}

// Watch for changes in newMessage and update the draft
watch(newMessage, (newDraft, oldDraft) => {
  if (selectedContact.value) {
    selectedContact.value.draft = newDraft
  }
  oldDraft // To suppress unused variable warning.
})

selectContact(contacts.value[0]) // Select the first contact by default

const insertLineBreak = async () => {
  const input = messageInput.value.$el.querySelector('textarea')
  const start = input.selectionStart
  const end = input.selectionEnd
  const currentLineStart = newMessage.value.lastIndexOf('\n', start - 1) + 1
  const currentLine = newMessage.value.substring(currentLineStart, start)
  const isBlockquote = currentLine.trimStart().startsWith('> ')
  const isList = currentLine.trimStart().startsWith('- ')
  const isNumberedList = /^\s*\d+\.\s/.test(currentLine) // Check for numbered list pattern
  const isTask = /^\s*-\s\[( |x)\]\s/.test(currentLine)
  let lineBreak = '  \n'

  if (isBlockquote) {
    lineBreak = '  \n> '
  } else if (isTask) {
    lineBreak = '  \n- [ ] '
  } else if (isList) {
    lineBreak = '  \n- '
  } else if (isNumberedList) {
    const match = currentLine.match(/^(\s*)(\d+)\.\s/) // Extract leading spaces and number
    if (match) {
      const leadingSpaces = match[1] || ''
      const currentNumber = parseInt(match[2])
      const nextNumber = currentNumber + 1
      lineBreak = `  \n${leadingSpaces}${nextNumber}. `
    } else {
      lineBreak = '  \n1. ' // Default to 1. if no match
    }
  }

  newMessage.value =
    newMessage.value.substring(0, start) + lineBreak + newMessage.value.substring(end)

  // Adjust cursor position after inserting the line break
  await nextTick()
  input.focus()
  input.setSelectionRange(start + lineBreak.length, start + lineBreak.length)
}

const { socket, connect, disconnect, on, off, emit } = useSocket() // Get WebSocket methods

onUnmounted(() => {
  disconnect()
})

function sendMessage() {
  if (!selectedContact.value || !newMessage.value.trim()) return

  const msg = {
    id: Date.now(),
    sender: 'me',
    text: newMessage.value,
    timestamp: new Date().toISOString(),
  }

  // Optimistically update UI
  if (!messagesByUser.value[selectedContact.value.id]) {
    messagesByUser.value[selectedContact.value.id] = []
  }
  messagesByUser.value[selectedContact.value.id].push(msg)

  try {
    const payload = {
      receiver_id: selectedContact.value.id,
      text: newMessage.value,
    }

    console.log('Sending to WS:', payload) // Debug log

    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(payload))
      newMessage.value = '' // Only clear after successful send
    } else {
      console.error('WebSocket is not open.')
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  }

  nextTick(() => {
    if (messageScrollArea.value) {
      messageScrollArea.value.setScrollPosition('vertical', 'infinity')
    }
  })
}


const onFilterTextChange = (value) => {
  filterText.value = value
}

const onMessageSearchTextChange = (value) => {
  messageSearchText.value = value
}

const filteredMessages = computed(() => {
  if (!messageSearchText.value) {
    return messages.value
  }
  return messages.value.filter((message) => {
    return (
      message.text && message.text.toLowerCase().includes(messageSearchText.value.toLowerCase())
    )
  })
})

const isLinkInsertDisabled = computed(() => {
  return !linkText.value || !linkUrl.value
})

const renderMarkdown = (text) => {
  if (!text) return ''
  // SECURITY: Sanitize the HTML to prevent XSS attacks
  //           DOMPurify is used to sanitize the HTML and prevent XSS attacks
  //           For example, it will remove any script tags or event handlers like onclick
  //           <div onclick="alert('Hello!')">Click me</div>
  const html = DOMPurify.sanitize(marked.parse(highlightSearchTerm(text)))
  // Add target="_blank" and rel="noopener noreferrer" to all links
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const links = doc.querySelectorAll('a')
  links.forEach((link) => {
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
  })
  return doc.body.innerHTML
}

const getMessageStatusIcon = (status) => {
  switch (status) {
    case 'sent':
      return 'done'
    case 'delivered':
      return 'done_all'
    case 'read':
      return 'done_all'
    default:
      return 'schedule' // Default to pending
  }
}

const getMessageStatusColor = (status) => {
  switch (status) {
    case 'sent':
      return 'grey'
    case 'delivered':
      return 'grey'
    case 'read':
      return 'primary'
    default:
      return 'grey' // Default to grey
  }
}

const highlightSearchTerm = (text) => {
  if (!messageSearchText.value || !text) {
    return text
  }
  const regex = new RegExp(`(${messageSearchText.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const isSameDate = (index) => {
  if (index === 0) return false
  const currentMessage = filteredMessages.value[index]
  const previousMessage = filteredMessages.value[index - 1]
  return date.isSameDate(currentMessage.timestamp, previousMessage.timestamp, 'day')
}

const formatDateHeader = (timestamp) => {
  return date.formatDate(timestamp, 'dddd, MMMM D, YYYY')
}

const isConsecutiveMessage = (index) => {
  if (index === 0) return false
  const currentMessage = filteredMessages.value[index]
  const previousMessage = filteredMessages.value[index - 1]
  const timeDifference = currentMessage.timestamp - previousMessage.timestamp
  return (
    currentMessage.sender === previousMessage.sender &&
    timeDifference < 2 * 60 * 1000 &&
    date.isSameDate(currentMessage.timestamp, previousMessage.timestamp, 'day')
  )
}

const truncatedMessage = (msg) => {
  if (msg && msg.length > 30) {
    return msg.substring(0, 30) + '...'
  }
  return msg
}

const editMessage = (message) => {
  // Store the message to be edited
  messageToEdit.value = message
  // Set the message text to the input box
  newMessage.value = message.text
  // Focus the input field
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

const replyToMessage = (message) => {
  // Handle the reply logic here
  console.log('Replying to:', message)

  // Prefix '> ' to all the new lines in the message
  const lines = message.text.split('\n')
  const quotedLines = lines.map((line) => `> ${line}`).join('\n')

  // Format the quoted message
  const formattedMessage = `> ${message.sender} (${formatTimestamp(
    message.timestamp,
  )}):\n${quotedLines}\n\n`
  // Set the new message value
  newMessage.value = formattedMessage

  // Focus the input field
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

const forwardMessage = (message) => {
  messageToForward.value = message
  showForwardDialog.value = true
}

const deleteMessage = (message) => {
  messageToDelete.value = message
  showDeleteConfirmation.value = true
}

const confirmDeleteMessage = () => {
  if (messageToDelete.value) {
    const index = messages.value.findIndex((m) => m.id === messageToDelete.value.id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
    messageToDelete.value = null
  }
}

const showReactionOptions = (message) => {
  message.showReactions = true
}

const hideReactionOptions = (message) => {
  message.showReactions = false
}

const addReaction = (message, emoji) => {
  let existingReaction = message.reactions.find((r) => r.emoji === emoji)
  if (existingReaction) {
    existingReaction.count++
  } else {
    message.reactions.push({ emoji: emoji, count: 1 })
  }
  hideReactionOptions(message)
}

const bookmarkMessage = (message) => {
  message.bookmarked = !message.bookmarked
}

const formatTimestamp = (timestamp) => {
  return date.formatDate(timestamp, 'hh:mm A')
}

const onStartNewChat = () => {
  showUserSearch.value = true
  userSearchText.value = ''
  nextTick(() => {
    if (userSearchInput.value && userSearchInput.value.$el) {
      userSearchInput.value.$el.querySelector('input').focus()
    }
  })
}

const showUserSearch = ref(false)
const userSearchText = ref('')
const userSearchInput = ref(null)
// Hardcoded user list for now
const hardcodedUsers = ref([])

onMounted(async () => {
  try {
    // Fetch users
    const response = await fetch('/api/v1.0/users/getallusers')
    if (!response.ok) throw new Error('Failed to fetch users')
    const data = await response.json()

    hardcodedUsers.value = data.userList.map((user) => ({
      id: user.userId,
      name: user.userName,
      initials: user.userName
        .split(' ')
        .map((n) => n[0])
        .join(''),
    }))

    // Connect to WebSocket
    connect()

    // Wait for WebSocket to be initialized
    const waitForSocket = setInterval(() => {
      if (socket.value) {
        clearInterval(waitForSocket)

        socket.value.onopen = () => {
          console.log('Connected to WebSocket server')
        }

        socket.value.onmessage = (event) => {
          const data = JSON.parse(event.data)
          console.log('Received WebSocket message:', data)

          // For incoming messages, the contact is the sender (person we're chatting with)
          const contactId = data.sender_id

          const incomingMessage = {
            id: data.message_id || Date.now(),
            sender: data.sender_name || 'other',
            text: data.text,
            timestamp: data.timestamp || new Date().toISOString(),
          }

          // Initialize messages array if doesn't exist
          if (!messagesByUser.value[contactId]) {
            messagesByUser.value[contactId] = []
          }

          // Check for duplicates (in case of echo)
          const isDuplicate = messagesByUser.value[contactId].some(
            (msg) =>
              msg.id === incomingMessage.id ||
              (msg.text === incomingMessage.text && msg.sender === incomingMessage.sender),
          )

          if (!isDuplicate) {
            messagesByUser.value[contactId].push(incomingMessage)

            // Update contact list
            updateContactList(contactId, data.sender_name, data.text)

            // Auto-scroll if this is the current conversation
            if (selectedContact.value?.id === contactId) {
              nextTick(() => {
                if (messageScrollArea.value) {
                  messageScrollArea.value.setScrollPosition('vertical', 'infinity')
                }
              })
            }
          }
        }
        socket.value.onerror = (err) => {
          console.error('WebSocket error:', err)
        }

        socket.value.onclose = () => {
          console.log('Disconnected from WebSocket server')
        }
      }
    }, 100)
  } catch (error) {
    console.error('Error initializing chat:', error)
  }
})

const updateContactList = (senderId, senderName, messageText) => {
  let contact = recentChats.value.find(c => c.id === senderId)
  
  if (!contact) {
    // Add new contact
    contact = {
      id: senderId,
      name: senderName,
      lastMessage: messageText.substring(0, 30) + (messageText.length > 30 ? '...' : ''),
      avatarColor: 'primary',
      unread: true,
      draft: ''
    }
    recentChats.value.unshift(contact)
  } else {
    // Update existing contact
    contact.lastMessage = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '')
    contact.unread = selectedContact.value?.id !== senderId // Only mark unread if not current conversation
    
    // Move to top of list
    const index = recentChats.value.indexOf(contact)
    recentChats.value.splice(index, 1)
    recentChats.value.unshift(contact)
  }
}

const filteredUserList = computed(() => {
  if (!userSearchText.value) return hardcodedUsers.value
  return hardcodedUsers.value.filter((user) =>
    user.name.toLowerCase().includes(userSearchText.value.toLowerCase()),
  )
})
function selectUser(user) {
  showUserSearch.value = false
  userSearchText.value = ''
  // Add user to recentChats if not already present
  if (!recentChats.value.some((c) => c.id === user.id)) {
    recentChats.value.unshift({
      id: user.id,
      name: user.name,
      lastMessage: '',
      avatarColor: 'primary',
      unread: false,
    })
  }
  // Find the user in recentChats and select that object
  const found = recentChats.value.find((c) => c.id === user.id)
  if (found) {
    selectedContact.value = found
  }
}
function onUserSearchBlur() {
  // Hide after a short delay to allow click event
  setTimeout(() => {
    showUserSearch.value = false
    userSearchText.value = ''
  }, 120)
}
function selectFirstUser() {
  if (filteredUserList.value.length > 0) {
    selectUser(filteredUserList.value[0])
  }
}
function resetUserSearch() {
  userSearchText.value = ''
}

const onMeetNow = () => {
  // Placeholder for meet now action
  console.log('Meet Now clicked')
}

const recentChats = ref([])

// --- Hardcoded chat histories for demo/testing ---
// This object maps user IDs to arrays of messages. Replace with backend data later.
const messagesByUser = ref({})

// For new users, create a new empty chat history on first chat
watch(selectedContact, (newContact) => {
  if (newContact && !messagesByUser.value[newContact.id]) {
    messagesByUser.value[newContact.id] = []
  }
})

// --- For future backend integration ---
// When backend is ready, fetch messages for selectedContact from API
/*
const messages = ref([])
watch(selectedContact, async (newContact) => {
  if (newContact) {
    // Fetch messages for newContact.id from backend
    // const response = await fetch(`/api/messages?userId=${newContact.id}`)
    // messages.value = await response.json()
  }
})
*/
// ---

// ... existing code ...
// In the template, comment out the hardcoded chat history and add:
//
// <!--
//   Hardcoded chat history for reference:
//   ... (your current hardcoded chat window markup here) ...
// -->
//
// Dynamic chat window for selected user:
//
// <div v-if="selectedContact">
//   <div class="text-h6 col">{{ selectedContact.name }}</div>
//   <div v-for="msg in messagesByUser[selectedContact.id]" :key="msg.id" class="q-mb-md">
//     <div>
//       <strong>{{ msg.sender }}</strong>
//       <span class="text-caption text-grey">{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
//     </div>
//     <div v-html="renderMarkdown(msg.text)"></div>
//   </div>
// </div>
// <div v-else>
//   <div class="text-h6 col">Select a contact to start chatting</div>
// </div>
//
// ---
// For sending messages, you can push to messagesByUser[selectedContact.id] for testing.

const filteredRecentChats = computed(() => {
  if (!filterText.value) return recentChats.value
  return recentChats.value.filter((contact) =>
    contact.name.toLowerCase().includes(filterText.value.toLowerCase()),
  )
})
</script>

<style type="scss">
/* Markdown styles [Start] */
.markdown-container {
  p {
    margin: 0 !important;
    padding: 0 !important;
  }
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    padding: 0;
    line-height: 1.2;
  }
  h2 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  h3 {
    font-size: 1.125rem;
    font-weight: bold;
  }
  h4 {
    font-size: 1rem;
    font-weight: bold;
  }
  h5 {
    font-size: 0.875rem;
    font-weight: bold;
  }
  h6 {
    font-size: 0.75rem;
    font-weight: bold;
  }
  blockquote {
    border-left: 4px solid #ccc;
    padding-left: 1rem;
    margin: 0.5rem 0;
    font-style: italic;
  }
  pre {
    background-color: #e0e0e0; /* Changed background color for code blocks */
    padding: 0.25rem;
    border-radius: 4px;
    overflow-x: auto;
    code {
      font-family: monospace;
      white-space: pre-wrap;
    }
  }
  code {
    background-color: #e0e0e0; /* Changed background color for inline code */
    /* padding: 0.2rem 0.4rem; */
    border-radius: 4px;
    font-family: monospace;
  }
  img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 4px;
  }
  a {
    color: #027be3;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  ul,
  ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    li {
      margin: 0.25rem 0;
    }
  }
}
/* Markdown styles [End] */
</style>

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

.contact-scroll-area {
  height: calc(100vh - 190px);
  max-height: calc(100vh - 190px);
}

.message-scroll-area {
  height: calc(100vh - 288px);
  max-height: calc(100vh - 288px);
}

.text-white .q-item__label--caption {
  color: white;
}

.text-italic {
  font-style: italic;
}

.bookmarked-message {
  background-color: #fdfddd; /* Light yellow background */
  border-left: 4px solid #ffd700; /* Gold border on the left */
}

.date-header {
  padding: 5px 10px;
  display: inline-block;
  border-top: 1px dashed #ccc;
}

.date-header-text {
  padding: 5px 10px;
  font-size: 0.8rem;
  color: #666;
  background-color: #f0f0f0;
  text-align: center;
}

.message {
  /* background-color: #f0f0f0; */
  border-radius: 8px;
  /* max-width: 100%; */
  transition: background-color 0.22s ease;
}

.message:hover {
  background-color: #eee !important;
}

.bookmarked-message .message:hover {
  background-color: #f8f8e0 !important;
}

.message-container {
  position: relative;
}

.edit-button {
  right: 120px; /* Adjust as needed */
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.message-container:hover .edit-button {
  opacity: 1;
}

.delete-button {
  right: 0px;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.bookmark-button {
  right: 30px;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.forward-button {
  right: 60px; /* Adjust as needed */
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.reply-button {
  right: 90px;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.reaction-button {
  right: 120px;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.message-container:hover .reply-button,
.message-container:hover .forward-button,
.message-container:hover .delete-button,
.message-container:hover .reaction-button,
.message-container:hover .bookmark-button {
  opacity: 1;
}

.reaction-options {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  bottom: 30px;
  right: 90px;
  z-index: 10;
  display: flex;
  gap: 5px;
}

.reaction-option {
  font-size: 1.2rem;
  cursor: pointer;
}

.reactions {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.reaction {
  background-color: #eee;
  border-radius: 10px;
  padding: 2px 5px;
  font-size: 0.8rem;
}

.reaction-count {
  margin-left: 2px;
}

.active-markdown {
  color: #027be3; /* Example: Change color to blue */
}

.message-time {
  margin: 0;
}

.body--light .message-input-container {
  background-color: #fff;
}

.shortcut-tooltip {
  /* font-size: 0.8em; */
  color: yellow;
  margin-left: 5px;
}

.message-status {
  bottom: calc(50% - 12px);
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.message-container:hover .message-status {
  /* Don't show  message-status for the time being. */
  opacity: 0;
}
</style>
