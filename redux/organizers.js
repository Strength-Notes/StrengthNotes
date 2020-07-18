/*
 * Collection of pure helper functions for organizing sets from the database
 *
 */

/*
 * @param {Array} exerciseSets - Sets of various exercises to extract from
 * @param {String} dateString - The date string (in YYYY-MM-DD format) to filter for
 */
export function getSetsAtDate(exerciseSets = [], dateString) {
  let setsAtDate = exerciseSets[0][dateString];

  if (setsAtDate === undefined) {
    // There are no sets at this date. Return an empty array
    setsAtDate = [];
  }

  return setsAtDate;
}

/*
 * @param {Array} exerciseSets - Sets of various exercises to extract exercise names from
 */
export function getExercises(exerciseSets = []) {
  const exercisesList = [];

  exerciseSets.forEach((set) => {
    const { exercise } = set;

    // Check that exercise is not already in the list (no duplicates)
    if (exercisesList.indexOf(exercise) === -1) {
      exercisesList.push(exercise);
    }
  });

  return exercisesList;
}

/*
 * @param {Array} exerciseSets - Sets of various exercises to extract from
 * @param {String} exercise - Name of exercise to filter for
 */
export function getSetsOfExercise(exerciseSets = [], exercise) {
  const setsOfExercise = [];

  exerciseSets.forEach((set) => {
    if (set.exercise === exercise) {
      setsOfExercise.push(set);
    }
  });

  return setsOfExercise;
}

/*
 * @param {Date} date - The date to create a formatted string for
 */
export function getFormattedDateString(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }

  return (`${year}-${month}-${day}`);
}

/*
 * @param {String} dateString - The date string to create a date object for
 */
export function getDateObjectFromString(dateString) {
  const b = dateString.split(/\D+/);
  const date = new Date(b[0], b[1] - 1, b[2]);

  return date;
}

/*
 * @param {String} name - The name of the exercise to find object for
 */
export function getExerciseObjectFromName(exercisesList, name) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < exercisesList.length; i++) {
    if (exercisesList[i].name === name) {
      return exercisesList[i];
    }
  }
  return undefined;
}
