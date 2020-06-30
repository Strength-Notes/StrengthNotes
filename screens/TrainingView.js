import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrainingCalendar from './trainingview/TrainingCalendar';
import TrainingDay from './trainingview/TrainingDay';
import ExerciseScreen from './trainingview/ExerciseScreen';

const TrainingStack = createStackNavigator();

const TrainingView = () => (
  <TrainingStack.Navigator
    screenOptions={{
      title: 'Training Calendar',
    }}
  >
    <TrainingStack.Screen name="TrainingCalendar" component={TrainingCalendar} />
    <TrainingStack.Screen name="TrainingDay" component={TrainingDay} />
    <TrainingStack.Screen name="ExerciseScreen" component={ExerciseScreen} />
  </TrainingStack.Navigator>
);

export default TrainingView;
