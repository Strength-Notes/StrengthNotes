import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
// eslint-disable-next-line import/no-named-default
import { default as AntIcon } from 'react-native-vector-icons/AntDesign';
// eslint-disable-next-line import/no-named-default
import { default as MaterialIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeSetAction } from '../../../redux/actions';
import { getFormattedDateString, getDateObjectFromString, getSetsOfExercise } from '../../../redux/organizers';
import TrainingList from './TrainingList';

const styles = StyleSheet.create({
  headerBarRightContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerBarCalendarButton: {
    margin: 10,
  },
  headerBarAddExerciseButton: {
    margin: 10,
  },
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

const {
  set,
  cond,
  block,
  eq,
  add,
  multiply,
  Value,
  event,
  call,
} = Animated;

class TrainingDayScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.removeSetDispatch = props.removeSetDispatch;

    this.state = {
      date: props.route.params.date,
      sets: props.sets,
    };

    this.translateX = new Value(0);
    const offsetX = new Value(0);

    this.onPanGestureEvent = event([
      {
        nativeEvent: ({ translationX: x, state }) => (
          block([
            set(this.translateX, multiply(add(x, offsetX), 1.3)),
            cond(eq(state, State.END), [
              call([multiply(add(x, offsetX), 1.3)], this.onSwipeEnd),
            ]),
          ])
        ),
      },
    ]);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    const { date } = nextProps.route.params;
    const { sets } = nextProps;

    this.setState({
      date,
      sets,
    });
  }

  shiftDateString = (dateString, daysToShift) => {
    const dateObj = getDateObjectFromString(dateString);
    dateObj.setDate(dateObj.getDate() + daysToShift);

    return getFormattedDateString(dateObj);
  }

  prettifyDateString = (dateString) => {
    const date = getDateObjectFromString(dateString);

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

  onSwipeEnd = ([xDistance]) => {
    const { width } = Dimensions.get('window');
    const xThreshold = width / 2;

    const isLeft = xDistance > 0;

    if ((isLeft && xDistance < xThreshold)
      || (!isLeft && xDistance > -xThreshold)) {
      // Didn't cross the activation point to change screens
      Animated.timing(this.translateX, {
        toValue: 0,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
      }).start();
    } else { // Switch screens
      Animated.timing(this.translateX, {
        toValue: isLeft ? width : -width,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
      }).start(
        () => {
          setTimeout(() => {
            const { date } = this.state;

            this.translateX.setValue(0);

            this.navigation.setParams({
              date: this.shiftDateString(date, isLeft ? -1 : 1),
            });
          }, 0);
        },
      );
    }
  }

  updateNavigationHeader = (selectedExerciseNames, setsAtDate) => {
    if (selectedExerciseNames.length > 0) {
      this.navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerBarRightContainer}>
            <TouchableOpacity
              style={styles.headerBarAddExerciseButton}
              onPress={() => {
                selectedExerciseNames.forEach((name) => {
                  const setsList = getSetsOfExercise(setsAtDate, name);

                  setsList.forEach((setItem) => {
                    this.removeSetDispatch(setItem);
                  });
                });
                // Clear the array
                // eslint-disable-next-line no-param-reassign
                selectedExerciseNames.length = 0;
              }}
            >
              <Icon name="trash-2" size={40} color="red" />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      this.navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerBarRightContainer}>
            <TouchableOpacity
              style={styles.headerBarAddExerciseButton}
              onPress={() => {
                requestAnimationFrame(() => {
                  this.navigation.navigate(
                    'AddExerciseScreen',
                    { date: this.state.date }, // eslint-disable-line react/destructuring-assignment
                  );
                });
              }}
            >
              <AntIcon name="plus" size={40} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBarCalendarButton}
              onPress={() => {
                requestAnimationFrame(() => {
                  this.navigation.navigate(
                    'TrainingCalendar',
                    // eslint-disable-next-line react/destructuring-assignment
                    { selectedDate: this.state.date },
                  );
                });
              }}
            >
              <MaterialIcon
                name="calendar-month-outline"
                size={40}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  };

  render() {
    const { date, sets } = this.state;

    const { width } = Dimensions.get('window');

    const yesterday = this.shiftDateString(date, -1);
    const tomorrow = this.shiftDateString(date, 1);

    return (
      <View style={styles.container}>
        <View style={styles.dateHeaderContainer}>
          <Text style={styles.dateHeader}>{this.prettifyDateString(date)}</Text>
        </View>
        <PanGestureHandler
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.onPanGestureEvent}
        >
          <Animated.View
            style={[{ transform: [{ translateX: this.translateX }] }, { flex: 1, flexDirection: 'row' }]}
          >
            <TrainingList
              navigation={this.navigation}
              sets={sets}
              date={yesterday}
              xPositionOffset={-width}
            />
            <View>
              <TrainingList
                navigation={this.navigation}
                sets={sets}
                date={date}
                xPositionOffset={0}
                updateNavigationHeader={this.updateNavigationHeader}
              />
            </View>
            <TrainingList
              navigation={this.navigation}
              sets={sets}
              date={tomorrow}
              xPositionOffset={0}
            />
          </Animated.View>
        </PanGestureHandler>
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
  removeSetDispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  removeSetDispatch: (setObj) => {
    dispatch(removeSetAction(setObj));
  },
});

const mapStateToProps = (state) => ({
  sets: state.sets,
});

export default connect(mapStateToProps, mapDispatchToProps)(TrainingDayScreen);
