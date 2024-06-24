<template>
  <div>
    <ul class="max-w-[334px] flex flex-col leading-[20px]">
      <template v-for="message in props.messages" :key="message.id">
        <li :id="message.id" class="py-1 px-5 font-Inter text-[13px]" :style="`background-color: ${message.user.username.color}1A`" >
          <AtomsTimeChat
            :time="message.time"
          />
          <AtomsChatUser
            :custom-user="message.user"
          />
          <AtomsChatMessage
            :message="message.message"
          />
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">

interface Props {
  messages: Array<MessageData>;
}

const props = defineProps<Props>();

</script>