import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExerciseProperties from '../../redux/ExerciseProperties';
import { shapeOfSetObject } from '../../redux/store';
import { getExerciseObjectFromName } from '../../redux/organizers';

const styles = StyleSheet.create({
  exerciseName: {
    textAlign: 'left',
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  alignedColumnsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  weightNum: {
    fontSize: 16,
  },
  weightUnit: {
    fontSize: 12,
  },
  repsNum: {
    fontSize: 16,
  },
  repsLabel: {
    fontSize: 12,
    textAlign: 'right',
  },
  rpe: {
    marginLeft: 48,
    fontSize: 16,
    flex: 1,
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

    const exercise = getExerciseObjectFromName(props.exercises, this.name);

    this.state = {
      sets: props.sets,
      isSelected: false,
      exercise,
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
          exerciseString: this.name,
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

  // For whatever bizarre reason, an error occurs when making this an arrow func
  // eslint-disable-next-line class-methods-use-this
  getExercisePropertyView({ setObj, property }) {
    switch (property) {
      case ExerciseProperties.WEIGHT: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.weightNum}>{setObj.weight} </Text>
            <Text style={styles.weightUnit}>{setObj.weightUnit}</Text>
          </View>
        );
      }
      case ExerciseProperties.REPS: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.repsNum}>{setObj.reps} </Text>
            <Text style={styles.repsLabel}>reps</Text>
          </View>
        );
      }
      case ExerciseProperties.DISTANCE: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.repsNum}>{setObj.distance} </Text>
            <Text style={styles.repsLabel}>{setObj.distanceUnit}</Text>
          </View>
        );
      }
      case ExerciseProperties.TIME: {
        const formattedTime = new Date(setObj.time * 1000 || 0) // 0 if NaN
          .toISOString()
          .substr(11, 8);
        return (
          <View style={[styles.alignedColumnsContainer, { marginLeft: 20 }]}>
            <Text style={styles.repsNum}>{formattedTime}</Text>
          </View>
        );
      }
      default: {
        return (<View style={styles.alignedColumnsContainer} />);
      }
    }
  }

  getSetRow = (setObj) => {
    // eslint-disable-next-line react/destructuring-assignment
    const { primary, secondary } = this.state.exercise;

    return (
      <View
        key={setObj.key}
        style={styles.setRow}
      >
        <this.getExercisePropertyView
          setObj={setObj}
          property={primary}
        />

        <this.getExercisePropertyView
          setObj={setObj}
          property={secondary}
        />

        <Text style={styles.rpe}>
          { // Only render RPE if the field exists
            setObj.rpe ? (
              `RPE ${setObj.rpe}`
            ) : []
          }
        </Text>
      </View>
    );
  }

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
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  exercises: state.exercises,
});

export default connect(mapStateToProps)(ExerciseCard);
