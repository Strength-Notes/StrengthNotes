import React from 'react';
import PropTypes from 'prop-types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DraggableFlatList from 'react-native-draggable-flatlist';
import ExerciseCard from './ExerciseCard';

const exercisesToday = [
  {
    key: 'squats-1',
    name: 'Squats',
    sets: {
      315: 5,
      405: 3,
      495: 1,
    },
  },
  {
    key: 'bench-1',
    name: 'Bench',
    sets: {
      225: 5,
      315: 2,
    },
  },
];

class Today extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;

    this.state = {
      data: exercisesToday,
    };
  }

  render() {
    return (
      <DraggableFlatList
        data={this.state.data} // eslint-disable-line
        renderItem={
          ({ item, drag }) => (
            <ExerciseCard
              name={item.name}
              sets={item.sets}
              drag={drag}
              navigation={this.navigation}
            />
          )
        }
        keyExtractor={(item) => `draggable-item-${item.key}`}
        onDragEnd={({ data }) => { this.setState({ data }); }}
      />
    );
  }
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

export default TrainingDay;
