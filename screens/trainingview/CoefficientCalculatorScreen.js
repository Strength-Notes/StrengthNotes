import React from 'react';
import {
  View,
  Text,
  TextInput,
  Picker,
  ScrollView,
} from 'react-native';
import { Card } from 'react-native-elements';
import styles from './CoefficientCalculatorScreen.styles';

const wilksValuesMen = [
  -216.0475144,
  16.2606339,
  -0.002388645,
  -0.00113732,
  7.01863E-06,
  -1.291E-08,
];

const wilksValuesWomen = [
  594.31747775582,
  -27.23842536447,
  0.82112226871,
  -0.00930733913,
  4.731582E-05,
  -9.054E-08,
];

const dotsValuesMen = [
  -307.75076,
  24.0900756,
  -0.1918759221,
  0.0007391293,
  -0.0000010930,
];

const dotsValuesWomen = [
  -57.96288,
  13.6175032,
  -0.1126655495,
  0.0005158568,
  -0.0000010706,
];

class CoefficientCalculatorScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genderSelected: 'MALE',
      unitSelected: 'lb',
      bodyweightInput: '',
      totalInput: '',
    };
  }

  calculateWilks = (gender, bw) => {
    const numerator = 500;
    let denominator = 0;

    if (gender === 'MALE') {
      denominator = wilksValuesMen[0] + wilksValuesMen[1] * bw;
      denominator += wilksValuesMen[2] * bw ** 2 + wilksValuesMen[3] * bw ** 3;
      denominator += wilksValuesMen[4] * bw ** 4 + wilksValuesMen[5] * bw ** 5;
    } else if (gender === 'FEMALE') {
      denominator = wilksValuesWomen[0] + wilksValuesWomen[1] * bw;
      denominator += wilksValuesWomen[2] * bw ** 2 + wilksValuesWomen[3] * bw ** 3;
      denominator += wilksValuesWomen[4] * bw ** 4 + wilksValuesWomen[5] * bw ** 5;
    }

    return numerator / denominator;
  };

  calculateDots = (gender, bw) => {
    const numerator = 500;
    let denominator = 0;

    if (gender === 'MALE') {
      denominator = dotsValuesMen[0] + dotsValuesMen[1] * bw;
      denominator += dotsValuesMen[2] * bw ** 2 + dotsValuesMen[3] * bw ** 3;
      denominator += dotsValuesMen[4] * bw ** 4;
    } else if (gender === 'FEMALE') {
      denominator = dotsValuesWomen[0] + dotsValuesWomen[1] * bw;
      denominator += dotsValuesWomen[2] * bw ** 2 + dotsValuesWomen[3] * bw ** 3;
      denominator += dotsValuesWomen[4] * bw ** 4;
    }

    return numerator / denominator;
  };

  render() {
    const {
      genderSelected,
      unitSelected,
      bodyweightInput,
      totalInput,
    } = this.state;

    let bodyweightKg = Number(bodyweightInput);
    let totalKg = Number(totalInput);

    if (unitSelected === 'lb') {
      bodyweightKg *= 0.4535924;
      totalKg *= 0.4535924;
    }

    const wilksCoefficient = bodyweightKg !== 0
      ? this.calculateWilks(genderSelected, bodyweightKg) : 0;
    const wilksPoints = wilksCoefficient * totalKg;

    const dotsCoefficient = bodyweightKg !== 0
      ? this.calculateDots(genderSelected, bodyweightKg) : 0;
    const dotsPoints = dotsCoefficient * totalKg;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.rowLabel}>Wilks</Text>
          <View style={styles.rowNumsContainer}>
            <Text style={styles.rowPointsLabel}>
              { wilksPoints.toFixed(2) }
            </Text>
            <Text style={styles.rowCoefficientLabel}>
              { wilksCoefficient.toFixed(4) }
            </Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.rowLabel}>Dots</Text>
          <View style={styles.rowNumsContainer}>
            <Text style={styles.rowPointsLabel}>
              { dotsPoints.toFixed(2) }
            </Text>
            <Text style={styles.rowCoefficientLabel}>
              { dotsCoefficient.toFixed(4) }
            </Text>
          </View>
        </View>
        <Card>
          <View>
            <Text style={styles.bodyweightLabel}>Bodyweight</Text>
            <TextInput
              style={styles.bodyweightInput}
              value={bodyweightInput}
              onChangeText={(newValue) => {
                this.setState({
                  bodyweightInput: newValue,
                });
              }}
              keyboardType="number-pad"
              placeholder="Bodyweight"
            />
          </View>
          <View style={styles.totalInputContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <TextInput
              style={styles.totalInput}
              value={totalInput}
              onChangeText={(newValue) => {
                this.setState({
                  totalInput: newValue,
                });
              }}
              keyboardType="number-pad"
              placeholder="Total"
            />
            <Text style={styles.genderPickerLabel}>Gender</Text>
            <Picker
              style={styles.genderPicker}
              selectedValue={genderSelected}
              onValueChange={(selected) => {
                this.setState({ genderSelected: selected });
              }}
              mode="dropdown"
            >
              <Picker.Item label="Male" value="MALE" />
              <Picker.Item label="Female" value="FEMALE" />
            </Picker>
            <Text style={styles.unitsPickerLabel}>Units</Text>
            <Picker
              selectedValue={unitSelected}
              onValueChange={(selected) => {
                this.setState({ unitSelected: selected });
              }}
              mode="dropdown"
            >
              <Picker.Item label="lb" value="lb" />
              <Picker.Item label="kg" value="kg" />
            </Picker>
          </View>
        </Card>
      </ScrollView>
    );
  }
}

export default CoefficientCalculatorScreen;
