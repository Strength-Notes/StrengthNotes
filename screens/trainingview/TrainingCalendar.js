import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendario';
import { getFormattedDateString } from '../../redux/organizers';

const TrainingCalendar = ({ navigation }) => (
  <View>
    <Calendar
      startDate={new Date()}
      onChange={(range) => {
        navigation.navigate(
          'TrainingDayScreen',
          { date: getFormattedDateString(range.startDate) },
        );
      }}
      disableRange
    />
  </View>
);

TrainingCalendar.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default TrainingCalendar;
