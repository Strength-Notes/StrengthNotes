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

    let exerciseObj;
    if (props.route.params) {
      exerciseObj = props.route.params.exerciseObj;
    }

    const stateFields = {};
    if (exerciseObj) {
      stateFields.nameInput = exerciseObj.name;
      stateFields.categoryInput = exerciseObj.category;
      stateFields.primarySelected = exerciseObj.primary;
      stateFields.secondarySelected = exerciseObj.secondary;
    }

    // Set defaults: needed to prevent bug when using default value
    this.state = {
      primarySelected: ExerciseProperties.WEIGHT,
      secondarySelected: ExerciseProperties.REPS,
      ...stateFields, // Only applicable for when a exerciseObj is handed as param
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
        <Card>
          <Card.Title>Name</Card.Title>
          <Card.Divider />
          <TextInput
            onChangeText={(text) => {
              this.setState({ nameInput: text });
            }}
            value={nameInput}
            placeholder="Name"
            autoCapitalize="words"
          />
        </Card>
        <Card>
          <Card.Title>Category</Card.Title>
          <Card.Divider />
          <TextInput
            onChangeText={(text) => {
              this.setState({ categoryInput: text });
            }}
            value={categoryInput}
            placeholder="Category"
            autoCapitalize="words"
          />
        </Card>
        <Card>
          <Card.Title>Primary</Card.Title>
          <Card.Divider />
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
        <Card>
          <Card.Title>Secondary</Card.Title>
          <Card.Divider />
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
  route: PropTypes.shape({
    params: PropTypes.shape({
      exerciseObj: PropTypes.shape({
        name: PropTypes.string,
        primary: PropTypes.string,
        secondary: PropTypes.string,
      }),
    }),
  }),
  addExerciseDispatch: PropTypes.func.isRequired,
};

CreateExerciseScreen.defaultProps = {
  route: {},
};

const mapDispatchToProps = (dispatch) => ({
  addExerciseDispatch: (exercise) => {
    dispatch(addExerciseAction(exercise));
  },
});

export default connect(null, mapDispatchToProps)(CreateExerciseScreen);
