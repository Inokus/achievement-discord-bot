import axios from 'axios';

type GiphyClientType = {
  getRandomGif(keyword: string): Promise<any>;
};

class GiphyClient implements GiphyClientType {
  private apiKey: string;

  constructor() {
    const { GIPHY_API_KEY } = process.env;

    if (!GIPHY_API_KEY) {
      throw new Error('Provide GIPHY_API_KEY in your environment variables.');
    }

    this.apiKey = GIPHY_API_KEY;
  }

  public async getRandomGif(keyword: string) {
    const offset = Math.floor(Math.random() * 5000);
    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        api_key: this.apiKey,
        q: keyword,
        limit: 1,
        offset,
        rating: 'g',
        lang: 'en',
      },
    });

    const { data } = response;

    const gifUrl = data.data[0].images.original.url;
    return gifUrl;
  }
}

const giphyClient = new GiphyClient();

export default giphyClient;
export { GiphyClientType };
