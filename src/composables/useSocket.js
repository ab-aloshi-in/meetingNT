     import { io } from 'socket.io-client'
     import { ref } from 'vue'

     const socket = ref(null)

     export function useSocket() {
       function connect() {
         if (!socket.value) {
           socket.value = io('ws://localhost:3000', {
             transports: ['websocket']
           })
         }
       }
       function disconnect() {
         if (socket.value) {
           socket.value.disconnect()
           socket.value = null
         }
       }
       function on(event, handler) {
         if (socket.value) socket.value.on(event, handler)
       }
       function off(event, handler) {
         if (socket.value) socket.value.off(event, handler)
       }
       function emit(event, data) {
         if (socket.value) socket.value.emit(event, data)
       }
       return { socket, connect, disconnect, on, off, emit }
     }