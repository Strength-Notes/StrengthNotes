import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist';
import arrayMove from 'array-move';
import {
  ADD_SET,
  UPDATE_SET,
  UPDATE_SET_COMMENT,
  REMOVE_SET,
  MOVE_SET,
  REORDER_SETS_OF_EXERCISE,
  ADD_EXERCISE,
  REMOVE_EXERCISE,
} from './actions';
import { getSetsOfExercise } from './organizers';
import ExerciseProperties from './ExerciseProperties';

/**
 * Default Exercises
 */
const squatExercise = {
  name: 'Squat',
  category: 'Lower',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const benchExercise = {
  name: 'Bench',
  category: 'Upper',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const deadliftExercise = {
  name: 'Deadlift',
  category: 'Lower',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const cleanAndJerkExercise = {
  name: 'Clean and Jerk',
  category: 'Lower',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.REPS,
};

const bodyweightPullupsExercise = {
  name: 'Bodyweight Pullups',
  category: 'Upper',
  primary: ExerciseProperties.REPS,
};

const dumbbellBenchTimeExercise = {
  name: 'Dumbbell Bench (Time)',
  category: 'Upper',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.TIME,
};

const farmersCarryExercise = {
  name: 'Farmer Carry',
  category: 'Upper',
  primary: ExerciseProperties.WEIGHT,
  secondary: ExerciseProperties.DISTANCE,
};

const initialExercisesState = [
  squatExercise,
  benchExercise,
  deadliftExercise,
  cleanAndJerkExercise,
  bodyweightPullupsExercise,
  dumbbellBenchTimeExercise,
  farmersCarryExercise,
];

/**
 * @brief Finds the array index of the set matching the input key from
 *  the given array.
 */
function findSetInArrayByKey(setsArray, key) {
  for (let i = 0; i < setsArray.length; i++) { // eslint-disable-line
    if (setsArray[i].key === key) {
      return i;
    }
  }
  return -1; // Not found...
}

/**
 * @brief Finds the array index of the exercise matching the input name from
 *  the given array.
 */
function findExerciseInArrayByName(exercisesArray, name) {
  for (let i = 0; i < exercisesArray.length; i++) { // eslint-disable-line
    if (exercisesArray[i].name === name) {
      return i;
    }
  }
  return -1; // Not found...
}

function setsReducer(state = [{}], action) {
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
    case UPDATE_SET: {
      const set = action.payload;
      const { date, key } = set;

      const setIndex = findSetInArrayByKey(newState[0][date], key);

      if (setIndex !== -1) {
        newState[0][date][setIndex] = set;
      }
      return newState;
    }
    case UPDATE_SET_COMMENT: {
      const { set, newComment } = action.payload;
      const { date, key } = set;

      const setIndex = findSetInArrayByKey(newState[0][date], key);

      if (setIndex !== -1) {
        newState[0][date][setIndex].comment = newComment;
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
    case REORDER_SETS_OF_EXERCISE: {
      const { date, exercisesList } = action.payload;

      const setsToday = newState[0][date];
      const newSets = [];

      exercisesList.forEach((item) => {
        const setsOfItem = getSetsOfExercise(setsToday, item);
        newSets.push(...setsOfItem);
      });

      newState[0][date] = newSets;
      return newState;
    }
    case REHYDRATE: {
      if (action.payload) {
        [newState[0]] = action.payload.sets;
      }
      return newState;
    }
    default: {
      return newState;
    }
  }
}

function exercisesReducer(state = initialExercisesState, action) {
  let newState = [...state];

  switch (action.type) {
    case ADD_EXERCISE: {
      // Only add the new exercise def if no other exists with same name
      if (findExerciseInArrayByName(newState, action.payload.name) === -1) {
        newState = [...newState, action.payload];
      }
      return newState;
    }
    case REMOVE_EXERCISE: {
      newState = newState.filter(
        (element) => (element.name !== action.payload.name),
      );
      return newState;
    }
    case REHYDRATE: {
      if (action.payload) {
        newState = action.payload.exercises;
      }
      return newState;
    }
    default: {
      return newState;
    }
  }
}

const rootReducer = combineReducers({
  sets: setsReducer,
  exercises: exercisesReducer,
});

export default rootReducer;
