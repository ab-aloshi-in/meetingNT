import { ref, onUnmounted } from 'vue'

const socket = ref(null)
const isConnected = ref(false)
const connectionError = ref(null)

export function useSocket() {
  function connect() {
    if (socket.value?.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket already connected')
      return
    }

    // Get the token from the session_id cookie
    const token = getCookieValue('session_id')
    console.log(
      '🔍 Token from session_id cookie:',
      token ? token.substring(0, 30) + '...' : 'NO TOKEN',
    )

    if (!token) {
      console.error('❌ No session_id cookie found. Please log in first.')
      connectionError.value = 'No authentication token found'
      return
    }

    // Create WebSocket URL with token
    const wsUrl = `wss://192.168.0.206/api/v1.0/chat/ws?token=${encodeURIComponent(token)}`
    console.log('🔍 Connecting to WebSocket...')

    try {
      socket.value = new WebSocket(wsUrl)

      socket.value.onopen = () => {
        console.log('✅ WebSocket connected successfully')
        isConnected.value = true
        connectionError.value = null
      }

      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📨 Received WebSocket message:', data)

          // Emit custom event for message handling
          window.dispatchEvent(new CustomEvent('websocket-message', { detail: data }))
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error)
        }
      }

      socket.value.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        connectionError.value = 'WebSocket connection error'
        isConnected.value = false
      }

      socket.value.onclose = (event) => {
        console.log('⚠️ WebSocket disconnected. Code:', event.code, 'Reason:', event.reason)
        isConnected.value = false

        // Attempt to reconnect after 3 seconds if not a normal closure
        if (event.code !== 1000 && event.code !== 1001) {
          setTimeout(() => {
            console.log('🔄 Attempting to reconnect...')
            connect()
          }, 3000)
        }
      }
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error)
      connectionError.value = 'Failed to create WebSocket connection'
    }
  }

  function disconnect() {
    if (socket.value) {
      socket.value.close(1000, 'User initiated disconnect')
      socket.value = null
      isConnected.value = false
    }
  }

  function send(data) {
    if (socket.value?.readyState === WebSocket.OPEN) {
      try {
        const jsonData = JSON.stringify(data)
        socket.value.send(jsonData)
        console.log('📤 Sent WebSocket message:', data)
        return true
      } catch (error) {
        console.error('❌ Failed to send WebSocket message:', error)
        return false
      }
    } else {
      console.warn('⚠️ WebSocket is not connected. Cannot send message:', data)
      return false
    }
  }

  function on(eventType, handler) {
    if (eventType === 'message') {
      const messageHandler = (event) => handler(event.detail)
      window.addEventListener('websocket-message', messageHandler)

      // Return cleanup function
      return () => window.removeEventListener('websocket-message', messageHandler)
    }
  }

  function off(eventType, handler) {
    if (eventType === 'message') {
      window.removeEventListener('websocket-message', handler)
    }
  }

  function emit(eventType, data) {
    // For compatibility - just send the data
    return send(data)
  }

  // Helper function to get cookie value
  function getCookieValue(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connectionError,
    connect,
    disconnect,
    send,
    on,
    off,
    emit,
  }
}
