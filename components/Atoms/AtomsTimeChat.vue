<template>
  <span class="font-Inter mr-[4px] font-thin opacity-50">{{ time }}</span>
</template>

<script setup lang="ts">
interface Props {
  time: Date
}

const props = defineProps<Props>();

const hour = props.time.getHours().toString().padStart(2, '0');
const min = props.time.getMinutes().toString().padStart(2, '0');

const time = `${hour}:${min}`

</script>
