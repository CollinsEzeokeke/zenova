
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';


import { zenovaAgent } from './agents/ZenovaAgent';

export const mastra = new Mastra({
  agents: { zenovaAgent },
 
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
