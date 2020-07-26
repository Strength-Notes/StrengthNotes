import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  Picker,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Feather';
import ExerciseProperties from '../../redux/ExerciseProperties';
import {
  getSetsAtDate,
  getSetsOfExercise,
  getExerciseObjectFromName,
} from '../../redux/organizers';
import {
  addSetAction,
  removeSetAction,
  moveSetAction,
} from '../../redux/actions';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'lightgray',
    marginBottom: 10,
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: 10,
  },
  list: {
    marginLeft: 8,
    marginRight: 8,
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 4,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  alignedColumnsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  weightNum: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 24,
  },
  weightUnit: {
    fontSize: 20,
  },
  repsNum: {
    fontSize: 24,
  },
  repsLabel: {
    fontSize: 20,
  },
  rpe: {
    marginLeft: 48,
    fontSize: 24,
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#6f6b70',
    height: 40,
  },
  compoundContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  weightInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  repsInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  distanceInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  distanceUnitInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  rpeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  addButton: {
    flex: 1,
    margin: 3,
    marginLeft: 16,
  },
  addButtonText: {
    flex: 1,
    fontWeight: 'bold',
    width: 81,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  trashActionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  trashIcon: {
    marginTop: 4,
  },
});

class ExerciseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.addSetDispatch = props.addSetDispatch;
    this.removeSetDispatch = props.removeSetDispatch;
    this.moveSetDispatch = props.moveSetDispatch;

    this.state = this.setupProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    this.setState(this.setupProps(nextProps));
  }

  setupProps = ({ route, sets, exercises }) => {
    const { date } = route.params;
    let { exercise, exerciseString } = route.params;

    if (exerciseString === undefined) {
      // exerciseString is not defined: use object
      exerciseString = exercise.name;
    } else {
      // exerciseString is defined, so let's find the object ourselves
      exercise = getExerciseObjectFromName(exercises, exerciseString);
    }

    const allSetsAtDate = getSetsAtDate(sets, date);
    const setsOfExercise = getSetsOfExercise(allSetsAtDate, exerciseString);

    // Set a default for distanceUnitSelected
    // If this isn't done, a bug will occur when adding sets with default selected
    let distanceUnitSelected = 'm';
    if (this.state) {
      distanceUnitSelected = this.state.distanceUnitSelected; // eslint-disable-line
    }

    // Return state object
    return {
      sets,
      date,
      exercise,
      setsOfExercise,
      distanceUnitSelected,
    };
  }

  // eslint-disable-next-line react/sort-comp
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

  getRightActions = (setObj) => (dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-10, 0],
      outputRange: [50, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton
        style={styles.trashActionButton}
        onPress={() => this.removeSetDispatch(setObj)}
      >
        <AnimatedIcon
          style={[
            styles.trashIcon,
            {
              transform: [{ translateX: trans }],
            },
          ]}
          name="trash-2"
          size={32}
        />
      </RectButton>
    );
  };

  // For whatever bizarre reason, an error occurs when making this an arrow func
  // eslint-disable-next-line class-methods-use-this
  getExercisePropertyView({ setObj, property }) {
    switch (property) {
      case ExerciseProperties.WEIGHT: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.weightNum}>{setObj.weight} </Text>
            <Text style={styles.weightUnit}>{setObj.weightUnit}</Text>
          </View>
        );
      }
      case ExerciseProperties.REPS: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.repsNum}>{setObj.reps} </Text>
            <Text style={styles.repsLabel}>reps</Text>
          </View>
        );
      }
      case ExerciseProperties.DISTANCE: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.repsNum}>{setObj.distance} </Text>
            <Text style={styles.repsLabel}>{setObj.distanceUnit}</Text>
          </View>
        );
      }
      case ExerciseProperties.TIME: {
        const formattedTime = new Date(setObj.time * 1000)
          .toISOString()
          .substr(11, 8);
        return (
          <View style={[styles.alignedColumnsContainer, { marginLeft: 20 }]}>
            <Text style={styles.repsNum}>{formattedTime}</Text>
          </View>
        );
      }
      default: {
        return (<View style={styles.alignedColumnsContainer} />);
      }
    }
  }

  getSetRow = ({ setObj }) => {
    // eslint-disable-next-line react/destructuring-assignment
    const { primary, secondary } = this.state.exercise;

    return (
      <Swipeable
        renderRightActions={this.getRightActions(setObj)}
      >
        <View style={styles.setRow}>
          <this.getExercisePropertyView
            setObj={setObj}
            property={primary}
          />

          <this.getExercisePropertyView
            setObj={setObj}
            property={secondary}
          />

          <Text style={[styles.rpe, styles.alignedColumnsContainer]}>
            { // Only render RPE if the field exists
              setObj.rpe ? (
                `RPE ${setObj.rpe}`
              ) : []
            }
          </Text>
        </View>
      </Swipeable>
    );
  };

  // Cannot be made into an arrow function, as it results in a bug with Expo
  // eslint-disable-next-line class-methods-use-this
  getExerciseInput({ property, state, setState }) {
    switch (property) {
      case ExerciseProperties.WEIGHT: {
        return (
          <TextInput
            style={styles.weightInput}
            onChangeText={(text) => {
              setState({ weightInput: text });
            }}
            value={state.weightInput}
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
            value={state.repsInput}
            placeholder="Reps"
            keyboardType="decimal-pad"
            maxLength={4}
          />
        );
      }
      case ExerciseProperties.DISTANCE: {
        return ( // TODO: change these styles
          <View style={[styles.compoundContainer, { flex: 2 }]}>
            <TextInput
              style={styles.distanceInput}
              onChangeText={(text) => {
                setState({ distanceInput: text });
              }}
              value={state.distanceInput}
              placeholder="Distance"
              keyboardType="decimal-pad"
              maxLength={7}
            />
            <Picker
              style={styles.distanceUnitInput}
              selectedValue={state.distanceUnitSelected}
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
        return ( // TODO: change these styles
          <View style={[styles.compoundContainer, { flex: 3 }]}>
            <TextInput
              style={styles.timeInput}
              onChangeText={(text) => {
                setState({ hoursInput: text });
              }}
              value={state.hoursInput}
              placeholder="HH"
              keyboardType="decimal-pad"
              maxLength={4}
            />
            <TextInput
              style={styles.timeInput}
              onChangeText={(text) => {
                setState({ minutesInput: text });
              }}
              value={state.minutesInput}
              placeholder="MM"
              keyboardType="decimal-pad"
              maxLength={4}
            />
            <TextInput
              style={styles.timeInput}
              onChangeText={(text) => {
                setState({ secondsInput: text });
              }}
              value={state.secondsInput}
              placeholder="SS"
              keyboardType="decimal-pad"
              maxLength={4}
            />
          </View>
        );
      }
      default: {
        return <View />;
      }
    }
  }

  getFooter = () => {
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
          <Text style={styles.addButtonText}>Add Set</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { exercise, setsOfExercise } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        </View>

        <DraggableFlatList
          style={styles.list}
          data={setsOfExercise}
          renderItem={
            ({ item, drag }) => (
              <TouchableOpacity
                onLongPress={drag}
              >
                <this.getSetRow setObj={item} />
              </TouchableOpacity>
            )
          }
          keyExtractor={(item) => `draggable-item-${item.key}`}
          onDragEnd={({ from, to }) => {
            const set = setsOfExercise[from];
            const distanceMoved = to - from;
            this.moveSetDispatch(set, distanceMoved);
          }}
        />

        <this.getFooter />
      </SafeAreaView>
    );
  }
}

ExerciseScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.string.isRequired,
      exercise: PropTypes.shape({
        name: PropTypes.string.isRequired,
        primary: PropTypes.string.isRequired,
        secondary: PropTypes.string,
      }),
      exerciseString: PropTypes.string,
    }).isRequired,
  }).isRequired,
  addSetDispatch: PropTypes.func.isRequired,
  removeSetDispatch: PropTypes.func.isRequired,
  moveSetDispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  sets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  sets: state.sets,
  exercises: state.exercises,
});

const mapDispatchToProps = (dispatch) => ({
  addSetDispatch: (state, weight, reps, distance, distanceUnit, time, rpe) => {
    dispatch(addSetAction({
      key: `${state.date}-${state.exercise}-${Date.now()}`,
      date: state.date,
      exercise: state.exercise.name,
      weight,
      weightUnit: 'lbs',
      reps,
      distance,
      distanceUnit,
      time,
      rpe,
    }));
  },
  removeSetDispatch: (key) => {
    dispatch(removeSetAction(key));
  },
  moveSetDispatch: (set, distanceMoved) => {
    dispatch(moveSetAction(set, distanceMoved));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseScreen);
