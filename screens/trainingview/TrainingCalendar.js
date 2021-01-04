import React from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import XDate from 'xdate'; // Used to interface with Calendar, and only used because it's a dep of Calendar
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Calendar } from 'react-native-calendars';
import { getFormattedDateString } from '../../redux/organizers';

class TrainingCalendar extends React.Component {
  constructor(props) {
    super(props);

    const { navigation, route, sets } = props;

    this.navigation = navigation;

    let selectedDateString;

    // Only access route.params.selectedDate if params exists
    if (route.params) {
      selectedDateString = route.params.selectedDate;
    }

    if (!selectedDateString) {
      // Default value is today
      selectedDateString = getFormattedDateString(new Date());
    }

    const markedDates = {};
    markedDates[selectedDateString] = { selected: true };

    Object.keys(sets[0]).forEach((setDate) => {
      // Make sure the set object is not empty, first!
      if (sets[0][setDate].length <= 0) {
        return;
      }

      // If it doesn't exist already
      if (markedDates[setDate] === undefined) {
        markedDates[setDate] = { marked: true };
      } else if (setDate === selectedDateString) { // Or if it's our selected
        markedDates[setDate].marked = true;
      }
    });

    this.state = { selectedDateString, markedDates };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    const { route, sets } = newProps;

    let selectedDateString;

    // Only access route.params.selectedDate if params exists
    if (route.params) {
      selectedDateString = route.params.selectedDate;
    }

    if (!selectedDateString) {
      // Default value is today
      selectedDateString = getFormattedDateString(new Date());
    }

    const markedDates = {};
    markedDates[selectedDateString] = { selected: true };

    Object.keys(sets[0]).forEach((setDate) => {
      // Make sure the set object is not empty, first!
      if (sets[0][setDate].length <= 0) {
        return;
      }

      // If it doesn't exist already
      if (markedDates[setDate] === undefined) {
        markedDates[setDate] = { marked: true };
      } else if (setDate === selectedDateString) { // Or if it's our selected
        markedDates[setDate].marked = true;
      }
    });

    if (this.calendarRef) {
      this.calendarRef.updateMonth(new XDate(selectedDateString), true);
    }

    this.setState({ selectedDateString, markedDates });
  }

  render() {
    const { selectedDateString, markedDates } = this.state;

    return (
      <View>
        <Calendar
          ref={(ref) => { this.calendarRef = ref; }}
          current={selectedDateString}
          markedDates={markedDates}
          onDayPress={(day) => {
            requestAnimationFrame(() => {
              this.navigation.navigate(
                'TrainingDayScreen',
                { date: day.dateString },
              );
            });
          }}
          enableSwipeMonths
        />
      </View>
    );
  }
}

TrainingCalendar.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      selectedDate: PropTypes.string,
    }),
  }).isRequired,
  sets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  sets: state.sets,
});

export default connect(mapStateToProps)(TrainingCalendar);
