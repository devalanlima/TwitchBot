import { EmoteFetcher, EmoteParser } from "@mkody/twitch-emoticons";
import { ApiClient } from "@twurple/api";
import { buildEmoteImageUrl, type ParsedMessagePart } from "@twurple/chat";

export default async function useParseChatMessage(channelId: number, parsedMessagePart: Array<ParsedMessagePart>) {

  let text = '';

  parsedMessagePart.map((response) => {
    if (response.type === 'text') {
      text += response.text;
    } else if (response.type === 'emote') {
      if (response.id) {
        text += `<img alt="${response.name}" src="${buildEmoteImageUrl(response.id)}">`;
      };
    };
  });

  const { $authProvider: authProvider } = useNuxtApp();

  const apiClient = authProvider && new ApiClient({ authProvider });

  // @ts-ignore
  const fetcher = new EmoteFetcher(null, null,{
    apiClient: apiClient,
  });  

  const parser = new EmoteParser(fetcher, {
    template: '<img alt="{name}" src="{link}">',
    match: /(?<!alt=")(\w+)(?!")/g,
  });

  const finalMessage = await Promise.all([
    fetcher.fetchTwitchEmotes(),
    fetcher.fetchTwitchEmotes(channelId),
    fetcher.fetchBTTVEmotes(),
    fetcher.fetchBTTVEmotes(channelId),
    fetcher.fetchSevenTVEmotes(),
    fetcher.fetchFFZEmotes(),
    fetcher.fetchFFZEmotes(channelId),
    fetcher.fetchSevenTVEmotes(),
    fetcher.fetchSevenTVEmotes(channelId, 'webp'),
  ]).then(() => {
    let result: ParsedMessage = [];
    let parsedText = parser.parse(text);
    
    const regex = /<img alt="([^"]+)" src="([^"]+)">/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(parsedText)) !== null) {
      if (match.index > lastIndex) {
        result.push({
          type: 'text',
          value: parsedText.slice(lastIndex, match.index),
        });
      }
      result.push({
        type: 'emote',
        value: {
          src: match[2],
          alt: match[1],
        }
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < parsedText.length) {
      result.push({
        type: 'text',
        value: parsedText.slice(lastIndex),
      });
    }
    
    return result;
    
  }).catch(err => {
    console.error('Error loading emotes...');
    console.error(err);
  });

  return finalMessage;
}