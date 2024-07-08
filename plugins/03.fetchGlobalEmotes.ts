export default defineNuxtPlugin (async (nuxtApp)=>{
  const url = 'https://emotes.adamcy.pl/v1/global/emotes/twitch.7tv.bttv.ffz';
  const options = {method: 'GET', headers: {Accept: 'application/json'}};

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    useLocalStorage('globalEmotes', data);
  } catch (error) {
    console.error(error);
  };
});