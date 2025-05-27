import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
// import { LibSQLStore } from '@mastra/libsql';
import { UpstashStore } from '@mastra/upstash';
import { zenovaAgent } from './agents/ZenovaAgent';

// Ensure these environment variables are set in your Vercel project
const ZENOVA_MAIN_UPSTASH_URL = process.env.ZENOVA_MAIN_UPSTASH_URL || process.env.ZENOVA_UPSTASH_REDIS_REST_URL;
const ZENOVA_MAIN_UPSTASH_TOKEN = process.env.ZENOVA_MAIN_UPSTASH_TOKEN || process.env.ZENOVA_UPSTASH_REDIS_REST_TOKEN;

if (!ZENOVA_MAIN_UPSTASH_URL || !ZENOVA_MAIN_UPSTASH_TOKEN) {
  throw new Error(
    'Missing required Upstash credentials for main Mastra storage. Please set ZENOVA_MAIN_UPSTASH_URL and ZENOVA_MAIN_UPSTASH_TOKEN, or ensure ZENOVA_UPSTASH_REDIS_REST_URL and ZENOVA_UPSTASH_REDIS_REST_TOKEN are available.'
  );
}

export const mastra = new Mastra({
  // deployer: new VercelDeployer({
  //   projectName: process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID as string,
  //   teamSlug: process.env.NEXT_PUBLIC_VERCEL_TEAM_ID as string,
  //   token: process.env.NEXT_PUBLIC_VERCEL_TOKEN as string,
  // }),
  agents: { zenovaAgent },
  storage: new UpstashStore({
    url: ZENOVA_MAIN_UPSTASH_URL,
    token: ZENOVA_MAIN_UPSTASH_TOKEN,
    // You might want a specific prefix for the main store to avoid key collisions
    // with the UpstashStore used inside ZenovaAgent's memory, if they share the same DB.
    // prefix: "mastra_main:", 
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
