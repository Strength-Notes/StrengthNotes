import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Menu, { MenuItem } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';
import EntryTab from './EntryTab';
import HistoryTab from './HistoryTab';

const styles = StyleSheet.create({
  lazyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  overflowMenuIcon: {
    marginRight: 12,
  },
});

const Tab = createMaterialTopTabNavigator();
let menuRef = null;

const lazyPlaceholder = () => (
  <View style={styles.lazyContainer}>
    <ActivityIndicator
      size="large"
    />
  </View>
);

class ExerciseScreen extends React.Component {
  constructor(props) {
    super(props);

    const { navigation, route } = props;

    this.navigation = navigation;

    this.state = { route };
  }

  componentDidMount() {
    this.navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerBarRightContainer}>
          <Menu
            ref={(ref) => { menuRef = ref; }}
            button={(
              <TouchableOpacity
                style={styles.overflowMenuIcon}
                onPress={() => {
                  menuRef.show();
                }}
              >
                <Icon name="dots-three-vertical" size={32} />
              </TouchableOpacity>
            )}
          >
            <MenuItem
              onPress={() => {
                this.navigation.navigate('MaxEstimatorScreen');
                menuRef.hide();
              }}
            >
              1RM Estimator
            </MenuItem>
            <MenuItem
              onPress={() => {
                this.navigation.navigate('CoefficientCalculatorScreen');
                menuRef.hide();
              }}
            >
              Coefficient Calculator
            </MenuItem>
          </Menu>
        </View>
      ),
    });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props) {
    const { navigation, route } = props;
    this.navigation = navigation;
    this.setState({ route });
  }

  render() {
    const { route } = this.state;

    return (
      <Tab.Navigator
        backBehavior="none"
        lazy
        lazyPlaceholder={lazyPlaceholder}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      >
        <Tab.Screen
          name="EntryTab"
          component={EntryTab}
          options={{
            title: 'Entry',
          }}
          initialParams={route.params}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryTab}
          options={{
            title: 'History',
          }}
          initialParams={route.params}
        />
      </Tab.Navigator>
    );
  }
}

ExerciseScreen.propTypes = {
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.string,
      exerciseString: PropTypes.string,
      exercise: PropTypes.shape({
        name: PropTypes.string,
        category: PropTypes.string,
        primary: PropTypes.string,
        secondary: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default ExerciseScreen;
