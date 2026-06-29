import { z } from 'zod';

// 2. MATCH_STATUS constant
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// 1. listMatchesQuerySchema
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// 3. matchIdParamSchema
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Helper function to check if a string is a valid ISO 8601 date string
const isIsoDateString = (val) => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
  return isoRegex.test(val) && !isNaN(Date.parse(val));
};

// 4. createMatchSchema with ISO refinements and chronological superRefine
export const createMatchSchema = z.object({
  sport: z.string().min(1, 'Sport cannot be empty'),
  homeTeam: z.string().min(1, 'Home team cannot be empty'),
  awayTeam: z.string().min(1, 'Away team cannot be empty'),
  startTime: z.string().refine(isIsoDateString, {
    message: 'startTime must be a valid ISO date string (e.g. YYYY-MM-DDTHH:mm:ssZ)',
  }),
  endTime: z.string().refine(isIsoDateString, {
    message: 'endTime must be a valid ISO date string (e.g. YYYY-MM-DDTHH:mm:ssZ)',
  }),
  homeScore: z.coerce.number().int().nonnegative().optional(),
  awayScore: z.coerce.number().int().nonnegative().optional(),
})
  .superRefine((data, ctx) => {
    // Only compare if both are valid ISO strings to avoid redundant error reports
    if (isIsoDateString(data.startTime) && isIsoDateString(data.endTime)) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endTime'],
          message: 'endTime must be chronologically after startTime',
        });
      }
    }
  });

// 5. updateScoreSchema
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
