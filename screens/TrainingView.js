import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import { getFormattedDateString } from '../redux/organizers';
import TrainingCalendar from './trainingview/TrainingCalendar';
import TrainingDayScreen from './trainingview/TrainingDayScreen';
import ExerciseScreen from './trainingview/ExerciseScreen';
import AddExerciseScreen from './trainingview/AddExerciseScreen';
import CreateExerciseScreen from './trainingview/CreateExerciseScreen';
import MaxEstimatorScreen from './trainingview/MaxEstimatorScreen';
import CoefficientCalculatorScreen from './trainingview/CoefficientCalculatorScreen';
import ImportScreen from './trainingview/ImportScreen';

const styles = StyleSheet.create({
  calendarHeaderRight: {
    flex: 1,
    flexDirection: 'row',
  },
  calendarTouchable: {
    margin: 10,
  },
});

const TrainingStack = createStackNavigator();

const TrainingView = ({ navigation }) => (
  <TrainingStack.Navigator
    screenOptions={{
      title: 'StrengthNotes',
    }}
  >
    <TrainingStack.Screen
      name="TrainingDayScreen"
      component={TrainingDayScreen}
      initialParams={{ date: getFormattedDateString(new Date()) }}
    />
    <TrainingStack.Screen
      name="TrainingCalendar"
      component={TrainingCalendar}
      options={{
        title: 'Calendar',
        headerRight: () => (
          <View style={styles.calendarHeaderRight}>
            <TouchableOpacity
              style={styles.calendarTouchable}
              onPress={() => {
                requestAnimationFrame(() => {
                  navigation.navigate(
                    'TrainingCalendar',
                    { selectedDate: getFormattedDateString(new Date()) },
                  );
                });
              }}
            >
              <Icon
                name="calendar-today"
                size={40}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
    <TrainingStack.Screen name="ExerciseScreen" component={ExerciseScreen} />
    <TrainingStack.Screen name="AddExerciseScreen" component={AddExerciseScreen} />
    <TrainingStack.Screen name="CreateExerciseScreen" component={CreateExerciseScreen} />
    <TrainingStack.Screen name="MaxEstimatorScreen" component={MaxEstimatorScreen} />
    <TrainingStack.Screen name="CoefficientCalculatorScreen" component={CoefficientCalculatorScreen} />
    <TrainingStack.Screen name="ImportScreen" component={ImportScreen} />
  </TrainingStack.Navigator>
);

TrainingView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default TrainingView;
