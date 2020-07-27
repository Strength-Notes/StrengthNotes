import { combineReducers } from 'redux';
import arrayMove from 'array-move';
import {
  ADD_SET,
  UPDATE_SET_COMMENT,
  REMOVE_SET,
  MOVE_SET,
  ADD_EXERCISE,
  REMOVE_EXERCISE,
} from './actions';

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
    case UPDATE_SET_COMMENT: {
      const { set, newComment } = action.payload;
      const { date, key } = set;

      const setIndex = findSetInArrayByKey(newState[0][date], key);

      newState[0][date][setIndex].comment = newComment;
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
    default: {
      return newState;
    }
  }
}

function exercisesReducer(state = [], action) {
  let newState = [...state];

  switch (action.type) {
    case ADD_EXERCISE: {
      newState = [...newState, action.payload];
      return newState;
    }
    case REMOVE_EXERCISE: {
      newState = newState.filter(
        (element) => (element.name !== action.payload.name),
      );
      return newState;
    }
    default: {
      return newState;
    }
  }
}

const rootReducer = combineReducers({
  sets: setReducer,
  exercises: exercisesReducer,
});

export default rootReducer;
