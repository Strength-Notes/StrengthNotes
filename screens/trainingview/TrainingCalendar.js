import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendario';

const TrainingCalendar = ({ navigation }) => (
  <View>
    <Calendar
      onChange={(range) => navigation.navigate(
        'TrainingDay',
        { startDate: range.startDate },
      )}
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
