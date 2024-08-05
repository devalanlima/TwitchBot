<template>
  <div class="flex justify-between">
    <div>
      <OrganismsChatDisplay/>
    </div>

    <div>
      <OrganismsCommands/>
    </div>

    <div v-if="loggedIn">
      <h1>Welcome {{ userId }}!</h1>
      <p>Session expires in {{ session.user?.tokens.expires_in }}</p>
      <p>session: {{ user?.loggedInAt }}</p>
      <button @click="clear">Logout</button>      
    </div>

    <div v-else>
      <h1>Not logged in</h1>
      <a href="/auth/twitch">Login with Twitch</a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user, session, clear } = useUserSession();

const userId = user.value?.id;

</script>
