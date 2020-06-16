import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendario';
import { createStackNavigator } from '@react-navigation/stack';
import TrainingCalendar from './trainingview/TrainingCalendar.js';
import TrainingDay from './trainingview/TrainingDay.js';


const TrainingStack = createStackNavigator()

export default class TrainingView extends React.Component {

  render() {
    return (
      <TrainingStack.Navigator
        screenOptions={{
          title: "Training Calendar"
        }}
      >
        <TrainingStack.Screen name="TrainingCalendar" component={TrainingCalendar} />
        <TrainingStack.Screen name="TrainingDay" component={TrainingDay} />
      </TrainingStack.Navigator>
     );
  }

}
