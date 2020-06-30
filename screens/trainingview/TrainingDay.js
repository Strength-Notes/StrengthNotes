import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Card } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const exercisesToday = {
  Squats: {
    315: 5,
    405: 3,
    495: 1,
  },
  Bench: {
    225: 5,
    315: 2,
  },
};

function Today({ navigation }) {
  return (
    <SafeAreaView>
      <ScrollView>
        {
          Object.keys(exercisesToday).map((name) => (
            <TouchableOpacity onPress={() => (navigation.navigate('ExerciseScreen'))}>
              <Card title={name}>
                {
                  Object.keys(exercisesToday[name]).map((weight) => (
                    <Text style={styles.setsAndReps}>
                      {weight}: {exercisesToday[name][weight]}
                    </Text>
                  ))
                }
              </Card>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

Today.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const Tab = createMaterialTopTabNavigator();

const TrainingDay = ({ route }) => {
  const todayDate = route.params.startDate;
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);

  return (
    <Tab.Navigator
      initialRouteName={todayDate.toDateString()}
    >
      <Tab.Screen name={yesterdayDate.toDateString()} component={Today} />
      <Tab.Screen name={todayDate.toDateString()} component={Today} />
      <Tab.Screen name={tomorrowDate.toDateString()} component={Today} />
    </Tab.Navigator>
  );
};

TrainingDay.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      startDate: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  setsAndReps: {
    fontSize: 16,
  },
});

export default TrainingDay;
