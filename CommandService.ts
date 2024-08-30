import {Attachment, EmbedBuilder, Message} from 'discord.js';
import {guides} from './guide';
import GeminiService from './GeminiService';
import fs from 'fs';
import GiphyService from './GiphyService';

class CommandService {
  private readonly geminiService: GeminiService;
  private readonly giphy: GiphyService;
  constructor(private message: Message) {
    this.geminiService = new GeminiService();
    this.giphy = new GiphyService();
  }
  private parseCommand(message: string[]): string {
    message.shift();
    const command = message.join(' ');

    return command;
  }

  async showGuide() {
    const embed = new EmbedBuilder({
      title: 'Gifjira commands',
      fields: guides,
    });

    await this.message.channel.send({embeds: [embed]});
  }

  async generateText(message: string[]): Promise<void> {
    try {
      const prompt = this.parseCommand(message);
      const text = await this.geminiService.generateText(prompt);

      this.message.reply(text);
    } catch (error) {
      throw new Error('Something went wrong...');
    }
  }

  async imageIdentification(
    message: string[],
    attachment: Attachment
  ): Promise<void> {
    try {
      const prompt = this.parseCommand(message);
      const text = await this.geminiService.recognizeImg(prompt, attachment);

      this.message.reply(text);
    } catch (error) {
      console.log(error);
      throw new Error('Something went wrong');
    } finally {
      const path = `./temp/${attachment.name}`;
      fs.existsSync(path) && fs.unlinkSync(path);
    }
  }

  async sendGif(message: string[]) {
    try {
      const query = this.parseCommand(message);
      const gifUrl = await this.giphy.searchGIF(query);

      await this.message.channel.send(gifUrl);
    } catch (error) {
      throw new Error('Something went wrong');
    }
  }
}

export default CommandService;
