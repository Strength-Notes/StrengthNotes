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
import { addSetAction } from '../../../redux/actions';
import styles from './EntryTab.styles';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.addSetDispatch = props.addSetDispatch;

    const { date, exercise } = props;

    this.state = {
      date,
      exercise,
    };
  }

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
    const { distanceUnitSelected } = this.state;
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

  render = () => {
    const { exercise } = this.state;
    const { primary, secondary } = exercise;

    return (
      <View style={styles.footerContainer}>
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
  addSetDispatch: PropTypes.func.isRequired,
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
});

export default connect(null, mapDispatchToProps)(Footer);
