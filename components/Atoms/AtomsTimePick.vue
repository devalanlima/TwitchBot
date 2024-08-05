<template>
  <div class="border-[1px] border-[var(--primary-color)] rounded-lg p-2 text-[var(--primary-color)] flex itetimeValue-center gap-1">
    <div>
      <select
      name="hours"
      class="bg-transparent outline-none appearance-none"
      v-model="hours"
      >
        <option
        v-for="value in 24"
        :value="value - 1"
        class="bg-[var(--surface-ground)]"
        >
          {{ (value - 1).toString().padStart(2, '0') }}
        </option>
      </select>
      <span>:</span>
      <select
      name="minutes"
      class="bg-transparent outline-none appearance-none"
      v-model="minutes"
      >
        <option
        v-for="value in 60"
        :value="value - 1"
        class="bg-[var(--surface-ground)]"
        >
          {{ (value - 1).toString().padStart(2, '0') }}
        </option>
      </select>
      <span>:</span>
      <select
      name="seconds"
      class="bg-transparent outline-none appearance-none"
      v-model="seconds"
      >
        <option
        v-for="value in 59"
        :value="value"
        class="bg-[var(--surface-ground)]"
        >
          {{ (value).toString().padStart(2, '0') }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hours: number;
  minutes: number;
  seconds: number;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:hours': [value: typeof props.hours],
  'update:minutes': [value: typeof props.minutes],
  'update:seconds': [value: typeof props.seconds]
}>();

const hours = computed({
  get() {
    return props.hours
  },
  set(hours) {
    emit('update:hours', hours)
  },
});

const minutes = computed({
  get() {
    return props.minutes;
  },
  set(minutes) {
    emit('update:minutes', minutes);
  },
});

const seconds = computed({
  get() {
    return props.seconds;
  },
  set(seconds) {
    emit('update:seconds', seconds);
  },
});

</script>