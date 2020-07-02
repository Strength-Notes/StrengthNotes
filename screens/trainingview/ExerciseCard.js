import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  exerciseNameStyle: {
    textAlign: 'left',
  },
  setsAndReps: {
    fontSize: 16,
  },
  cardSelected: {
    backgroundColor: 'lightblue',
  },
});

class ExerciseCard extends React.Component {
  constructor(props) {
    super(props);

    this.name = props.name;
    this.sets = props.sets;
    this.drag = props.drag;
    this.navigation = props.navigation;

    this.state = {
      isSelected: false,
    };
  }

  handlePress() {
    const { isSelected } = this.state;
    if (isSelected) {
      this.toggleSelected();
    } else {
      this.navigation.navigate('ExerciseScreen');
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

  render() {
    const { isSelected } = this.state;

    return (
      <TouchableOpacity
        onPress={() => (this.handlePress())}
        onLongPress={() => (this.handleLongPress())}
      >
        <Card
          title={this.name}
          titleStyle={styles.exerciseNameStyle}
          containerStyle={isSelected ? styles.cardSelected : null}
        >
          {
            Object.keys(this.sets).map((weight) => (
              <Text style={styles.setsAndReps}>
                {weight}: {this.sets[weight]}
              </Text>
            ))
          }
        </Card>
      </TouchableOpacity>
    );
  }
}

ExerciseCard.propTypes = {
  name: PropTypes.string.isRequired,
  sets: PropTypes.object.isRequired, // eslint-disable-line 
  drag: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default ExerciseCard;
