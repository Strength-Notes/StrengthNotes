import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {
  getSetsAtDate,
  getSetsOfExercise,
  getDateObjectFromString,
  getFormattedDateString,
  getExerciseObjectFromName,
} from '../../../redux/organizers';
import { updateSetCommentAction } from '../../../redux/actions';
import ExerciseProperties from '../../../redux/ExerciseProperties';
import CommentModal from './CommentModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontWeight: 'bold',
    margin: 4,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  selectedSectionHeader: {
    fontStyle: 'italic',
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 3,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  alignedColumnsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  setCommentButton: {
    marginTop: 2,
    marginLeft: 2,
  },
  weightNum: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 16,
  },
  weightUnit: {
    fontSize: 13,
  },
  repsNum: {
    fontSize: 16,
  },
  repsLabel: {
    fontSize: 13,
  },
  rpe: {
    marginLeft: 48,
    fontSize: 16,
  },
  noHistory: {
    margin: 5,
    fontSize: 16,
  },
});

class HistoryTab extends React.Component {
  constructor(props) {
    super(props);

    this.updateSetCommentDispatch = props.updateSetCommentDispatch;

    const { sets, exercises, route } = props;
    let { exercise, exerciseString } = route.params;

    if (exerciseString === undefined) {
      // exerciseString is not defined: use object
      exerciseString = exercise.name;
    } else {
      // exerciseString is defined, so let's find the object ourselves
      exercise = getExerciseObjectFromName(exercises, exerciseString);
    }

    this.state = {
      date: props.route.params.date,
      exercise,
      exerciseString,
      sets,
    };
  }

  // eslint-disable-next-line react/sort-comp
  prettifyDateString = (dateString) => {
    const date = getDateObjectFromString(dateString);

    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (dateString) {
      case getFormattedDateString(today): {
        return 'Today';
      }
      case getFormattedDateString(yesterday): {
        return 'Yesterday';
      }
      case getFormattedDateString(tomorrow): {
        return 'Tomorrow';
      }
      default: {
        break;
      }
    }

    const d = date.toString().split(' ');

    // Use date.getUTCDate() to avoid weird bugs around midnight
    const prettyDate = `${d[0]} ${d[1]} ${date.getUTCDate()} ${d[3]}`;
    return prettyDate;
  }

  // For whatever bizarre reason, an error occurs when making this an arrow func
  // eslint-disable-next-line class-methods-use-this
  getExercisePropertyView({ setObj, property }) {
    switch (property) {
      case ExerciseProperties.WEIGHT: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.weightNum}>{setObj.weight} </Text>
            <Text style={styles.weightUnit}>{setObj.weightUnit}</Text>
          </View>
        );
      }
      case ExerciseProperties.REPS: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.repsNum}>{setObj.reps} </Text>
            <Text style={styles.repsLabel}>reps</Text>
          </View>
        );
      }
      case ExerciseProperties.DISTANCE: {
        return (
          <View style={styles.alignedColumnsContainer}>
            <Text style={styles.repsNum}>{setObj.distance} </Text>
            <Text style={styles.repsLabel}>{setObj.distanceUnit}</Text>
          </View>
        );
      }
      case ExerciseProperties.TIME: {
        const formattedTime = new Date(setObj.time * 1000 || 0) // 0 if NaN
          .toISOString()
          .substr(11, 8);
        return (
          <View style={[styles.alignedColumnsContainer, { marginLeft: 20 }]}>
            <Text style={styles.repsNum}>{formattedTime}</Text>
          </View>
        );
      }
      default: {
        return (<View style={styles.alignedColumnsContainer} />);
      }
    }
  }

  openCommentModal = (setObj) => () => {
    this.setState({
      commentModalVisible: true,
      commentModalSet: setObj,
    });
  }

  closeCommentModal = () => {
    this.setState({
      commentModalVisible: false,
    });
  }

  getSetRow = ({ setObj }) => {
    // eslint-disable-next-line react/destructuring-assignment
    const { primary, secondary } = this.state.exercise;
    const { comment } = setObj;

    return (
      <View style={styles.setRow}>
        <TouchableOpacity
          style={styles.setCommentButton}
          onPress={this.openCommentModal(setObj)}
        >
          <Icon
            name={comment ? 'chat' : 'chat-bubble-outline'}
            size={20}
          />
        </TouchableOpacity>

        <this.getExercisePropertyView
          setObj={setObj}
          property={primary}
        />

        <this.getExercisePropertyView
          setObj={setObj}
          property={secondary}
        />

        <Text style={[styles.rpe, styles.alignedColumnsContainer]}>
          { // Only render RPE if the field exists
            setObj.rpe ? (
              `RPE ${setObj.rpe}`
            ) : []
          }
        </Text>
      </View>
    );
  };

  getSections = (sets, exerciseString) => {
    const sections = [];

    const datesArray = Object.keys(sets[0]).reverse();

    datesArray.forEach((dateString) => {
      const setsAtDate = getSetsAtDate(sets, dateString);
      const setsOfExerciseAtDate = getSetsOfExercise(setsAtDate, exerciseString);

      if (setsOfExerciseAtDate.length > 0) {
        sections.push({ key: dateString, data: setsOfExerciseAtDate });
      }
    });

    return sections;
  };

  render() {
    const {
      date,
      sets,
      exerciseString,
      commentModalVisible,
      commentModalSet,
    } = this.state;

    const sectionsData = this.getSections(sets, exerciseString);

    if (sectionsData.length > 0) {
      return (
        <View style={styles.container}>
          <CommentModal
            comment={commentModalSet ? commentModalSet.comment : ''}
            onChangeComment={(newComment) => {
              this.updateSetCommentDispatch(commentModalSet, newComment);
            }}
            modalVisible={commentModalVisible || false}
            closeModal={this.closeCommentModal}
          />

          <SectionList
            sections={this.getSections(sets, exerciseString)}
            renderSectionHeader={({ section }) => (
              <Text
                style={[
                  styles.sectionHeader,
                  date === section.key ? styles.selectedSectionHeader : null,
                ]}
              >
                {this.prettifyDateString(section.key)}
              </Text>
            )}
            renderItem={({ item }) => (
              <this.getSetRow setObj={item} />
            )}
            keyExtractor={(item, index) => (`${item}-${index}`)}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.noHistory}>No history of this exercise.</Text>
      </View>
    );
  }
}

HistoryTab.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.string,
      exerciseString: PropTypes.string,
      exercise: PropTypes.shape({
        name: PropTypes.string.isRequired,
        primary: PropTypes.string.isRequired,
        secondary: PropTypes.string,
      }),
    }),
  }).isRequired,
  updateSetCommentDispatch: PropTypes.func.isRequired,
  sets: PropTypes.arrayOf(PropTypes.object).isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = ({ sets, exercises }) => ({
  sets,
  exercises,
});

const mapDispatchToProps = (dispatch) => ({
  updateSetCommentDispatch: (set, newComment) => {
    dispatch(updateSetCommentAction(set, newComment));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryTab);
