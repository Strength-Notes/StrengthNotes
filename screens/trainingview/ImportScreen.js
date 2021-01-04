import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addMultipleExercisesAction, addMultipleSetsAction } from '../../redux/actions';
import ExerciseProperties from '../../redux/ExerciseProperties';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
});

const Status = {
  WAITING: 'WAITING',
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
  CANCELLED: 'CANCELLED',
  ERROR: 'ERROR',
};

class ImportScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.addMultipleExercisesDispatch = props.addMultipleExercisesDispatch;
    this.addMultipleSetsDispatch = props.addMultipleSetsDispatch;

    this.state = {
      status: Status.WAITING,
      setsInFile: 0,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.pickAndImportDocument();
  }

  getExerciseProperties = (weight, reps, distance, timeString) => {
    let primary = null;
    let secondary = null;

    if (weight) {
      if (!primary) primary = ExerciseProperties.WEIGHT;
      else secondary = ExerciseProperties.WEIGHT;
    }
    if (reps) {
      if (!primary) primary = ExerciseProperties.REPS;
      else secondary = ExerciseProperties.REPS;
    }
    if (distance) {
      if (!primary) primary = ExerciseProperties.DISTANCE;
      else secondary = ExerciseProperties.DISTANCE;
    }
    if (timeString) {
      if (!primary) primary = ExerciseProperties.TIME;
      else secondary = ExerciseProperties.TIME;
    }

    return [primary, secondary];
  }

  processLine = (arr, keyAppendix) => {
    const date = arr[0];
    const exerciseName = arr[1];
    const category = arr[2];
    const weight = arr[3];
    const reps = arr[4];
    const distance = arr[5];
    const distanceUnit = arr[6];
    const timeString = arr[7];
    const comment = arr[8];

    /*
     * First, add Exercise Definitions
     */

    const [primary, secondary] = this.getExerciseProperties(weight, reps, distance, timeString);

    const exerciseObj = {
      name: exerciseName,
      category,
      primary,
      secondary,
    };

    /*
     * Then, add actual sets
     */

    const t = timeString.split(':');
    const time = (+t[0]) * 3600 + (+t[1]) * 60 + (+t[2]); // Plus's convert to numbers

    const set = {
      key: `${date}-${exerciseName}-${Date.now() + keyAppendix}`, // Same format as in ExerciseScreen/Footer.js
      date,
      exercise: exerciseName,
      weight: Number(weight),
      weightUnit: 'lbs',
      reps: Number(reps),
      distance: Number(distance),
      distanceUnit,
      time,
      comment,
      // No RPE imported
    };

    return [exerciseObj, set];
  }

  pickAndImportDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/*',
        multiple: false,
      });

      if (result.type === 'cancel') {
        // If the user cancelled the document picker, return and show cancelled screen
        this.setState({ status: Status.CANCELLED });
        return;
      }

      this.setState({ status: Status.LOADING });

      const contentsRaw = await FileSystem.readAsStringAsync(result.uri, {});
      // eslint-disable-next-line no-use-before-define
      const contents = CSVToArray(contentsRaw);
      contents.shift(); // Remove first line because it only contains field labels

      this.setState({ setsInFile: contents.length });

      const exerciseObjs = [];
      const sets = [];
      for (let i = 0; i < contents.length; i += 1) {
        const [exerciseObj, set] = this.processLine(contents[i], i);
        exerciseObjs.push(exerciseObj);
        sets.push(set);
      }

      this.addMultipleExercisesDispatch(exerciseObjs);
      this.addMultipleSetsDispatch(sets);

      this.setState({ status: Status.COMPLETE });
    } catch (err) {
      this.setState({
        status: Status.ERROR,
        errorMessage: err,
      });
    }
  };

  render() {
    const { status, setsInFile, errorMessage } = this.state;

    if (status === Status.WAITING) {
      return (
        <View style={styles.container}>
          <Text>Please select a file to import</Text>
        </View>
      );
    }
    if (status === Status.LOADING) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#000000" />
          <Text>Importing {setsInFile} sets...</Text>
        </View>
      );
    }
    if (status === Status.COMPLETE) {
      return (
        <View style={styles.container}>
          <Text>Done loading. {setsInFile} sets imported.</Text>
        </View>
      );
    }
    if (status === Status.CANCELLED) {
      return (
        <View style={styles.container}>
          <Text>Import cancelled. Nothing imported.</Text>
        </View>
      );
    }
    if (status === Status.ERROR) {
      return (
        <View style={styles.container}>
          <Text>Error: {errorMessage}</Text>
        </View>
      );
    }
    return (
      <Text>Internal error: invalid status code</Text>
    );
  }
}

ImportScreen.propTypes = {
  addMultipleExercisesDispatch: PropTypes.func.isRequired,
  addMultipleSetsDispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  exercises: state.exercises,
});

const mapDispatchToProps = (dispatch) => ({
  addMultipleExercisesDispatch: (exercises) => {
    dispatch(addMultipleExercisesAction(exercises));
  },
  addMultipleSetsDispatch: (sets) => {
    dispatch(addMultipleSetsAction(sets));
  },
});

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
/* eslint-disable */
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = strDelimiter || ',';

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    '(\\' +
      strDelimiter +
      '|\\r?\\n|\\r|^)' +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      '\\r\\n]*))',
    'gi'
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return arrData;
}
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(ImportScreen);
