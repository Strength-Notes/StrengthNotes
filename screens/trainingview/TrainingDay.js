import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function Today() {
  return (
    <View>
      <FlatList
        data={[
          { key: 'Squats: 5x5' },
        ]}
        renderItem={({ item }) => <Text>{item.key}</Text>}
      />
    </View>
  );
}

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
      startDate: PropTypes.instaceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
};

export default TrainingDay;
