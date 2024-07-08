<template>
  <div>
    <ul class="max-w-[367px] flex flex-col leading-[20px]">
      <template v-for="message in props.messages" :key="message.id">
        <li 
        :id="message.id" 
        class="py-1 px-5 font-Inter text-[14px]" 
        :class="message.user.isBot && 'border-r-2 border-white'"
        :style="`background-color: ${message.user.color}12`" 
        >
          <AtomsTimeChat
            :time="message.time"
          />
          <AtomsChatUser            
            :custom-user="message.user"
          />
          <AtomsChatMessage
            :chat-message="message.data"
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