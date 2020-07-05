import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { connect } from 'react-redux';
import ExerciseCard from './ExerciseCard';
import {
  getSetsAtDate,
  getExercises,
  getSetsOfExercise,
  getFormattedDateString,
} from '../../redux/organizers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateHeaderContainer: {
    backgroundColor: 'lightgray',
  },
  dateHeader: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
  },
});

class TrainingDay extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      date: props.route.params.date,
      exerciseSets: props.exerciseSets,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    const { date } = nextProps.route.params;
    const { exerciseSets } = nextProps;

    this.setState({
      date,
      exerciseSets,
    });
  }

  render() {
    const { date, exerciseSets } = this.state;
    let { exerciseNamesToday } = this.state;
    const formattedDate = getFormattedDateString(date);
    const setsToday = getSetsAtDate(exerciseSets, formattedDate);
    if (!exerciseNamesToday) {
      exerciseNamesToday = getExercises(setsToday);
    }

    return (
      <View style={styles.container}>
        <View style={styles.dateHeaderContainer}>
          <Text style={styles.dateHeader}>{date.toDateString()}</Text>
        </View>
        <DraggableFlatList
          data={exerciseNamesToday}
          renderItem={
            ({ item, drag }) => (
              <ExerciseCard
                name={item}
                sets={getSetsOfExercise(setsToday, item)}
                drag={drag}
                navigation={this.navigation}
              />
            )
          }
          keyExtractor={(item) => `draggable-item-${item}`}
          onDragEnd={({ data }) => { this.setState({ exerciseNamesToday: data }); }}
        />
      </View>
    );
  }
}

TrainingDay.propTypes = {
  exerciseSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  exerciseSets: state,
});

export default connect(mapStateToProps)(TrainingDay);
