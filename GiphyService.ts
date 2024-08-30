import axios from 'axios';
import configs from './configs';

const api = axios.create({
  baseURL: configs.GIPHY_API_URL,
  params: {api_key: configs.GIPHY_API_KEY},
});

type TGif = {
  url: string;
};

class GiphyService {
  private getRandomIndex(length: number): number {
    const result = Math.floor(Math.random() * length);

    return result;
  }

  async searchGIF(q: string): Promise<string> {
    try {
      const {data} = await api.get('/search', {params: {q}});

      const gifs = data.data as TGif[];
      const randomIndex = this.getRandomIndex(gifs.length);

      return gifs[randomIndex].url;
    } catch (error) {
      throw new Error('Something went wrong');
    }
  }
}

export default GiphyService;
