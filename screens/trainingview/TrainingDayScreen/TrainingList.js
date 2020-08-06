import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reorderSetsOfExerciseAction } from '../../../redux/actions';
import { getSetsAtDate, getExercises, getSetsOfExercise } from '../../../redux/organizers';
import ExerciseCard from './ExerciseCard';

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

    const { sets, date, xPositionOffset } = props;
    this.state = {
      sets,
      date,
      xPositionOffset,
    };
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

  render() {
    const { sets, date, xPositionOffset } = this.state;
    let { exerciseNamesToday } = this.state;
    const setsToday = getSetsAtDate(sets, date);
    if (!exerciseNamesToday) {
      exerciseNamesToday = getExercises(setsToday);
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
                sets={getSetsOfExercise(setsToday, item)}
                drag={drag}
                navigation={this.navigation}
                date={date}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  reorderSetsOfExerciseDispatch: (date, exerciseList) => {
    dispatch(reorderSetsOfExerciseAction(date, exerciseList));
  },
});

export default connect(null, mapDispatchToProps)(TrainingList);
