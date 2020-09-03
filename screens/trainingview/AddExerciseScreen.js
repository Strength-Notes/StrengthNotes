import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Text,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/AntDesign';
// eslint-disable-next-line import/no-named-default
import { default as FeatherIcon } from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeExerciseAction } from '../../redux/actions';

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
  rightActionContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  editActionButton: {
    marginRight: 8,
  },
});

const AnimatedFeatherIcon = Animated.createAnimatedComponent(FeatherIcon);

class AddExerciseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.removeExerciseDispatch = props.removeExerciseDispatch;

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

  getRightActions = (exerciseObj) => (dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-10, 0],
      outputRange: [50, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={styles.trashActionButton}
          onPress={() => this.removeExerciseDispatch(exerciseObj)}
        >
          <AnimatedFeatherIcon
            style={[
              styles.trashIcon,
              {
                transform: [{ translateX: trans }],
              },
            ]}
            name="trash-2"
            size={32}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editActionButton}
          onPress={() => {
            this.navigation.navigate(
              'CreateExerciseScreen',
              { exerciseObj },
            );
          }}
        >
          <AnimatedFeatherIcon
            style={[
              styles.editIcon,
              {
                transform: [{ translateX: trans }],
              },
            ]}
            name="edit"
            size={32}
          />
        </TouchableOpacity>
      </View>
    );
  };

  getOrganizedExercisesForList = (exercises) => {
    // Organize by exercise
    const organizedExercises = {};

    exercises.forEach((exercise) => {
      let { category } = exercise;

      // If it's undefined, it's now a Misc!
      if (category === undefined) {
        category = 'Misc';
      }

      if (organizedExercises[category] === undefined) {
        organizedExercises[category] = [];
      }

      organizedExercises[category].push(exercise);
    });

    // Organize into sections data
    const data = [];

    Object.keys(organizedExercises).forEach((key) => {
      data.push({
        data: organizedExercises[key],
        key,
      });
    });

    return data;
  };

  render() {
    const { date, exercises } = this.state;
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.getOrganizedExercisesForList(exercises)}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.key}</Text>
          )}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={this.getRightActions(item)}
            >
              <TouchableOpacity
                onPress={() => {
                  this.navigation.navigate(
                    'ExerciseScreen',
                    { date, exercise: item },
                  );
                }}
              >
                <View style={styles.exerciseName}>
                  <Text style={styles.exerciseNameText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
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
  removeExerciseDispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  exercises: state.exercises,
});

const mapDispatchToProps = (dispatch) => ({
  removeExerciseDispatch: (key) => {
    dispatch(removeExerciseAction(key));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddExerciseScreen);
