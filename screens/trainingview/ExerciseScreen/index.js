import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PropTypes from 'prop-types';
import EntryTab from './EntryTab';
import HistoryTab from './HistoryTab';

const Tab = createMaterialTopTabNavigator();

const ExerciseScreen = ({ route }) => (
  <Tab.Navigator>
    <Tab.Screen
      name="EntryTab"
      component={EntryTab}
      options={{
        title: 'Entry',
      }}
      initialParams={route.params}
    />
    <Tab.Screen
      name="HistoryTab"
      component={HistoryTab}
      options={{
        title: 'History',
      }}
      initialParams={route.params}
    />
  </Tab.Navigator>
);

ExerciseScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.string,
      exerciseString: PropTypes.string,
      exercise: PropTypes.shape({
        name: PropTypes.string,
        category: PropTypes.string,
        primary: PropTypes.string,
        secondary: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default ExerciseScreen;
