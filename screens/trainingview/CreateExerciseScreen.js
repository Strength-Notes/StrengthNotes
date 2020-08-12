import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Picker,
} from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExerciseAction } from '../../redux/actions';
import ExerciseProperties from '../../redux/ExerciseProperties';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButtonInvalid: {
    backgroundColor: 'lightgray',
  },
  createButtonText: {
    textAlign: 'center',
  },
  createButtonTextInvalid: {
    color: 'gray',
  },
});

class CreateExerciseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.addExerciseDispatch = props.addExerciseDispatch;

    // Set defaults: needed to prevent bug when using default value
    this.state = {
      primarySelected: ExerciseProperties.WEIGHT,
      secondarySelected: ExerciseProperties.REPS,
    };
  }

  verifyInput = () => {
    const { nameInput } = this.state;

    return !!nameInput;
  };

  handleCreatePress = () => {
    const {
      nameInput,
      categoryInput,
      primarySelected,
      secondarySelected,
    } = this.state;

    this.addExerciseDispatch({
      name: nameInput,
      category: categoryInput,
      primary: primarySelected,
      secondary: secondarySelected,
    });

    this.navigation.goBack();
  };

  render() {
    const {
      nameInput,
      categoryInput,
      primarySelected,
      secondarySelected,
    } = this.state;

    const formValid = this.verifyInput();

    return (
      <View style={styles.container}>
        <Card title="Name">
          <TextInput
            onChangeText={(text) => {
              this.setState({ nameInput: text });
            }}
            value={nameInput}
            placeholder="Name"
          />
        </Card>
        <Card title="Category">
          <TextInput
            onChangeText={(text) => {
              this.setState({ categoryInput: text });
            }}
            value={categoryInput}
            placeholder="Category"
          />
        </Card>
        <Card title="Primary">
          <Picker
            selectedValue={primarySelected}
            onValueChange={(selected) => {
              this.setState({ primarySelected: selected });
            }}
            mode="dropdown"
          >
            {
              Object.values(ExerciseProperties).map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))
            }
          </Picker>
        </Card>
        <Card title="Secondary">
          <Picker
            selectedValue={secondarySelected}
            onValueChange={(selected) => {
              this.setState({ secondarySelected: selected });
            }}
            mode="dropdown"
          >
            {
              Object.values(ExerciseProperties).map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))
            }
          </Picker>
        </Card>
        <TouchableOpacity
          onPress={this.handleCreatePress}
          disabled={!formValid}
        >
          <Card
            containerStyle={!formValid ? styles.createButtonInvalid : null}
          >
            <Text
              style={[
                styles.createButtonText,
                !formValid ? styles.createButtonTextInvalid : null,
              ]}
            >
              Create
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
    );
  }
}

CreateExerciseScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  addExerciseDispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  addExerciseDispatch: (exercise) => {
    dispatch(addExerciseAction(exercise));
  },
});

export default connect(null, mapDispatchToProps)(CreateExerciseScreen);
