import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendario';
import { getFormattedDateString, getDateObjectFromString } from '../../redux/organizers';

const TrainingCalendar = ({ navigation, route }) => {
  let selectedDateObj;

  // Only access route.params.selectedDate is params exists
  if (route.params) {
    selectedDateObj = getDateObjectFromString(route.params.selectedDate);
  }

  if (!selectedDateObj) {
    // Default value is today
    selectedDateObj = new Date();
  }

  return (
    <View>
      <Calendar
        startDate={selectedDateObj}
        onChange={(range) => {
          requestAnimationFrame(() => {
            navigation.navigate(
              'TrainingDayScreen',
              { date: getFormattedDateString(range.startDate) },
            );
          });
        }}
        disableRange
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
