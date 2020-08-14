import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  BackHandler,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reorderSetsOfExerciseAction } from '../../../redux/actions';
import { getSetsAtDate, getExercises, getSetsOfExercise } from '../../../redux/organizers';
import ExerciseCard, { SelectEvent } from './ExerciseCard';

const styles = StyleSheet.create({
  emptyDayView: {
    margin: 48,
  },
  emptyDayText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

class TrainingList extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.reorderSetsOfExerciseDispatch = props.reorderSetsOfExerciseDispatch;

    const {
      sets,
      date,
      xPositionOffset,
      updateNavigationHeader,
      clearSelection,
    } = props;

    clearSelection(this.clearSelection);

    this.state = {
      sets,
      date,
      xPositionOffset,
      updateNavigationHeader,
      selectedExerciseNames: [],
    };

    const onBackPress = () => {
      if (this.isInSelectionMode()) {
        this.clearSelection();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    const { sets, date, xPositionOffset } = newProps;
    this.setState({
      sets,
      date,
      xPositionOffset,
    });
  }

  isInSelectionMode = () => {
    const { selectedExerciseNames } = this.state;
    return selectedExerciseNames.length > 0;
  };

  isSelected = (exerciseName) => {
    const { selectedExerciseNames } = this.state;
    return selectedExerciseNames.indexOf(exerciseName) !== -1;
  }

  clearSelection = () => {
    const { selectedExerciseNames } = this.state;
    selectedExerciseNames.length = 0;
    this.setState({
      selectedExerciseNames,
    });
  };

  render() {
    const {
      sets,
      date,
      xPositionOffset,
      selectedExerciseNames,
      updateNavigationHeader,
    } = this.state;
    let { exerciseNamesToday } = this.state;

    const setsAtDate = getSetsAtDate(sets, date);

    updateNavigationHeader(selectedExerciseNames, setsAtDate);

    if (!exerciseNamesToday) {
      exerciseNamesToday = getExercises(setsAtDate);
    }

    const { width, height } = Dimensions.get('window');

    if (exerciseNamesToday.length > 0) {
      return (
        <DraggableFlatList
          style={{ transform: [{ translateX: xPositionOffset }], width, height }}
          data={exerciseNamesToday}
          renderItem={
            ({ item, drag }) => (
              <ExerciseCard
                name={item}
                sets={getSetsOfExercise(setsAtDate, item)}
                drag={drag}
                navigation={this.navigation}
                date={date}
                onSelectEvent={(type) => {
                  switch (type) {
                    case SelectEvent.SELECTED: {
                      selectedExerciseNames.push(item);
                      this.setState({
                        selectedExerciseNames,
                      });
                      break;
                    }
                    case SelectEvent.UNSELECTED: {
                      // Remove from array
                      const index = selectedExerciseNames.indexOf(item);
                      if (index > -1) {
                        selectedExerciseNames.splice(index, 1);
                      }
                      this.setState({
                        selectedExerciseNames,
                      });
                      break;
                    }
                    default: {
                      // Do nothing
                    }
                  }
                }}
                isInSelectionMode={this.isInSelectionMode()}
                isSelected={this.isSelected(item)}
              />
            )
          }
          keyExtractor={(item) => `draggable-item-${item}`}
          onDragEnd={({ data }) => {
            this.setState({ exerciseNamesToday: data });
            this.reorderSetsOfExerciseDispatch(date, data);
          }}
          activationDistance={5}
        />
      );
    } // Today is empty
    return (
      <DraggableFlatList
        style={{ transform: [{ translateX: xPositionOffset }], width, height }}
        data={['Nothing to show.\r\n Start a new session?']}
        renderItem={
          ({ item }) => (
            <View style={styles.emptyDayView}>
              <Text style={styles.emptyDayText}>{item}</Text>
            </View>
          )
        }
        keyExtractor={(item) => `draggable-item-${item}`}
        onDragEnd={({ data }) => { this.setState({ exerciseNamesToday: data }); }}
        activationDistance={5}
      />
    );
  }
}

TrainingList.propTypes = {
  sets: PropTypes.arrayOf(PropTypes.object).isRequired,
  date: PropTypes.string.isRequired,
  xPositionOffset: PropTypes.number.isRequired,
  reorderSetsOfExerciseDispatch: PropTypes.func.isRequired,
  updateNavigationHeader: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  clearSelection: PropTypes.func,
};

TrainingList.defaultProps = {
  updateNavigationHeader: () => {},
  clearSelection: () => {},
};

const mapDispatchToProps = (dispatch) => ({
  reorderSetsOfExerciseDispatch: (date, exerciseList) => {
    dispatch(reorderSetsOfExerciseAction(date, exerciseList));
  },
});

export default connect(null, mapDispatchToProps)(TrainingList);
