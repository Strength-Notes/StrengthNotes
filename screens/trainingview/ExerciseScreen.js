import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Feather';
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
  weightInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
    marginLeft: 32,
    width: 81,
  },
  repsInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
    marginLeft: 4,
    width: 49,
  },
  rpeInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
    marginLeft: 4,
    width: 40,
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

    // Return state object
    return {
      sets,
      date,
      exercise,
      setsOfExercise,
    };
  }

  addSetHandler = () => {
    let { weightInput, repsInput, rpeInput } = this.state;

    if (weightInput === '' || repsInput === '') {
      return; // Error: weight and reps cannot be blank
    }

    weightInput = Number(weightInput);
    repsInput = Number(repsInput);
    rpeInput = Number(rpeInput);

    this.addSetDispatch(this.state, weightInput, repsInput, rpeInput);
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

  getSetRow = ({ setObj }) => (
    <Swipeable
      renderRightActions={this.getRightActions(setObj)}
    >
      <View style={styles.setRow}>
        <View style={styles.alignedColumnsContainer}>
          <Text style={styles.weightNum}>{setObj.weight} </Text>
          <Text style={styles.weightUnit}>{setObj.weightUnit}</Text>
        </View>

        <View style={styles.alignedColumnsContainer}>
          <Text style={styles.repsNum}>{setObj.reps} </Text>
          <Text style={styles.repsLabel}>reps</Text>
        </View>

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

  getFooter = () => (
    <View style={styles.footerContainer}>
      <TextInput
        style={styles.weightInput}
        onChangeText={(text) => { this.setState({ weightInput: text }); }}
        value={this.state.weightInput} // eslint-disable-line
        placeholder="Weight"
        keyboardType="decimal-pad"
        maxLength={7}
      />
      <TextInput
        style={styles.repsInput}
        onChangeText={(text) => { this.setState({ repsInput: text }); }}
        value={this.state.repsInput} // eslint-disable-line
        placeholder="Reps"
        keyboardType="decimal-pad"
        maxLength={4}
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
  addSetDispatch: (state, weight, reps, rpe) => {
    dispatch(addSetAction({
      key: `${state.date}-${state.exercise}-${Date.now()}`,
      date: state.date,
      exercise: state.exercise.name,
      weight,
      weightUnit: 'lbs',
      reps,
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
