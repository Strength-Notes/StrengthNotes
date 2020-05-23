import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendario';

export default function App() {
  return (
    <View style={styles.container}>
      <Calendar
        onChange={date => {console.log(date.startDate)}}
        disableRange  
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
