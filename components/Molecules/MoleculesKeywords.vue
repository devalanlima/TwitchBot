<template>
  <div class="flex flex-col gap-5">
    <div class="card flex justify-content-center mx-auto">
        <SelectButton v-model="selectButtonValue" :options="options" aria-labelledby="basic" />
    </div>
    <div class="flex flex-col gap-5 justify-center items-center">
      <div class="flex flex-col gap-2 items-center w-full">
        Keywords:
        <MoleculesChips
        v-model:keyword-set="command.keywordSet.firstKeywordSet" 
        />
      </div>
      <i class="pi pi-plus" v-if="selectButtonValue === 'Keyword Pair'"></i>
      <div class="flex flex-col gap-2 items-center" v-if="selectButtonValue === 'Keyword Pair'">
        Keywords:
        <MoleculesChips         
        v-model:keyword-set="command.keywordSet.secondKeywordSet"
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

const backupSecondKeywordSet = ref();

interface Props {
  command: ChatCommand;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:commands": [value: typeof props.command]
}>();

const command = computed({
  get() {
    return props.command;
  },
  set(commands) {
    emit("update:commands", commands);
  },
});

onMounted(
  () => {
    if (command.value.keywordSet.secondKeywordSet) {
      selectButtonValue.value = 'Keyword Pair'
    };
    watch(
      selectButtonValue,
      (newValue) => {
        if (newValue === 'Single Keyword' && command.value.keywordSet.secondKeywordSet) {
          backupSecondKeywordSet.value = command.value.keywordSet.secondKeywordSet
          delete command.value.keywordSet.secondKeywordSet
        } else if (newValue === 'Keyword Pair') {
          command.value.keywordSet.secondKeywordSet = backupSecondKeywordSet.value
        };
      },
    );
  },
);
</script>
