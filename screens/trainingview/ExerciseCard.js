import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import { shapeOfSetObject } from '../../redux/store';

const styles = StyleSheet.create({
  exerciseName: {
    textAlign: 'left',
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weightNum: {
    fontSize: 16,
  },
  weightUnit: {
    fontSize: 12,
  },
  repsNum: {
    marginLeft: 40,
    fontSize: 16,
  },
  repsLabel: {
    fontSize: 12,
  },
  rpe: {
    marginLeft: 48,
    fontSize: 16,
  },
  cardSelected: {
    backgroundColor: 'lightblue',
  },
});

class ExerciseCard extends React.Component {
  constructor(props) {
    super(props);

    this.name = props.name; // Exercise name
    this.drag = props.drag; // Drag function (for draggable list)
    this.navigation = props.navigation;
    this.date = props.date; // Needed for navigation to ExerciseScreen

    this.state = {
      sets: props.sets,
      isSelected: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    this.setState({
      sets: nextProps.sets,
    });
  }

  handlePress() { // eslint-disable-line
    const { isSelected } = this.state;
    if (isSelected) {
      this.toggleSelected();
    } else {
      this.navigation.navigate(
        'ExerciseScreen',
        {
          date: this.date,
          exercise: this.name,
        },
      );
    }
  }

  handleLongPress() {
    const { isSelected } = this.state;
    if (isSelected) {
      this.drag();
    }
    this.toggleSelected();
  }

  toggleSelected() {
    const { isSelected } = this.state;

    this.setState({
      isSelected: !isSelected,
    });
  }

  getSetRow = (setObj) => (
    <View
      key={setObj.key}
      style={styles.setRow}
    >
      <Text style={styles.weightNum}>{setObj.weight}</Text>
      <Text style={styles.weightUnit}> {setObj.weightUnit}</Text>

      <Text style={styles.repsNum}>{setObj.reps}</Text>
      <Text style={styles.repsLabel}> reps</Text>
      { // Only render RPE if the field exists
        setObj.rpe ? (
          <Text style={styles.rpe}>
            RPE {setObj.rpe}
          </Text>
        ) : []
      }
    </View>
  );

  render() {
    const { isSelected, sets } = this.state;

    return (
      <TouchableOpacity
        onPress={() => (this.handlePress())}
        onLongPress={() => (this.handleLongPress())}
      >
        <Card
          title={this.name}
          titleStyle={styles.exerciseName}
          containerStyle={isSelected ? styles.cardSelected : null}
        >
          {
            // Render each set under it's respective exercise name
            sets.map((setObj) => (
              this.getSetRow(setObj)
            ))
          }
        </Card>
      </TouchableOpacity>
    );
  }
}

ExerciseCard.propTypes = {
  name: PropTypes.string.isRequired,
  sets: PropTypes.arrayOf(shapeOfSetObject).isRequired,
  drag: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  date: PropTypes.string.isRequired,
};

export default ExerciseCard;
