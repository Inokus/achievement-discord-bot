import { Client, GatewayIntentBits, Guild, TextChannel } from 'discord.js';

class DiscordClient {
  private client: Client;

  private guild: Guild | null = null;

  private channel: TextChannel | null = null;

  constructor() {
    const { DISCORD_TOKEN } = process.env;

    if (!DISCORD_TOKEN) {
      throw new Error('Provide DISCORD_TOKEN in your environment variables.');
    }

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client.on('ready', () => {
      this.guild = this.getGuild();

      // default channel name is set to accomplishments, but we can pass different name into getChannelByName
      this.channel = this.getChannelByName();
    });

    this.client.login(DISCORD_TOKEN);
  }

  private getGuild(): Guild {
    const guild = this.client.guilds.cache.first();

    if (!guild) {
      throw new Error("Discord bot couldn't find any guild information.");
    }

    return guild;
  }

  private getChannelByName(
    channelName: string = 'accomplishments'
  ): TextChannel {
    const channel = this.guild?.channels.cache.find(
      (ch) => ch.name === channelName && ch.isTextBased()
    );

    if (!channel) {
      throw new Error(
        "Discord bot couldn't find any channels with provided name."
      );
    }

    return channel as TextChannel;
  }

  public async getUserByUsername(username: string) {
    const users = await this.guild?.members.fetch();
    const user = users?.find((member) => member.user.username === username);
    return user;
  }

  public async sendAccomplishment(
    message: string,
    gifUrl: string
  ): Promise<void> {
    if (gifUrl) {
      this.channel?.send({
        content: message,
        files: [gifUrl],
      });
    } else {
      this.channel?.send(message);
    }
  }

  public onReady(callback: () => void): void {
    this.client.on('ready', callback);
  }
}

const discordClient = new DiscordClient();

export default discordClient;
