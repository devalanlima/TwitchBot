<template>
  <div class="flex gap-2 items-center" @click.stop>
    <AtomsTimePick
    v-model:hours="hours"
    v-model:minutes="minutes"
    v-model:seconds="seconds"
    />
    <ToggleButton 
    v-model="toggleButtonOption" 
    v-tooltip.top="toggleButtonOption ? 'Switch to keyword mode' : 'Switch to timer mode'"
    onLabel="Timer" 
    offLabel="Keyword" 
    onIcon="pi pi-stopwatch" 
    offIcon="pi pi-clock" 
    :aria-label="toggleButtonOption ? 'Switch to keyword mode' : 'Switch to timer mode'" 
    />
    <i class="pi pi-question-circle text-lg" v-tooltip.top="typeSelectorInfo" ></i>
  </div>
</template>

<script setup lang="ts">

interface Props {
  timeSet: TimeSet;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:timeSet': [value: typeof props.timeSet],
}>();


const convertMilliseconds = (ms: number) => {
    const seconds: number = Math.floor(ms / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;

    return {
        hours: hours,
        minutes: remainingMinutes,
        seconds: remainingSeconds,
    };
}

const hours = ref(convertMilliseconds(props.timeSet.time).hours);
const minutes = ref(convertMilliseconds(props.timeSet.time).minutes);
const seconds = ref(convertMilliseconds(props.timeSet.time).seconds);

const toggleButtonOption = ref<boolean>(false);
const timeMode = computed<'keyword' | 'timer'>(() => {
  if (toggleButtonOption.value) {
    return 'timer';
  } else {
    return 'keyword';
  };
});


const timeSet = computed(()=>{
  const hoursInMs = hours.value * 60 * 60 * 1000;
  const minutesInMs = minutes.value * 60 * 1000 ;
  const secondsInMs = seconds.value * 1000;
  const totalTime = hoursInMs + minutesInMs + secondsInMs;

  return {
    mode: timeMode.value,
    time: totalTime,
  };
});

watch(
  () => timeSet.value,
  (newValue) => {    
    emit('update:timeSet', newValue);
  },
);

const typeSelectorInfo = `Timer mode: Command will always be triggered within a defined time interval.

Keyword mode: Command only will trigger with keywords (you can define a cooldown for that occurance).`;

</script>