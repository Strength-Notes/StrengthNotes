import { combineReducers, createStore } from 'redux';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import { getFormattedDateString } from './organizers';

const ADD_SET = 'ADD_SET';
const REMOVE_SET = 'REMOVE_SET';
const MOVE_SET = 'MOVE_SET';

export const addSetAction = (update) => ({
  type: ADD_SET,
  payload: update,
});

export const removeSetAction = (update) => ({
  type: REMOVE_SET,
  payload: update,
});

export const moveSetAction = (set, distanceMoved) => ({
  type: MOVE_SET,
  payload: {
    set,
    distanceMoved,
  },
});

function findSetInArrayByKey(setsArray, key) {
  for (let i = 0; i < setsArray.length; i++) { // eslint-disable-line
    if (setsArray[i].key === key) {
      return i;
    }
  }
  return -1; // Not found...
}

function setReducer(state = [{}], action) {
  const newState = [...state];

  switch (action.type) {
    case ADD_SET: {
      const { date } = action.payload;
      if (newState[0][date] === undefined) {
        newState[0][date] = [action.payload];
      } else {
        newState[0][date] = [...newState[0][date], action.payload];
      }
      return newState;
    }
    case REMOVE_SET: {
      const { date } = action.payload;

      newState[0][date] = newState[0][date].filter(
        (element) => (element.key !== action.payload.key),
      );
      return newState;
    }
    case MOVE_SET: {
      const { set, distanceMoved } = action.payload;
      const { date } = set;

      const currentIndex = findSetInArrayByKey(newState[0][date], set.key);
      const newIndex = currentIndex + distanceMoved;

      newState[0][date] = arrayMove(newState[0][date], currentIndex, newIndex);

      return newState;
    }
    default:
      return newState;
  }
}

const rootReducer = combineReducers({ sets: setReducer });
const store = createStore(rootReducer);

const todaysDateString = getFormattedDateString(new Date());

const exampleSetSquat = {
  key: '2020-07-02-squats-1',
  date: todaysDateString,
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
  date: todaysDateString,
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
  date: todaysDateString,
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
  date: todaysDateString,
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
