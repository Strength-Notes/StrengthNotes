import {
  addSetAction,
  updateSetCommentAction,
  removeSetAction,
  moveSetAction,
  reorderSetsOfExerciseAction,
  addExerciseAction,
  removeExerciseAction,
  ADD_SET,
  UPDATE_SET_COMMENT,
  REMOVE_SET,
  MOVE_SET,
  REORDER_SETS_OF_EXERCISE,
  ADD_EXERCISE,
  REMOVE_EXERCISE,
} from '../../redux/actions';
import ExerciseProperties from '../../redux/ExerciseProperties';

const exampleSet = {
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

describe('addSetAction', () => {
  it('returns the proper Redux action object', () => {
    const action = addSetAction(exampleSet);
    expect(action).toEqual({
      type: ADD_SET,
      payload: exampleSet,
    });
  });
});

describe('updateSetCommentAction', () => {
  it('returns the proper Redux action object', () => {
    const newComment = 'This is the new comment';
    const action = updateSetCommentAction(exampleSet, newComment);
    expect(action).toEqual({
      type: UPDATE_SET_COMMENT,
      payload: {
        set: exampleSet,
        newComment,
      },
    });
  });
});

describe('removeSetAction', () => {
  it('returns the proper Redux action object', () => {
    const action = removeSetAction(exampleSet);
    expect(action).toEqual({
      type: REMOVE_SET,
      payload: exampleSet,
    });
  });
});

describe('moveSetAction', () => {
  it('returns the proper Redux action object', () => {
    const action = moveSetAction(exampleSet, 3);
    expect(action).toEqual({
      type: MOVE_SET,
      payload: {
        set: exampleSet,
        distanceMoved: 3,
      },
    });
  });
});

describe('reorderSetsOfExerciseAction', () => {
  it('returns the proper Redux action object', () => {
    const date = '2025-05-23';
    const exercisesList = [
      'Squat',
      'Deadlift',
      'Bench',
    ];

    const action = reorderSetsOfExerciseAction(date, exercisesList);
    expect(action).toEqual({
      type: REORDER_SETS_OF_EXERCISE,
      payload: {
        date,
        exercisesList,
      },
    });
  });
});

describe('addExerciseAction', () => {
  it('returns the proper Redux action object', () => {
    const exercise = {
      name: 'Deadlift',
      primary: ExerciseProperties.WEIGHT,
      secondary: ExerciseProperties.REPS,
    };

    const action = addExerciseAction(exercise);
    expect(action).toEqual({
      type: ADD_EXERCISE,
      payload: exercise,
    });
  });
});

describe('removeExerciseAction', () => {
  it('returns the proper Redux action object', () => {
    const exercise = {
      name: 'Deadlift',
      primary: ExerciseProperties.WEIGHT,
      secondary: ExerciseProperties.REPS,
    };

    const action = removeExerciseAction(exercise);
    expect(action).toEqual({
      type: REMOVE_EXERCISE,
      payload: exercise,
    });
  });
});
