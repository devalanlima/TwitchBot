<template>
<span v-for="message in props.chatMessage">
  <span v-if="message.type === 'text'" class="break-words">
    {{ message.value }}
  </span>
  <span class="relative max-h-[13px] inline-flex">
    <span class="absolute h-[20px] inline-flex items-center">
      <img
      v-if="message.type === 'emote'"
      class="w-fit h-fit opacity-100"
      v-tooltip.top="message.value.alt"
      :src="message.value.src"
      :alt="message.value.alt"
    />
    </span>
    <img
        v-if="message.type === 'emote'"
        class="min-w-fit min-h-fit opacity-0"
        v-tooltip.top="message.value.alt"
        :src="message.value.src"
        :alt="message.value.alt"
      />
  </span>
</span>

</template>
  
<script setup lang="ts">

interface Props {
  chatMessage: ParsedMessage;
}

const props = defineProps<Props>();

</script>