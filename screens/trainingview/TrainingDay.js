import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

export default class TrainingDay extends React.Component {

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
