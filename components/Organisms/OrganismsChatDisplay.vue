<template>
  <div class="h-screen">
    {{ inputValue }}
    <TabView
    v-model:activeIndex="active"
    class="w-[349px] organisms-chat-display" 
    :scrollable="true"
    @mouseenter="isMouseOver = true" 
    @mouseleave="isMouseOver = false"
    >
      <TabPanel v-for="channel in currentChannels" :key="channel">
        <template #header>
            <div class="flex gap-2">
              <span>{{ channel.slice(1) }}</span>
              <button class="hover:text-red-500" @click="leaveChannel(channel)">
                <i class="pi pi-times text-[11px]"></i>
              </button>
            </div>
        </template>
        <MoleculesChatMessages
        :currentChannel="channel.slice(1)"
        :messages="messages.find(currentChannel => currentChannel.hasOwnProperty(channel)) ? messages[messages.findIndex(currentChannel => currentChannel.hasOwnProperty(channel))][channel] : []"
        />
      </TabPanel>
      <TabPanel v-if="loading">
        <template #header>
          <ProgressSpinner           
            style="width: 18px; height: 18px" 
            strokeWidth="8" 
            animationDuration=".5s" 
            aria-label="Custom ProgressSpinner" 
          />
        </template>
      </TabPanel>
      <TabPanel v-if="messages.length < 3">
        <template #header>
            <div class="flex gap-2">
              <AtomsBaseInput
                :focus="true"
                v-if="isAddingChannel"
                @input-value="handleChannelName"
              />
              <i v-else class="pi pi-plus"></i>
            </div>
        </template>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">

import { useGlobalStore } from '~/store/useGlobalStore';

const { $chatClient } = useNuxtApp();

const globalStore = useGlobalStore();

const messages = computed(()=>globalStore.messages);
const currentChannels = computed<Array<string>>(()=> globalStore.currentChannels);

const channelsToAdd = ref<Array<string>>([]);

const active = ref<number>(0);

const isAddingChannel = ref<boolean>(true);

const leaveChannel = (channel: string) => {
  useLeaveChat($chatClient, channel);
}

const inputValue = ref<string>();

const handleChannelName = (message: string) => {
  inputValue.value = message.toLowerCase().trim();
}

const loading = ref();

const channelCookies = useCookie<Array<string>>('channelCookies');

const element = ref<NodeListOf<HTMLElement> | null>(null);
  
const isMouseOver = ref<boolean>(false);

onMounted(()=>{
  active.value = currentChannels.value.length - 2

  element.value = document.querySelectorAll('.organisms-chat-display .p-tabview-panels');

  if (channelCookies.value) {    
    channelCookies.value;
    useJoinSeveralChats($chatClient, channelCookies.value);
  }

  watch(()=> active.value, (newValue)=>{
    if (newValue === currentChannels.value.length) {
      isAddingChannel.value = true;
    } else {
      isAddingChannel.value = false;
    };

    setTimeout(() => {
      element.value?.forEach(function(element) {
        element.scrollTop = element.scrollHeight;
      });
    }, 0);
  });

  watch(()=> inputValue.value, (newValue) => {
    if (newValue) {
      channelsToAdd.value.push(`#${newValue}`);
      loading.value = useJoinSeveralChats($chatClient, channelsToAdd.value);
    };
      channelsToAdd.value = [];
      isAddingChannel.value = false;
      inputValue.value = "";
  });

  watch(()=> globalStore.currentChannels, (newValue)=>{
    loading.value = false
    element.value = document.querySelectorAll('.organisms-chat-display .p-tabview-panels');
    if (newValue.length === 0) {
      isAddingChannel.value = true;
    }
    active.value = (currentChannels.value.length -1);
  })

  watch(globalStore.messages, ()=>{
    if (!isMouseOver.value) {
      setTimeout(() => {
        element.value?.forEach(function(element) {
          element.scrollTop = element.scrollHeight;
        });
      }, 0);    
    }
  });
});

</script>

<style>
.organisms-chat-display .p-tabview-panels{
  @apply p-0;
}

.organisms-chat-display{
    @apply h-full min-h-[120px];
}

.organisms-chat-display .p-tabview-panels{
  @apply overflow-y-scroll min-h-[120px] rounded-none h-[calc(100%_-60px)];
}

</style>
