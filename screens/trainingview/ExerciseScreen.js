import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {
  getSetsAtDate,
  getSetsOfExercise,
  getFormattedDateString,
} from '../../redux/organizers';
import { shapeOfSetObject, addSetAction, removeSetAction } from '../../redux/store';

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
    marginLeft: 24,
    marginRight: 24,
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 4,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  weightNum: {
    marginTop: 4,
    marginLeft: 16,
    marginBottom: 4,
    fontSize: 24,
  },
  weightUnit: {
    fontSize: 20,
  },
  repsNum: {
    marginLeft: 40,
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
});

class ExerciseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.addSetDispatch = props.addSetDispatch;

    const { allSets } = props;
    const { date, exercise } = props.route.params;

    const dateString = getFormattedDateString(date);
    const allSetsAtDate = getSetsAtDate(allSets, dateString);
    const sets = getSetsOfExercise(allSetsAtDate, exercise);

    this.state = {
      dateString,
      exercise,
      sets,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    const { date } = nextProps.route.params;
    const { allSets } = nextProps;

    const { exercise } = this.state;

    const dateString = getFormattedDateString(date);
    const allSetsAtDate = getSetsAtDate(allSets, dateString);
    const sets = getSetsOfExercise(allSetsAtDate, exercise);

    this.setState({
      dateString,
      allSets,
      sets,
    });
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

  getSetRow = ({ setObj }) => (
    <View style={styles.setRow}>
      <Text style={styles.weightNum}>{setObj.weight} </Text>
      <Text style={styles.weightUnit}>{setObj.weightUnit}</Text>

      <Text style={styles.repsNum}>{setObj.reps} </Text>
      <Text style={styles.repsLabel}>reps</Text>
      { // Only render RPE if the field exists
        setObj.rpe ? (
          <Text style={styles.rpe}>
            RPE {setObj.rpe}
          </Text>
        ) : []
      }
    </View>
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
    const { exercise, sets } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.exerciseTitle}>{exercise}</Text>
        </View>

        <DraggableFlatList
          style={styles.list}
          data={sets}
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
          onDragEnd={({ data }) => { this.setState({ sets: data }); }}
        />

        <this.getFooter />
      </SafeAreaView>
    );
  }
}

ExerciseScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      exercise: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  addSetDispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  allSets: PropTypes.arrayOf(shapeOfSetObject).isRequired,
};

const mapStateToProps = (state) => ({
  allSets: state,
});

const mapDispatchToProps = (dispatch) => ({
  addSetDispatch: (state, weight, reps, rpe) => {
    dispatch(addSetAction({
      key: `${state.dateString}-${state.exercise}-${Date.now()}`,
      date: state.dateString,
      exercise: state.exercise,
      weight,
      weightUnit: 'lbs',
      reps,
      rpe,
    }));
  },
  removeSetDispatch: (key) => {
    dispatch(removeSetAction(key));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseScreen);
