<template>
  <template v-for="message in props.message">
    <span v-if="message.type === 'text'" class="break-words">
      {{ message.value }}
    </span>
    <span v-if="message.type === 'emote'" class="relative inline-flex items-center h-[13px] mx-[2px] w-[24px]">
      <img 
      v-tooltip.top="message.value.alt"
      class="absolute min-w-fit min-h-fit"
      :src="message.value.src" 
      :alt="message.value.alt"
      />
    </span>
  </template>
</template>

<script setup lang="ts">
interface Props {
  message: ParsedMessage;
}

const props = defineProps<Props>();

</script>
