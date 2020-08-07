import {
  getSetsAtDate,
  getExercises,
  getSetsOfExercise,
  getFormattedDateString,
  getDateObjectFromString,
  getExerciseObjectFromName,
} from '../../redux/organizers';

// Example data for testing
const exerciseSets = [{}];
const date = '2020-06-21';

const exampleSetSquat = {
  key: '2020-07-02-squats-1',
  date,
  exercise: 'Squat',
  category: 'Lower',
  weight: 705,
  weightUnit: 'lbs',
  reps: 2,
  distance: null,
  distanceUnit: null,
  time: null,
  rpe: 9,
  comment: 'Hips shot up a little bit. Need to focus on driving through the floor.',
};

const exampleSetSquat2 = {
  key: '2020-07-02-squats-2',
  date,
  exercise: 'Squat',
  category: 'Lower',
  weight: 705,
  weightUnit: 'lbs',
  reps: 2,
  distance: null,
  distanceUnit: null,
  time: null,
  rpe: 9,
  comment: 'Hips shot up a little bit. Need to focus on driving through the floor.',
};

const exampleSetBench = {
  key: '2020-07-02-bench-1',
  date,
  exercise: 'Bench',
  category: 'Upper',
  weight: 435,
  weightUnit: 'lbs',
  reps: 1,
  distance: null,
  distanceUnit: null,
  time: null,
  rpe: 9.5,
  comment: 'Forgot to properly activate back.',
};

const exampleSetBench2 = {
  key: '2020-07-02-bench-2',
  date,
  exercise: 'Bench',
  category: 'Upper',
  weight: 335,
  weightUnit: 'lbs',
  reps: 5,
  distance: null,
  distanceUnit: null,
  time: null,
  rpe: 9,
  comment: null,
};

const setsAtDate = [
  exampleSetSquat,
  exampleSetSquat2,
  exampleSetBench,
  exampleSetBench2,
];

exerciseSets[0][date] = setsAtDate;

describe('getSetsAtDate', () => {
  it('returns exercise sets at given date', () => {
    expect(getSetsAtDate(exerciseSets, date)).toBe(setsAtDate);
  });

  it('returns an empty array if there are no sets at this date (input undef)', () => {
    expect(getSetsAtDate(undefined, date)).toEqual([]);
  });
});

describe('getExercises', () => {
  it('returns string list of exercise names in array', () => {
    expect(getExercises(setsAtDate)).toEqual(['Squat', 'Bench']);
  });

  it('returns an empty array when not given an input', () => {
    expect(getExercises()).toEqual([]);
  });
});

describe('getSetsOfExercise', () => {
  it('returns the proper exercise sets', () => {
    const setsOfExercise = getSetsOfExercise(setsAtDate, 'Bench');
    expect(setsOfExercise).toEqual([exampleSetBench, exampleSetBench2]);
  });

  it('returns an empty array when not given an exerciseSets input', () => {
    const setsOfExercise = getSetsOfExercise(undefined, 'Bench');
    expect(setsOfExercise).toEqual([]);
  });
});

describe('getFormattedDateString', () => {
  it('formats properly', () => {
    const b1 = '1984-10-13'.split(/\D+/);
    const date1 = new Date(b1[0], b1[1] - 1, b1[2]);
    expect(getFormattedDateString(date1)).toBe('1984-10-13');
  });
});

describe('getDateObjectFromString', () => {
  it('returns the right date object', () => {
    const date1 = '1984-03-13';
    expect(getDateObjectFromString(date1)).toMatchSnapshot();
  });
});

describe('getExerciseObjectFromName', () => {
  const exercisesList = [
    { name: 'Bench' },
    { name: 'Squat' },
    { name: 'Deadlift' },
  ];

  it('returns the proper object', () => {
    expect(getExerciseObjectFromName(exercisesList, 'Squat')).toBe(exercisesList[1]);
  });

  it('returns undefined if not found', () => {
    expect(getExerciseObjectFromName(exercisesList, 'Clean and Jerk')).toEqual(undefined);
  });
});
