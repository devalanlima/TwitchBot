<template>
  <div class="flex h-full gap-2 p-2 text-sm bg-[#282936]">
    <Textarea
    class="resize-none h-full w-full "
    v-model="inputValue" 
    @keyup.enter="updateValue" 
    :rows="inputValue.length === 0 ? 5 : 14" 
    cols="45" 
    maxlength="500" 
    />
    <div class="flex flex-col justify-end gap-3">
      <Button @click="updateValueWithoutReset" ><i class="pi pi-send"></i></Button>
      <Button><i class="pi pi-cog"></i></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const inputValue = ref('');
const updatedValue = ref('');

const emit = defineEmits(['inputValue']);

const updateValue = () => {
  updatedValue.value = inputValue.value;  
  updatedValue.value.trim().length > 0 && emit('inputValue', updatedValue.value);
  updatedValue.value = inputValue.value = ''
}

const updateValueWithoutReset = () => {
  updatedValue.value = inputValue.value;  
  updatedValue.value.trim().length > 0 && emit('inputValue', updatedValue.value);
}
</script>
