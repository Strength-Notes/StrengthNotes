import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import { Card } from 'react-native-elements';
import styles from './MaxEstimatorScreen.styles';

/* eslint-disable indent */
const maxPercentages = {
  1: 1.00,
  2: 0.97,
  3: 0.945,
  4: 0.915,
  5: 0.89,
  6: 0.86,
  7: 0.83,
  8: 0.805,
  9: 0.775,
 10: 0.75,
 11: 0.73,
 12: 0.715,
 13: 0.695,
 14: 0.68,
 15: 0.665,
};
/* eslint-enable indent */

class MaxEstimatorScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weightInput: '',
      repsInput: '',
    };
  }

  get1RM = (weight, reps) => {
    if (reps <= 0) {
      return 0;
    }
    return (
      reps > 10
        ? weight * (1 + reps / 30) // Epley formula (for > 10 reps)
        : weight * (36 / (37 - reps)) // Bryzcki formula (for < 10 reps)
    );
  };

  getXRM = (max, reps) => (
    max * maxPercentages[reps]
  );

  render() {
    const { weightInput, repsInput } = this.state;

    const estimatedMax = this.get1RM(Number(weightInput), Number(repsInput));

    return (
      <View style={styles.container}>
        <Card>
          <Card.Title>
            {
              Number(repsInput) <= 10
                ? 'Bryzcki Formula'
                : 'Epley Formula'
            }
          </Card.Title>
          <Card.Divider />

          <View style={styles.weightInputContainer}>
            <Text style={styles.weightLabel}>Weight</Text>
            <TextInput
              style={styles.weightInput}
              value={weightInput}
              onChangeText={(newValue) => {
                this.setState({
                  weightInput: newValue,
                });
              }}
              keyboardType="number-pad"
              placeholder="Weight"
            />
          </View>
          <View style={styles.repsInputContainer}>
            <Text style={styles.repsLabel}>Reps</Text>
            <TextInput
              style={styles.repsInput}
              value={repsInput}
              onChangeText={(newValue) => {
                this.setState({
                  repsInput: newValue,
                });
              }}
              keyboardType="number-pad"
              placeholder="Reps"
            />
          </View>
        </Card>
        <ScrollView style={styles.scrollContainer}>
          {
            Object.keys(maxPercentages).map((repCount) => (
              <View
                key={repCount}
                style={styles.rowContainer}
              >
                <Text style={styles.rowRepsLabel}>{repCount}RM</Text>
                <Text style={styles.rowWeightLabel}>
                  {
                    this.getXRM(estimatedMax, Number(repCount))
                      .toFixed(1)
                  }
                </Text>
              </View>
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

export default MaxEstimatorScreen;
