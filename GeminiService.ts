import {GoogleGenerativeAI} from '@google/generative-ai';
import {GoogleAIFileManager} from '@google/generative-ai/server';
import {DownloaderHelper} from 'node-downloader-helper';
import {Attachment} from 'discord.js';
import configs from './configs';

const genAI = new GoogleGenerativeAI(configs.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {maxOutputTokens: 400},
});
const fileManager = new GoogleAIFileManager(configs.GEMINI_API_KEY);

export type TFile = {
  fileUri: string;
  mimeType: string;
};

class GeminiService {
  private async downloadFile(url: string, filename: string) {
    const dl = new DownloaderHelper(url, './temp', {fileName: filename});
    dl.on('end', () => console.log('Download complete'));
    await dl.start();
  }

  private async uploadFile(url: string, filename: string): Promise<TFile> {
    await this.downloadFile(url, filename);
    const path = `./temp/${filename}`;

    const result = await fileManager.uploadFile(path, {
      mimeType: 'image/jpeg',
    });

    return {
      fileUri: result.file.uri,
      mimeType: result.file.mimeType,
    };
  }

  async generateText(prompt: string): Promise<string> {
    const result = await model.generateContent(prompt);
    const response = result.response;

    return response.text();
  }

  async recognizeImg(prompt: string, attachment: Attachment): Promise<string> {
    const fileData: TFile = await this.uploadFile(
      attachment.url,
      attachment.name
    );
    try {
      const result = await model.generateContent([prompt, {fileData}]);
      return result.response.text();
    } catch (error) {
      return 'sorry something went wrong';
    }
  }
}

export default GeminiService;
