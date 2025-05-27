import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { VercelDeployer} from '@mastra/deployer-vercel';
import { zenovaAgent } from './agents/ZenovaAgent';

export const mastra = new Mastra({
  deployer: new VercelDeployer({
    projectName: process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID as string,
    teamSlug: process.env.NEXT_PUBLIC_VERCEL_TEAM_ID as string,
    token: process.env.NEXT_PUBLIC_VERCEL_TOKEN as string,
  }),
  agents: { zenovaAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
