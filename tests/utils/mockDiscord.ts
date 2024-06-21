import type { DiscordClientType } from '@/modules/discord';

class MockDiscordClient implements DiscordClientType {
  public getUserByUsername = vi.fn(async (username: string) => {
    if (['john', 'bob'].includes(username)) {
      return { user: { username, id: '12345' } };
    }
  });
  public sendAccomplishment = vi.fn(
    async (message: string, gifUrl: string) => {}
  );
  public onReady = vi.fn((callback: () => void) => {
    callback();
  });
}

const mockDiscordClient = new MockDiscordClient();

export default mockDiscordClient;
