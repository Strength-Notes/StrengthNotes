import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrainingCalendar from './trainingview/TrainingCalendar';
import TrainingDayScreen from './trainingview/TrainingDayScreen';
import ExerciseScreen from './trainingview/ExerciseScreen';
import AddExerciseScreen from './trainingview/AddExerciseScreen';

const TrainingStack = createStackNavigator();

const TrainingView = () => (
  <TrainingStack.Navigator
    screenOptions={{
      title: 'Training Calendar',
    }}
  >
    <TrainingStack.Screen name="TrainingCalendar" component={TrainingCalendar} />
    <TrainingStack.Screen name="TrainingDayScreen" component={TrainingDayScreen} />
    <TrainingStack.Screen name="ExerciseScreen" component={ExerciseScreen} />
    <TrainingStack.Screen name="AddExerciseScreen" component={AddExerciseScreen} />
  </TrainingStack.Navigator>
);

export default TrainingView;
