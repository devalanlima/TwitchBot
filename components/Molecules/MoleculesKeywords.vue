<template>
  <div class="flex flex-col gap-5">
    <div class="card flex justify-content-center mx-auto">
        <SelectButton v-model="selectButtonValue" :options="options" aria-labelledby="basic" />
    </div>
    <div class="flex flex-col gap-5 justify-center items-center">
      <div class="flex flex-col gap-2 items-center w-full">
        Keywords:
        <MoleculesChips
        :keyword-set="command.keywordSet.firstKeywordSet" 
        @update-value="(updatedValue: Array<Keyword>) => {
          command.keywordSet.firstKeywordSet = updatedValue
        }"
        />
      </div>
      <i class="pi pi-plus" v-if="selectButtonValue === 'Keyword Pair'"></i>
      <div class="flex flex-col gap-2 items-center" v-if="selectButtonValue === 'Keyword Pair'">
        Keywords:
        <MoleculesChips         
        :keyword-set="command.keywordSet.secondKeywordSet" 
        @update-value="(updatedValue: Array<Keyword>) => {
          command.keywordSet.secondKeywordSet = updatedValue
        }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MoleculesChips from './MoleculesChips.vue';

type SelecButton = 'Single Keyword' | 'Keyword Pair';

const selectButtonValue = ref<SelecButton>('Single Keyword');
const options = ref<Array<SelecButton>>(['Single Keyword', 'Keyword Pair']);

watch(
  () => selectButtonValue.value,
  (newValue) => {
    if (newValue === 'Single Keyword' && command.value.keywordSet.secondKeywordSet) {
      delete command.value.keywordSet.secondKeywordSet
    }
  }
)

interface Props {
  command: ChatCommand;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:commands": [value: typeof props.command]
}>();

const command = computed({
  get() {
    return props.command
  },
  set(commands) {
    emit("update:commands", commands)
  }
})
</script>
