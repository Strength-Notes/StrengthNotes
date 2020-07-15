import { combineReducers, createStore } from 'redux';
import PropTypes from 'prop-types';

const ADD_SET = 'ADD_SET';
const REMOVE_SET = 'REMOVE_SET';
const REORDER_FOR_EXERCISE = 'REORDER_FOR_EXERCISE';

export const addSetAction = (update) => ({
  type: ADD_SET,
  payload: update,
});

export const removeSetAction = (update) => ({
  type: REMOVE_SET,
  payload: update,
});

export const reorderSetsForExerciseAction = (exerciseName, sets) => ({
  type: REORDER_FOR_EXERCISE,
  payload: {
    exerciseName,
    sets,
  },
});

function setReducer(state = [], action) {
  let newState = [...state];

  switch (action.type) {
    case ADD_SET: {
      newState = [...newState, action.payload];
      return newState;
    }
    case REMOVE_SET: {
      newState = newState.filter(
        (element) => (element.key !== action.payload.key),
      );
      return newState;
    }
    case REORDER_FOR_EXERCISE: {
      // TODO
      return newState;
    }
    default:
      return newState;
  }
}

const rootReducer = combineReducers({ sets: setReducer });
const store = createStore(rootReducer);

const exampleSetSquat = {
  key: '2020-07-02-squats-1',
  date: '2020-07-02',
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
  date: '2020-07-02',
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
  date: '2020-07-02',
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
  date: '2020-07-02',
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

store.dispatch(addSetAction(exampleSetSquat));
store.dispatch(addSetAction(exampleSetSquat2));
store.dispatch(addSetAction(exampleSetBench));
store.dispatch(addSetAction(exampleSetBench2));

export const shapeOfSetObject = PropTypes.shape({
  key: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  exercise: PropTypes.string.isRequired,
  category: PropTypes.string,
  weight: PropTypes.number,
  weightUnit: PropTypes.string,
  reps: PropTypes.number,
  distance: PropTypes.number,
  distanceUnit: PropTypes.string,
  time: PropTypes.number,
  rpe: PropTypes.number,
  comment: PropTypes.string,
});

export default store;
