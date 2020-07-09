import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class AddExerciseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.route.params.date,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

AddExerciseScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
};

export default AddExerciseScreen;
