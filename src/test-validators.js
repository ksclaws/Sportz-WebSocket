import { 
  listMatchesQuerySchema,
  matchIdParamSchema,
  createMatchSchema,
  updateScoreSchema,
  MATCH_STATUS
} from './validation/matches.js';

console.log('--- Testing Zod Validation Schemas ---\n');

// 1. Test listMatchesQuerySchema
console.log('1. Testing listMatchesQuerySchema...');
const testList1 = listMatchesQuerySchema.safeParse({ limit: '10' });
console.log('  Valid coerced limit "10":', testList1.success ? '✅ Pass' : '❌ Fail', testList1.data);

const testList2 = listMatchesQuerySchema.safeParse({ limit: 150 });
console.log('  Invalid limit > 100:', !testList2.success ? '✅ Pass' : '❌ Fail', !testList2.success ? `(${testList2.error.issues[0].message})` : '');

const testList3 = listMatchesQuerySchema.safeParse({});
console.log('  Optional limit missing:', testList3.success ? '✅ Pass' : '❌ Fail', testList3.data);

// 2. Test MATCH_STATUS constant
console.log('\n2. Testing MATCH_STATUS Constant...');
console.log('  MATCH_STATUS values:', MATCH_STATUS);

// 3. Test matchIdParamSchema
console.log('\n3. Testing matchIdParamSchema...');
const testId1 = matchIdParamSchema.safeParse({ id: '42' });
console.log('  Valid coerced id "42":', testId1.success ? '✅ Pass' : '❌ Fail', testId1.data);

const testId2 = matchIdParamSchema.safeParse({ id: -5 });
console.log('  Invalid negative id:', !testId2.success ? '✅ Pass' : '❌ Fail', !testId2.success ? `(${testId2.error.issues[0].message})` : '');

// 4. Test createMatchSchema
console.log('\n4. Testing createMatchSchema...');
const validMatchInput = {
  sport: 'Soccer',
  homeTeam: 'Arsenal',
  awayTeam: 'Chelsea',
  startTime: '2026-06-28T10:00:00Z',
  endTime: '2026-06-28T12:00:00Z',
  homeScore: '0',
  awayScore: 0
};
const testCreate1 = createMatchSchema.safeParse(validMatchInput);
console.log('  Valid match input:', testCreate1.success ? '✅ Pass' : '❌ Fail', testCreate1.data);

const invalidMatchInputEmptySport = { ...validMatchInput, sport: '' };
const testCreate2 = createMatchSchema.safeParse(invalidMatchInputEmptySport);
console.log('  Invalid empty sport:', !testCreate2.success ? '✅ Pass' : '❌ Fail', !testCreate2.success ? `(${testCreate2.error.issues[0].message})` : '');

const invalidMatchInputDates = { ...validMatchInput, startTime: 'invalid-date' };
const testCreate3 = createMatchSchema.safeParse(invalidMatchInputDates);
console.log('  Invalid start date format:', !testCreate3.success ? '✅ Pass' : '❌ Fail', !testCreate3.success ? `(${testCreate3.error.issues[0].message})` : '');

const chronologicalErrorInput = { 
  ...validMatchInput, 
  startTime: '2026-06-28T14:00:00Z', 
  endTime: '2026-06-28T12:00:00Z' 
};
const testCreate4 = createMatchSchema.safeParse(chronologicalErrorInput);
console.log('  Invalid end date before start date:', !testCreate4.success ? '✅ Pass' : '❌ Fail', !testCreate4.success ? `(${testCreate4.error.issues[0].message})` : '');

// 5. Test updateScoreSchema
console.log('\n5. Testing updateScoreSchema...');
const testUpdate1 = updateScoreSchema.safeParse({ homeScore: '2', awayScore: 1 });
console.log('  Valid score update coerced:', testUpdate1.success ? '✅ Pass' : '❌ Fail', testUpdate1.data);

const testUpdate2 = updateScoreSchema.safeParse({ homeScore: -1, awayScore: 2 });
console.log('  Invalid negative score:', !testUpdate2.success ? '✅ Pass' : '❌ Fail', !testUpdate2.success ? `(${testUpdate2.error.issues[0].message})` : '');
