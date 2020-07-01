import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Card } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const exercisesToday = {
  Squats: {
    315: 5,
    405: 3,
    495: 1,
  },
  Bench: {
    225: 5,
    315: 2,
  },
};

class ExerciseCard extends React.Component {
  constructor(props) {
    super(props);

    this.name = props.name;
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
            Object.keys(exercisesToday[this.name]).map((weight) => (
              <Text style={styles.setsAndReps}>
                {weight}: {exercisesToday[this.name][weight]}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

function Today({ navigation }) {
  return (
    <SafeAreaView>
      <ScrollView>
        {
          Object.keys(exercisesToday).map((name) => (
            <ExerciseCard name={name} navigation={navigation} />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

Today.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const Tab = createMaterialTopTabNavigator();

const TrainingDay = ({ route }) => {
  const todayDate = route.params.startDate;
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);

  return (
    <Tab.Navigator
      initialRouteName={todayDate.toDateString()}
    >
      <Tab.Screen name={yesterdayDate.toDateString()} component={Today} />
      <Tab.Screen name={todayDate.toDateString()} component={Today} />
      <Tab.Screen name={tomorrowDate.toDateString()} component={Today} />
    </Tab.Navigator>
  );
};

TrainingDay.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      startDate: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
  }).isRequired,
};

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

export default TrainingDay;
