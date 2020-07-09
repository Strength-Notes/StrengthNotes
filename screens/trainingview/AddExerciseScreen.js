import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

const exercisesAvailable = [
  'Squat', 'Bench', 'Deadlift', 'Overhead Press',
  'Power Clean', 'Clean', 'Clean and Jerk', 'Snatch',
  'Log Press', 'Viking Press', 'Axle Deadlift', 'Axle Clean and Press',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  exerciseName: {
    margin: 2,
    marginLeft: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    height: 32,
  },
  exerciseNameText: {
    fontSize: 16,
    margin: 5,
  },
});

class AddExerciseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.date = props.route.params.date;
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            { data: exercisesAvailable, key: 'Exercises' },
          ]}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.key}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.navigation.navigate(
                  'ExerciseScreen',
                  {
                    date: this.date,
                    exercise: item,
                  },
                );
              }}
            >
              <View style={styles.exerciseName}>
                <Text style={styles.exerciseNameText}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => (`${item}-${index}`)}
        />
      </View>
    );
  }
}

AddExerciseScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default AddExerciseScreen;
