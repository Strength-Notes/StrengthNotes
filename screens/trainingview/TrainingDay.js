import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator()

export default class TrainingDay extends React.Component {

  render() {
    let todayDate = this.props.route.params.startDate
    let tomorrowDate = new Date(todayDate)
    tomorrowDate.setDate(todayDate.getDate() + 1)
    let yesterdayDate = new Date(todayDate)
    yesterdayDate.setDate(todayDate.getDate() - 1)

    return (
      <Tab.Navigator
        initialRouteName={todayDate.toDateString()}
      >
        <Tab.Screen name={yesterdayDate.toDateString()} component={Today} />
        <Tab.Screen name={todayDate.toDateString()} component={Today} />
        <Tab.Screen name={tomorrowDate.toDateString()} component={Today} />
      </Tab.Navigator>
    );
  }
}

class Today extends React.Component {

  render() {
    return (
      <View>
        <FlatList
          data={[
            {key: 'Squats: 5x5'},
          ]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      </View>
     );
  }

}


