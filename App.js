import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import TrainingView from './screens/TrainingView';
import store from './redux/store';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="TrainingView" component={TrainingView} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
