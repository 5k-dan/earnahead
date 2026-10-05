import {z} from 'zod';
export const clickEvents=['EXPLORE_OPENED','OPPORTUNITY_OPENED','SAVE_CLICKED','PROVIDER_LINK_CLICKED','APPLICATION_TRACK_CLICKED'] as const;
export const activityInput=z.object({event:z.enum(clickEvents)}).strict();
export const activityLabels:Record<string,string>={ACCOUNT_CREATED:'Account created',EXPLORE_OPENED:'Opened explore',OPPORTUNITY_OPENED:'Opened an opportunity',SAVE_CLICKED:'Clicked bookmark',PROVIDER_LINK_CLICKED:'Clicked provider link',APPLICATION_TRACK_CLICKED:'Clicked application tracker'};
