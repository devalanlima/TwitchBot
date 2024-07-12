<template>
  <div class="molecules-responses">
    <DataTable :value="command.responses" scrollable scrollHeight="300px">
      <Column>
        <template #body="slotProps">
          <div class="flex justify-between items-center">
            <p>{{ slotProps.data.response }}</p>
            <Button rounded text severity="danger" @click="removeResponse(slotProps.data.id)">
              <i class="pi pi-times text-[12px]"></i>
            </Button>
          </div>
        </template>
      </Column>
      <template #footer>       
        <div class="mt-5 flex w-full justify-between items-center gap-2">
          <FloatLabel class="w-full">
            <InputText 
            id="floatLabel"
            class="w-full" 
            v-model="inputValue"
            @keyup.enter="updateInputValue"
            />
            <label for="floatLabel" class="font-normal opacity-75">New response</label>
          </FloatLabel>
          <i class="pi pi-question-circle text-lg" v-tooltip.top="responseTextInfo" ></i>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import FloatLabel from 'primevue/floatlabel';

const responseTextInfo = `The response for when the command is activated.

If there is more than one response, it will be chosen randomly whenever the command is triggered.
`

interface Props {
  command: ChatCommand;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:responses": [value: typeof props.command]
}>()

const command = computed({
  get() {
    return props.command
  },
  set(command) {
    emit('update:responses', command)
  }
})

const removeResponse = (id: number) => { 
  command.value.responses = command.value.responses.filter(response => response.id !== id);
};

const $bodyResponse = ref<HTMLElement | null>(null);

onMounted(()=>{
  $bodyResponse.value = document.querySelector('.molecules-responses .p-datatable-tbody');
});

watch(
  () => command.value.responses,
  (newValue) => {
    if (newValue.length === 0) {
      $bodyResponse.value?.classList.add('hidden');
    } else {
      $bodyResponse.value?.classList.remove('hidden');
    }
  },
  { deep: true },
);

const inputValue = ref();

const updateInputValue = () => {
  const id = () => {
    if (command.value.responses.length === 0) {
      return 0;
    } else {
      return command.value.responses[command.value.responses.length - 1].id + 1;
    };
  };

  command.value.responses.push({
    id: id(),
    response: inputValue.value,
  });

  inputValue.value = "";
}

</script>