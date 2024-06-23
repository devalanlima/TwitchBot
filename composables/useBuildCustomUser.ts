import type { ChatUser } from "@twurple/chat";

export default function useBuildChatUser(user: ChatUser) {
  const buildedUser: CustomUser = {
    badges: {
      isSubscriber: user.isSubscriber,
      isVip: user.isVip,
      isBroadcaster: user.isBroadcaster,
      isModerator: user.isMod,
      isFounder: user.isFounder,
      isArtist: user.isArtist,
    },
    username: {
      color: user.color,
      displayName: user.displayName,
    }
  }
  return buildedUser
}