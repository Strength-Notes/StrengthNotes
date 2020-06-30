import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { Card } from 'react-native-elements';

function ExerciseScreen() {
  return (
    <SafeAreaView>
      <Text>Exercise</Text>
    </SafeAreaView>
  );
}

/*ExerciseScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      startDate: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
};*/

const styles = StyleSheet.create({
  exerciseTitle: {
    fontWeight: 'bold',
  },
});

export default ExerciseScreen;
