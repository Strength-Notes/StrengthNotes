import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  View,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PropTypes from 'prop-types';
import EntryTab from './EntryTab';
import HistoryTab from './HistoryTab';

const styles = StyleSheet.create({
  lazyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

const Tab = createMaterialTopTabNavigator();

const lazyPlaceholder = () => (
  <View style={styles.lazyContainer}>
    <ActivityIndicator
      size="large"
    />
  </View>
);

const ExerciseScreen = ({ route }) => (
  <Tab.Navigator
    backBehavior="none"
    lazy
    lazyPlaceholder={lazyPlaceholder}
    initialLayout={{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    }}
  >
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
