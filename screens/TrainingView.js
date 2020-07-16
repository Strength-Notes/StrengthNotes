import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFormattedDateString } from '../redux/organizers';
import TrainingCalendar from './trainingview/TrainingCalendar';
import TrainingDayScreen from './trainingview/TrainingDayScreen';
import ExerciseScreen from './trainingview/ExerciseScreen';
import AddExerciseScreen from './trainingview/AddExerciseScreen';

const styles = StyleSheet.create({
  dayHeaderRight: {
    flex: 1,
    flexDirection: 'row',
  },
  dayTouchable: {
    margin: 5,
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
      options={{
        headerRight: () => (
          <View style={styles.dayHeaderRight}>
            <TouchableOpacity
              style={styles.dayTouchable}
              onPress={() => { navigation.navigate('TrainingCalendar'); }}
            >
              <Icon
                name="calendar-month-outline"
                size={40}
              />
            </TouchableOpacity>
          </View>
        ),
      }}
      initialParams={{ date: getFormattedDateString(new Date()) }}
    />
    <TrainingStack.Screen
      name="TrainingCalendar"
      component={TrainingCalendar}
      options={{ title: 'Calendar' }}
    />
    <TrainingStack.Screen name="ExerciseScreen" component={ExerciseScreen} />
    <TrainingStack.Screen name="AddExerciseScreen" component={AddExerciseScreen} />
  </TrainingStack.Navigator>
);

TrainingView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default TrainingView;
