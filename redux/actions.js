export const ADD_SET = 'ADD_SET';
export const UPDATE_SET_COMMENT = 'UPDATE_SET_COMMENT';
export const REMOVE_SET = 'REMOVE_SET';
export const MOVE_SET = 'MOVE_SET';

export const ADD_EXERCISE = 'ADD_EXERCISE';
export const REMOVE_EXERCISE = 'REMOVE_EXERCISE';

export const addSetAction = (update) => ({
  type: ADD_SET,
  payload: update,
});

export const updateSetCommentAction = (set, newComment) => ({
  type: UPDATE_SET_COMMENT,
  payload: {
    set,
    newComment,
  },
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

export const addExerciseAction = (exercise) => ({
  type: ADD_EXERCISE,
  payload: exercise,
});

export const removeExerciseAction = (exercise) => ({
  type: REMOVE_EXERCISE,
  payload: exercise,
});
