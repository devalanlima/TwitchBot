<template>
  <span class="font-Inter mr-[2px] font-thin opacity-50">{{ props.time }}</span>
</template>

<script setup lang="ts">
interface Props {
  time: string
}

const props = defineProps<Props>();

</script>
