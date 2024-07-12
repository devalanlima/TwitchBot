<template>
    <input
    ref="$input"
    class="outline-none placeholder:opacity-60 placeholder:font-thin"
    autofocus
    :class="inputValue.length === 0 && 'animate-pulse'"
    v-model="inputValue"
    @keyup.enter="updateValue"
    />
</template>

<script setup lang="ts">
interface Props {
  focus?: boolean;
}

const inputValue = ref('');
const updatedValue = ref('');

const emit = defineEmits(['inputValue']);
const updateValue = useDebounceFn(() => {
  updatedValue.value = inputValue.value;
  emit('inputValue', updatedValue.value);
}, 100)

const $input = ref<HTMLInputElement | null>(null);
const { focused } = useFocus($input);

const props = defineProps<Props>();

onMounted(()=>{
  focused.value = props.focus
})

onClickOutside($input, ()=>{
  updateValue();
})

</script>