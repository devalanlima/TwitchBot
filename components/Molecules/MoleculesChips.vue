<template>
  <div class="flex flex-col gap-2">
    <Chips class="w-full" v-model="keywordSet" :max="10" @add="onAdd" @remove="onRemove"  :invalid="isInvalid">
      <template #chip="slotProps">
        <div class="flex gap-1 items-center justify-between">
          <Checkbox v-model="slotProps.value.isExact" :binary="true" v-tooltip.top="toolTipText" />
          <span class="max-w-[455px] break-all">{{ slotProps.value.keyword }}</span>
        </div>      
      </template>
    </Chips>
  </div>
  </template>
  
  <script setup lang="ts">
  import type { ChipsAddEvent } from 'primevue/chips';
  
  interface Props {
    keywordSet: Array<Keyword> | undefined;
  };
  
  const props = defineProps<Props>();
  
  const emit = defineEmits(["updateValue"]);
  
  const keywordSet = ref(props.keywordSet);
  
  const isInvalid = ref<boolean>(false);
  
  const onAdd = (event: ChipsAddEvent) => {
    let keywordAlreadyExists = false;
    keywordSet.value?.filter(keyword => {
      if (keyword.keyword === event.value[event.value.length -1]) {
        keywordAlreadyExists = true;
      }
    })
    if (keywordAlreadyExists) {
      alert('Keyword already exists, try a different one')
      setTimeout(() => {
        keywordSet.value?.pop()
      }, 0);
    } else {
      event.value[event.value.length -1] = {
        isExact: false,
        keyword: event.value[event.value.length -1]
      } 
      emit("updateValue", keywordSet.value);
    } 
  }
  
  const onRemove = () =>{
    emit("updateValue", keywordSet.value);
  }
  
  const toolTipText = `Exact Match
  
  Check this option if you want your keyword to correspond exactly with the written phrase.
  
  For example, your keyword is 'car', if you check this option it will behave like this:
  
  'I like carrots' (Not accurate, won't work).
  
  'The car is blue' (It's accurate, it will work).`;
  
  </script>
  