/**
 * This test file is used to indirectly test the reducers,
 *  as well as the store.
 */

import { REHYDRATE } from 'redux-persist';
import store from '../../redux/store';
import {
  addSetAction,
  updateSetCommentAction,
  removeSetAction,
  moveSetAction,
  reorderSetsOfExerciseAction,
  addExerciseAction,
  removeExerciseAction,
} from '../../redux/actions';
import ExerciseProperties from '../../redux/ExerciseProperties';

/**
 * EXAMPLE SETS FOR TESTING
 */
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

const exampleSetNotInStore = {
  key: '2020-07-02-something-9',
  date,
  exercise: 'Lift',
  category: 'Upper',
  weight: 420,
  weightUnit: 'lbs',
  reps: 3,
  distance: null,
  distanceUnit: null,
  time: null,
  rpe: 9,
  comment: null,
};

exerciseSets[0][date] = setsAtDate;

describe('store.dispatch(addSetAction)', () => {
  it('successfully adds a set to the store', () => {
    store.dispatch(addSetAction(exampleSetSquat));
    const setsToday = store.getState().sets[0][date];
    expect(setsToday[0]).toEqual(exampleSetSquat);
  });
});

// ** Relise on previous test to ensure there's a set to update comment for **
describe('store.dispatch(updateSetCommentAction)', () => { 
  it('successfully updates a set\'s comment', () => {
    const newComment = 'This is the new comment!';

    store.dispatch(updateSetCommentAction(exampleSetSquat, newComment));
    const setsToday = store.getState().sets[0][date];
    expect(setsToday[0].comment).toEqual(newComment);
  });

  it('has no effect if given a set that doesn\' exist in the store', () => {
    const wrongComment = 'This comment should not show up';
    
    // Only one object in array now, so work with it
    const oldSetInStore = { ...store.getState().sets[0][date][0] };

    store.dispatch(updateSetCommentAction(exampleSetNotInStore, wrongComment));

    const newSetInStore = store.getState().sets[0][date][0];
    expect(newSetInStore).toEqual(oldSetInStore);
  });
});

// ** Relies on previous tests to ensure there's a set to remove **
describe('store.dispatch(removeSetAction)', () => {
  it('successfully removes a set from the store', () => {
    store.dispatch(removeSetAction(exampleSetSquat));
    const setsToday = store.getState().sets[0][date];
    expect(setsToday).toEqual([]);
  });
});

/**
 * @brief Add example sets to prepare for tests
 */
function addExampleSets() {
  store.dispatch(addSetAction(exampleSetSquat));
  store.dispatch(addSetAction(exampleSetSquat2));
  store.dispatch(addSetAction(exampleSetBench));
  store.dispatch(addSetAction(exampleSetBench2));
}

describe('store.dispatch(moveSetAction)', () => {
  it('successfully moves a set in the store', () => {
    addExampleSets();
    store.dispatch(moveSetAction(exampleSetSquat, 2));
    const setsToday = store.getState().sets[0][date];
    expect(setsToday[2]).toEqual(exampleSetSquat);
  });
});

describe('store.dispatch(reorderSetsOfExerciseAction)', () => {
  it('successfully reorders the sets in the store', () => {
    const exercisesList = ['Bench', 'Squat'];
    store.dispatch(reorderSetsOfExerciseAction(date, exercisesList));
    const setsToday = store.getState().sets[0][date];
    expect(setsToday[0]).toEqual(exampleSetBench);
    expect(setsToday[1]).toEqual(exampleSetBench2);
    expect(setsToday[2]).toEqual(exampleSetSquat2);
    expect(setsToday[3]).toEqual(exampleSetSquat);
  });
});

/*
 * EXAMPLE EXERCISES FOR TESTING
 */
const frontSquatExercise = {
  name: 'Front Squat',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const snatchExercise = {
  name: 'Snatch',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const pullupsExercise = {
  name: 'Pullups',
  primary: ExerciseProperties.REPS,
};

const goodmorningExercise = {
  name: 'GoodMorning',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const exampleExercises = [
  frontSquatExercise,
  snatchExercise,
  pullupsExercise,
  goodmorningExercise,
];

describe('store.dispatch(addExerciseAction)', () => {
  it('successfully adds the exercise definition', () => {
    store.dispatch(addExerciseAction(frontSquatExercise));
    expect(store.getState().exercises).toContain(frontSquatExercise);
  });
});

describe('store.dispatch(removeExerciseAction)', () => {
  it('successfully removes the exercise definition', () => {
    store.dispatch(removeExerciseAction(frontSquatExercise));
    expect(store.getState().exercises).not.toContain(frontSquatExercise);
  });
});

describe('store.dispatch(REHYDRATE)', () => {
  it('successfully replacest the store contents with rehydrate payload', () => {
    const sets = [{}];
    sets[0][date] = setsAtDate;

    const rehydrateAction = {
      type: REHYDRATE,
      payload: {
        sets,
        exercises: exampleExercises,
      },
    };

    store.dispatch(rehydrateAction);

    const state = store.getState();
    expect(state.sets[0]).toEqual(sets[0]);
    expect(state.exercises).toEqual(exampleExercises);
  });
});
