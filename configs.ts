import {config} from 'dotenv';

config();

export default {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
  GIPHY_API_KEY: process.env.GIPHY_API_KEY as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  GIPHY_API_URL: process.env.GIPHY_API_URL as string,
};
