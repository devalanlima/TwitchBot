<template>
  <div class="h-screen bg-[var(--surface-f)]">
    <TabView
    v-model:activeIndex="active"
    class="w-full organisms-chat-display min-h-[120px]" 
    :style="`height: calc(100% - ${height + 16}px)`"
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
        class="mx-auto w-full"
          v-if="globalStore.chatMessages[channel.slice(1)]"
          :messages="globalStore.chatMessages[channel.slice(1)]"
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
      <TabPanel v-if="globalStore.currentChannels.length < 3">
        <template #header>
            <div class="flex gap-2">
              <AtomsBaseInput
                :focus="true"
                v-if="isAddingChannel"
                @input-value="handleChannelName"
              />
              <i v-else class="pi pi-plus text-lg"></i>
            </div>
        </template>
      </TabPanel>
    </TabView>

    <div>
      <AtomsSendMessage
      ref="$atomsSendMessage"
      @input-value="handleTextAreaMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import type { ChatClient } from '@twurple/chat';
import { useGlobalStore } from '~/store/useGlobalStore';

const { $chatClient } = useNuxtApp();

const chatClient = $chatClient as ChatClient;

const globalStore = useGlobalStore();

const currentChannels = computed<Array<string>>(()=> globalStore.currentChannels);

const channelsToAdd = ref<Array<string>>([]);

const active = ref<number>(0);

const isAddingChannel = ref<boolean>(true);

const leaveChannel = (channel: string) => {
  useLeaveChat(chatClient, channel);
}

const inputValue = ref<string>();

const handleChannelName = (message: string) => {
  inputValue.value = message.toLowerCase().trim();
}

const loading = ref();

const channelCookies = useCookie<Array<string>>('channelCookies');

const element = ref<HTMLElement | null>(null);
  
const isMouseOver = ref<boolean>(false);


const $atomsSendMessage = ref<HTMLElement | null>(null);
const { height } = useElementSize($atomsSendMessage)

onMounted(()=>{
  element.value = document.querySelector('.p-tabview-panels');
  active.value = currentChannels.value.length - 2;

  if (channelCookies.value) {    
    channelCookies.value;
    useJoinSeveralChats(chatClient, channelCookies.value);
  }

  watch(()=> active.value, (newValue)=>{
    if (newValue === currentChannels.value.length) {
      isAddingChannel.value = true;
    } else if(currentChannels.value.length > 0) {
      isAddingChannel.value = false;
    };

    setTimeout(() => {
      if (element.value) {
        element.value.scrollTop = element.value.scrollHeight;
      };
    }, 0);  
  });

  watch(()=> inputValue.value, (newValue) => {
    if (newValue) {
      channelsToAdd.value.push(`#${newValue}`);
      loading.value = useJoinSeveralChats(chatClient, channelsToAdd.value);
    };
      channelsToAdd.value = [];
      isAddingChannel.value = false;
      inputValue.value = "";
  });

  watch(()=> globalStore.currentChannels, (newValue)=>{
    loading.value = false;
    if (newValue.length === 0) {
      isAddingChannel.value = true;
    }
    active.value = (currentChannels.value.length -1);
  });

});

watch(
  () => globalStore.chatMessages,
  () => {
    setTimeout(() => {
      if (element.value && !isMouseOver.value) {
        element.value.scrollTop = element.value.scrollHeight;
      }
    }, 0);  
  },
  { deep: true }
);

const handleTextAreaMessage = (message: string) => {
  const channel = currentChannels.value[active.value].slice(1); 
  useSayChat(chatClient, message, channel);
}

</script>

<style>

.organisms-chat-display .p-tabview-panels{
  @apply p-0;
}

.organisms-chat-display .p-tabview-panels{
  @apply overflow-y-scroll min-h-[120px] rounded-none h-[calc(100%_-60px)];
}

</style>
