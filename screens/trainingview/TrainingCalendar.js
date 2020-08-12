import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Calendar } from 'react-native-calendars';
import { getFormattedDateString } from '../../redux/organizers';

const TrainingCalendar = ({ navigation, route, sets }) => {
  let selectedDateString;

  // Only access route.params.selectedDate is params exists
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

  return (
    <View>
      <Calendar
        current={selectedDateString}
        markedDates={markedDates}
        onDayPress={(day) => {
          requestAnimationFrame(() => {
            navigation.navigate(
              'TrainingDayScreen',
              { date: day.dateString },
            );
          });
        }}
        enableSwipeMonths
      />
    </View>
  );
};

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
