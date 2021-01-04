export const ADD_SET = 'ADD_SET';
export const ADD_MULTIPLE_SETS = 'ADD_MULTIPLE_SETS';
export const UPDATE_SET = 'UPDATE_SET';
export const UPDATE_SET_COMMENT = 'UPDATE_SET_COMMENT';
export const REMOVE_SET = 'REMOVE_SET';
export const REMOVE_ALL_SETS = 'REMOVE_ALL_SETS';
export const MOVE_SET = 'MOVE_SET';
export const REORDER_SETS_OF_EXERCISE = 'REORDER_SETS_OF_EXERCISE';
export const UPDATE_DAY_COMMENT = 'UPDATE_DAY_COMMENT';

export const ADD_EXERCISE = 'ADD_EXERCISE';
export const ADD_MULTIPLE_EXERCISES = 'ADD_MULTIPLE_EXERCISES';
export const REMOVE_EXERCISE = 'REMOVE_EXERCISE';
export const REMOVE_ALL_EXERCISES = 'REMOVE_ALL_EXERCISES';

export const addSetAction = (update) => ({
  type: ADD_SET,
  payload: update,
});

export const addMultipleSetsAction = (sets) => ({
  type: ADD_MULTIPLE_SETS,
  payload: sets,
});

export const updateSetAction = (set) => ({
  type: UPDATE_SET,
  payload: set,
});

export const updateSetCommentAction = (set, newComment) => ({
  type: UPDATE_SET_COMMENT,
  payload: {
    set,
    newComment,
  },
});

export const removeSetAction = (set) => ({
  type: REMOVE_SET,
  payload: set,
});

export const removeAllSetsAction = () => ({
  type: REMOVE_ALL_SETS,
});

export const moveSetAction = (set, distanceMoved) => ({
  type: MOVE_SET,
  payload: {
    set,
    distanceMoved,
  },
});

export const reorderSetsOfExerciseAction = (date, exercisesList) => ({
  type: REORDER_SETS_OF_EXERCISE,
  payload: {
    date,
    exercisesList,
  },
});

export const updateDayCommentAction = (date, newComment) => ({
  type: UPDATE_DAY_COMMENT,
  payload: {
    date,
    newComment,
  },
});

export const addExerciseAction = (exercise) => ({
  type: ADD_EXERCISE,
  payload: exercise,
});

export const addMultipleExercisesAction = (exercises) => ({
  type: ADD_MULTIPLE_EXERCISES,
  payload: exercises,
});

export const removeExerciseAction = (exercise) => ({
  type: REMOVE_EXERCISE,
  payload: exercise,
});

export const removeAllExercisesAction = () => ({
  type: REMOVE_ALL_EXERCISES,
});
