import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  headerBarRightContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerBarCreateExerciseButton: {
    margin: 10,
  },
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

    this.navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerBarRightContainer}>
          <TouchableOpacity
            style={styles.headerBarCreateExerciseButton}
            onPress={() => {
              requestAnimationFrame(() => {
                this.navigation.navigate('CreateExerciseScreen');
              });
            }}
          >
            <Icon name="plus" size={40} color="#999" />
          </TouchableOpacity>
        </View>
      ),
    });

    this.state = {
      date: props.route.params.date,
      exercises: props.exercises,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      date: newProps.route.params.date,
      exercises: newProps.exercises,
    });
  }

  render() {
    const { date, exercises } = this.state;
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            { data: exercises, key: 'Exercises' },
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
                    date,
                    exercise: item,
                  },
                );
              }}
            >
              <View style={styles.exerciseName}>
                <Text style={styles.exerciseNameText}>{item.name}</Text>
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
      date: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  exercises: state.exercises,
});

export default connect(mapStateToProps)(AddExerciseScreen);
