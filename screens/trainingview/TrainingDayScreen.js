import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/AntDesign';
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
  addExerciseButton: {
    alignSelf: 'center',
    margin: 16,
  },
});

class TrainingDayScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      date: props.route.params.date,
      sets: props.sets,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    const { date } = nextProps.route.params;
    const { sets } = nextProps;

    this.setState({
      date,
      sets,
    });
  }

  prettifyDateString = (dateString) => {
    const b = dateString.split(/\D+/);
    const date = new Date(Date.UTC(b[0], b[1] - 1, b[2]));

    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (dateString) {
      case getFormattedDateString(today): {
        return 'Today';
      }
      case getFormattedDateString(yesterday): {
        return 'Yesterday';
      }
      case getFormattedDateString(tomorrow): {
        return 'Tomorrow';
      }
      default: {
        break;
      }
    }

    const d = date.toString().split(' ');

    // Use date.getUTCDate() to avoid weird bugs around midnight
    const prettyDate = `${d[0]} ${d[1]} ${date.getUTCDate()} ${d[3]}`;
    return prettyDate;
  }

  render() {
    const { date, sets } = this.state;
    let { exerciseNamesToday } = this.state;
    const setsToday = getSetsAtDate(sets, date);
    if (!exerciseNamesToday) {
      exerciseNamesToday = getExercises(setsToday);
    }

    return (
      <View style={styles.container}>
        <View style={styles.dateHeaderContainer}>
          <Text style={styles.dateHeader}>{this.prettifyDateString(date)}</Text>
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
                date={date}
              />
            )
          }
          keyExtractor={(item) => `draggable-item-${item}`}
          onDragEnd={({ data }) => { this.setState({ exerciseNamesToday: data }); }}
        />
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => {
            this.navigation.navigate(
              'AddExerciseScreen',
              { date },
            );
          }}
        >
          <Icon name="plus" size={64} color="#999" />
        </TouchableOpacity>
      </View>
    );
  }
}

TrainingDayScreen.propTypes = {
  sets: PropTypes.arrayOf(PropTypes.object).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  sets: state.sets,
});

export default connect(mapStateToProps)(TrainingDayScreen);
