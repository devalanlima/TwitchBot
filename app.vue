<template>
  <div class="flex flex-col gap-10 pt-10">
    <div class="mx-auto w-fit">
      <Button @click="checked = !checked" />
    </div>
    <div :class="['block w-32 h-32 mx-auto rounded-2xl outline outline-[3px] outline-[var(--surface-d)]', checked ? 'bg-[var(--surface-d)]' : 'bg-[var(--surface-e)]']"/>
  </div>
</template>

<script setup lang="ts">
const checked = ref(true)
</script>
