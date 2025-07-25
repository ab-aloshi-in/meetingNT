<template>
  <q-page class="q-pa-md">
    
    <div class="text-h5 q-mb-lg">Meet</div>
    <!-- Top Buttons -->
    
   <div class="row q-col-gutter-md q-mb-lg">
  <div class="col-auto">
    <q-btn
      label="Create a meeting link"
      class="bg-indigo text-white"
      outline
      icon="link"
      unelevated
      style="min-width: 250px"
       @click="showDialog = true"
    />
   <q-dialog v-model="showDialog">
  <q-card class="q-pa-md" style="min-width: 400px">
    <div class="text-h6 q-mb-md">Schedule a Meeting</div>

    <q-input 
    
      label="Meeting Title" 
      placeholder="Meeting with Aksa Eldhose"
      filled 
      dense 
    />

    <div class="q-mt-md row justify-end">
      <q-btn color="primary" label="Create and Copy Link" @click="createAndCopyLink" />
    </div>
  </q-card>
</q-dialog>
  </div>

  <div class="col-auto">
    <q-btn
      label="Schedule a meeting"
      class="text-dark"
      outline
      icon="event"
      unelevated
      style="min-width: 250px"
       to="/schedule-meet"
    />
  </div>

   <div class="col-auto">
    <q-btn
      label="Join with a meeting ID"
      class="text-dark"
      outline
      icon="tag"
      unelevated
      style="min-width: 250px"
      @click="showJoinDialog = true"
    />
  </div>

  <q-dialog v-model="showJoinDialog">
    <q-card class="q-pa-md" style="min-width: 400px">
      <div class="text-h6 q-mb-md">Join a meeting with an ID</div>

      <q-input
        v-model="meetingId"
        label="Type a meeting ID"
        filled
        dense
        type="number"
        class="q-mb-sm"
      />

      <q-input
        v-model="meetingPasscode"
        label="Type a meeting passcode"
        filled
        dense
        type="password"
      />

      <div class="q-mt-md row justify-end">
        <q-btn label="Join Meeting" color="primary" @click="joinMeeting" />
      </div>
    </q-card>
  </q-dialog>
</div>

    <!-- Meeting Links Card -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Meeting links</div>
        <div class="row items-center">
        
          <div>
            Quickly create, save, and share links with anyone. <br />
            <q-btn
              flat
              dense
              label="Learn more about meeting links"
              color="indigo"
              class="q-mt-sm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Scheduled Meetings -->
    <q-card>
      <q-card-section class="row justify-between items-center">
        <div class="text-subtitle1">Scheduled meetings</div>
        <q-btn flat dense icon="event" label="View in calendar" />
      </q-card-section>
      <q-separator />
      <q-card-section class="row items-center">
        <div class="col-6">
          <p>You don't have anything scheduled.</p>
        </div>
        <div class="col-6 text-right">
          <!-- Placeholder for image -->
          <q-img
            src="https://placeimg.com/200/100/tech"
            contain
            style="max-width: 200px;"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const showDialog = ref(false);
const showJoinDialog = ref(false)

</script>

<style scoped>
</style>
