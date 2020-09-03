import React from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Picker,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ExerciseProperties from '../../../redux/ExerciseProperties';
import { addSetAction, updateSetAction, removeSetAction } from '../../../redux/actions';
import styles from './EntryTab.styles';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.addSetDispatch = props.addSetDispatch;
    this.updateSetDispatch = props.updateSetDispatch;
    this.removeSetDispatch = props.removeSetDispatch;

    const {
      date,
      exercise,
      getOnSelectSetObj,
      getOnUnselectSetObj,
    } = props;
    const { primary, secondary } = exercise;

    getOnSelectSetObj(this.onSelectSetObj);
    getOnUnselectSetObj(this.onUnselectSetObj);

    this.state = {
      date,
      exercise,
      ...this.getDefaultInputState(primary, secondary),
    };
  }

  getDefaultInputState = (primary, secondary) => {
    const stateFields = {};

    // Only initialize as empty string if it's a property in use
    //   This is to prevent all sets having unnecessary empty string fields
    if (primary === ExerciseProperties.WEIGHT || secondary === ExerciseProperties.WEIGHT) {
      stateFields.weightInput = '';
    }
    if (primary === ExerciseProperties.REPS || secondary === ExerciseProperties.REPS) {
      stateFields.repsInput = '';
    }
    if (primary === ExerciseProperties.DISTANCE || secondary === ExerciseProperties.DISTANCE) {
      stateFields.distanceInput = '';
      stateFields.distanceUnitSelected = 'm';
    }
    // Ignore TIME and NONE

    stateFields.rpeInput = '';

    return stateFields;
  };

  onSelectSetObj = (setObj) => {
    const { exercise } = this.state;
    const { primary, secondary } = exercise;

    const stateFields = {};

    if (primary === ExerciseProperties.WEIGHT || secondary === ExerciseProperties.WEIGHT) {
      stateFields.weightInput = String(setObj.weight);
    }
    if (primary === ExerciseProperties.REPS || secondary === ExerciseProperties.REPS) {
      stateFields.repsInput = String(setObj.reps);
    }
    if (primary === ExerciseProperties.DISTANCE || secondary === ExerciseProperties.DISTANCE) {
      stateFields.distanceInput = String(setObj.distance);
      stateFields.distanceUnitSelected = String(setObj.distanceUnit);
    }
    if (primary === ExerciseProperties.TIME || secondary === ExerciseProperties.TIME) {
      let seconds = setObj.time;
      const hours = Math.floor(seconds / 3600);
      seconds -= hours * 3600;
      const minutes = Math.floor(seconds / 60);
      seconds -= minutes * 60;

      stateFields.hoursInput = String(hours);
      stateFields.minutesInput = String(minutes);
      stateFields.secondsInput = String(seconds);
    }

    if (setObj.rpe) {
      stateFields.rpeInput = String(setObj.rpe);
    } else {
      stateFields.rpeInput = undefined;
    }

    this.setState({
      selectedSetObj: setObj,
      ...stateFields,
    });
  };

  onUnselectSetObj = () => {
    this.setState({
      selectedSetObj: undefined,
    });
  };

  // Cannot be made into an arrow function, as it results in a bug with Expo
  // eslint-disable-next-line class-methods-use-this
  getExerciseInput({ property, state, setState }) {
    const {
      weightInput,
      repsInput,
      distanceInput,
      distanceUnitSelected,
      hoursInput,
      minutesInput,
      secondsInput,
    } = state;

    switch (property) {
      case ExerciseProperties.WEIGHT: {
        return (
          <TextInput
            style={styles.weightInput}
            onChangeText={(text) => {
              setState({ weightInput: text });
            }}
            value={weightInput}
            placeholder="Weight"
            keyboardType="decimal-pad"
            maxLength={7}
          />
        );
      }
      case ExerciseProperties.REPS: {
        return (
          <TextInput
            style={styles.repsInput}
            onChangeText={(text) => {
              setState({ repsInput: text });
            }}
            value={repsInput}
            placeholder="Reps"
            keyboardType="decimal-pad"
            maxLength={4}
          />
        );
      }
      case ExerciseProperties.DISTANCE: {
        return (
          <View style={[styles.compoundContainer, { flex: 2 }]}>
            <TextInput
              style={styles.distanceInput}
              onChangeText={(text) => {
                setState({ distanceInput: text });
              }}
              value={distanceInput}
              placeholder="Distance"
              keyboardType="decimal-pad"
              maxLength={7}
            />
            <Picker
              style={styles.distanceUnitInput}
              selectedValue={distanceUnitSelected}
              onValueChange={(selected) => {
                setState({ distanceUnitSelected: selected });
              }}
              mode="dropdown"
            >
              <Picker.Item label="m" value="m" />
              <Picker.Item label="km" value="km" />
              <Picker.Item label="yd" value="yd" />
              <Picker.Item label="mi" value="mi" />
            </Picker>
          </View>
        );
      }
      case ExerciseProperties.TIME: {
        return (
          <View style={[styles.compoundContainer, { flex: 3 }]}>
            <TextInput
              style={styles.timeInput}
              onChangeText={(text) => {
                setState({ hoursInput: text });
              }}
              value={hoursInput}
              placeholder="HH"
              keyboardType="decimal-pad"
              maxLength={2}
            />
            <TextInput
              style={styles.timeInput}
              onChangeText={(text) => {
                setState({ minutesInput: text });
              }}
              value={minutesInput}
              placeholder="MM"
              keyboardType="decimal-pad"
              maxLength={2}
            />
            <TextInput
              style={styles.timeInput}
              onChangeText={(text) => {
                setState({ secondsInput: text });
              }}
              value={secondsInput}
              placeholder="SS"
              keyboardType="decimal-pad"
              maxLength={5}
            />
          </View>
        );
      }
      default: {
        return <View />;
      }
    }
  }

  addSetHandler = () => {
    const { selectedSetObj, distanceUnitSelected } = this.state;
    let {
      weightInput,
      repsInput,
      distanceInput,
      hoursInput,
      minutesInput,
      secondsInput,
      rpeInput,
    } = this.state;

    weightInput = Number(weightInput);
    repsInput = Number(repsInput);
    distanceInput = Number(distanceInput);
    hoursInput = Number(hoursInput);
    minutesInput = Number(minutesInput);
    secondsInput = Number(secondsInput);
    rpeInput = Number(rpeInput);

    // Set all NaNs or undefs to 0, to prevent time becoming NaN
    if (!hoursInput) hoursInput = 0;
    if (!minutesInput) minutesInput = 0;
    if (!secondsInput) secondsInput = 0;

    const time = hoursInput * 3600 + minutesInput * 60 + secondsInput;

    if (selectedSetObj) {
      selectedSetObj.weight = weightInput;
      selectedSetObj.reps = repsInput;
      selectedSetObj.distance = distanceInput;
      selectedSetObj.distanceUnit = distanceUnitSelected;
      selectedSetObj.time = time;
      selectedSetObj.rpe = rpeInput;

      this.updateSetDispatch(selectedSetObj);
    } else {
      this.addSetDispatch(
        this.state,
        weightInput,
        repsInput,
        distanceInput,
        distanceUnitSelected,
        time,
        rpeInput,
      );
    }
  }

  clearButtonHandler = () => {
    const { selectedSetObj, exercise } = this.state;
    const { primary, secondary } = exercise;

    // Check if set is selected
    if (selectedSetObj) {
      this.onUnselectSetObj();
      this.removeSetDispatch(selectedSetObj);
    } else {
      this.setState({
        ...this.getDefaultInputState(primary, secondary),
      });
    }
  };

  render = () => {
    const { exercise } = this.state;
    const { primary, secondary } = exercise;

    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={this.clearButtonHandler}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <this.getExerciseInput
          property={primary}
          state={this.state}
          setState={(newState) => { this.setState(newState); }}
        />
        <this.getExerciseInput
          property={secondary}
          state={this.state}
          setState={(newState) => { this.setState(newState); }}
        />

        <TextInput
          style={styles.rpeInput}
          onChangeText={(text) => { this.setState({ rpeInput: text }); }}
          value={this.state.rpeInput} // eslint-disable-line
          placeholder="RPE"
          keyboardType="decimal-pad"
          maxLength={4}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={this.addSetHandler}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

Footer.propTypes = {
  date: PropTypes.string.isRequired,
  exercise: PropTypes.shape({
    name: PropTypes.string,
    primary: PropTypes.string,
    secondary: PropTypes.string,
  }).isRequired,
  getOnSelectSetObj: PropTypes.func,
  getOnUnselectSetObj: PropTypes.func,
  addSetDispatch: PropTypes.func.isRequired,
  updateSetDispatch: PropTypes.func.isRequired,
  removeSetDispatch: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  getOnSelectSetObj: () => {},
  getOnUnselectSetObj: () => {},
};

const mapDispatchToProps = (dispatch) => ({
  addSetDispatch: (state, weight, reps, distance, distanceUnit, time, rpe) => {
    const { date, exercise } = state;

    dispatch(addSetAction({
      key: `${date}-${exercise}-${Date.now()}`,
      date,
      exercise: exercise.name,
      weight,
      weightUnit: 'lbs',
      reps,
      distance,
      distanceUnit,
      time,
      rpe,
    }));
  },
  updateSetDispatch: (set) => {
    dispatch(updateSetAction(set));
  },
  removeSetDispatch: (set) => {
    dispatch(removeSetAction(set));
  },
});

export default connect(null, mapDispatchToProps)(Footer);
