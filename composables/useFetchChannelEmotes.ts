export default async function useFetchChannelEmotes(channelId: string) {

  const providers = ['twitch', 'bttv', 'ffz', '7tv'];
  let params = [...providers];

  while (params.length > 0) {
    const url = `https://emotes.adamcy.pl/v1/channel/${channelId}/emotes/${params.join('.')}`;
    try {
      const options = { method: 'GET', headers: { Accept: 'application/json' } };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();

      localStorage.setItem(channelId, JSON.stringify(data));

      console.log('successful fetch');
      break; 
    } catch (error) {
      console.error(error);
      params.pop();
    }
  }

  if (params.length === 0) {
    console.error('Failed to fetch with all parameter combinations');
  }
}