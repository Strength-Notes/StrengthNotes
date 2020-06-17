import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendario';

export default class TrainingCalendar extends React.Component {

  render() {
    return (
      <View>
        <Calendar
          onChange={range =>
            this.props.navigation.navigate(
              'TrainingDay',
              { startDate: range.startDate }
          )}
          disableRange
        />
      </View>
     );
  }

}
