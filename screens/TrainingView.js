import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrainingCalendar from './trainingview/TrainingCalendar';
import TrainingDay from './trainingview/TrainingDay';

const TrainingStack = createStackNavigator();

const TrainingView = () => (
  <TrainingStack.Navigator
    screenOptions={{
      title: 'Training Calendar',
    }}
  >
    <TrainingStack.Screen name="TrainingCalendar" component={TrainingCalendar} />
    <TrainingStack.Screen name="TrainingDay" component={TrainingDay} />
  </TrainingStack.Navigator>
);

export default TrainingView;
