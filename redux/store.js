import { createStore } from 'redux';
import PropTypes from 'prop-types';
import {
  addSetAction,
  addExerciseAction,
} from './actions';
import rootReducer from './reducers';
import { getFormattedDateString } from './organizers';
import ExerciseProperties from './ExerciseProperties';

const store = createStore(rootReducer);

/*
 * Default/Sample Sets
 */
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

/*
 * Default/Sample Exercises
 */
const squatExercise = {
  name: 'Squat',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const benchExercise = {
  name: 'Bench',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const deadliftExercise = {
  name: 'Deadlift',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const cleanAndJerkExercise = {
  name: 'Clean and Jerk',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const bodyweightPullupsExercise = {
  name: 'Bodyweight Pullups',
  primary: ExerciseProperties.REPS,
};

const dumbbellBenchTimeExercise = {
  name: 'Dumbbell Bench (Time)',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.TIME,
};

const farmersCarryExercise = {
  name: 'Farmer Carry',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.DISTANCE,
};

store.dispatch(addExerciseAction(squatExercise));
store.dispatch(addExerciseAction(benchExercise));
store.dispatch(addExerciseAction(deadliftExercise));
store.dispatch(addExerciseAction(cleanAndJerkExercise));
store.dispatch(addExerciseAction(bodyweightPullupsExercise));
store.dispatch(addExerciseAction(dumbbellBenchTimeExercise));
store.dispatch(addExerciseAction(farmersCarryExercise));

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
