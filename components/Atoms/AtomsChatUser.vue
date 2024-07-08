<template>
  <span class="relative">
    <span class="inline-flex absolute top-0 w-fit gap-[2px] mr-[2px] items-start">
      <template v-for="badge in badgePaths">
        <Image 
          v-tooltip.top="badge.alt"
          v-if="badge.exist" 
          :src="badge.url" 
          :alt="badge.alt" 
          class="w-[15px] h-[15px]"
        />
      </template>
    </span>

    <span class="inline-flex gap-[2px] mr-[2px]">
      <template v-for="badge in badgePaths">
        <div v-if="badge.exist" class="w-[15px] h-[15px]"></div>
      </template>
    </span>

    <span :style="`color: ${user.color}`" class="font-semibold self-start">
      {{ user.displayName }}:
    </span>
  </span>
</template>

<script setup lang="ts">
interface Props {
  customUser: CustomUser;
};

const props = defineProps<Props>();
const user = props.customUser;

const badgePaths = [
  {
    alt: 'Broadcaster',
    exist: user.isBroadcaster,
    url: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1',
  },
  {
    alt: 'Moderator',
    exist: user.isMod,
    url: 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1',
  },
  {
    alt: 'Subscriber',
    exist: user.isSubscriber,
    url: 'https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1',
  },
  {
    alt: 'Vip',
    exist: user.isVip,
    url: 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1',
  },
  {
    alt: 'Founder',
    exist: user.isFounder,
    url: 'https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/1',
  },
  {
    alt: 'Artist',
    exist: user.isArtist,
    url: 'https://assets.help.twitch.tv/article/img/000002399-05.png',
  },
  {
    alt: "Bot",
    exist: user.isBot,
    url: '/botBadge.png'
  },
];
</script>