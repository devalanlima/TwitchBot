<template>
  <div class="flex gap-3">
    <Button
    class="max-w-fit self-end"
    @click="emit('discard')"
    label="Discard"
    severity="danger"
    icon="pi pi-times"
    icon-pos="right"
    :disabled="props.discardDisabled"
    />
    <Button
    class="max-w-fit self-end"
    @click="emit('save')"
    label="Save"
    severity="success"
    :disabled="props.saveDisabled"
    />
  </div>
</template>

<script setup lang="ts">

interface Props {
  saveDisabled?: boolean
  discardDisabled?: boolean
}

const props = defineProps<Props>();
const emit = defineEmits(['save', 'discard'])

</script>
