import { GiphyClientType } from '@/modules/giphy';

class MockGiphyClient implements GiphyClientType {
  public getRandomGif = vi.fn(async (keyword: string) => {
    return `https://mock-giphy-url.com/${keyword}.gif`;
  });
}

const mockGiphyClient = new MockGiphyClient();

export default mockGiphyClient;
