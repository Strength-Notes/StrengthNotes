import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getFormattedDateString } from '../../redux/organizers';

const TrainingCalendar = ({ navigation, route }) => {
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
};

export default TrainingCalendar;
