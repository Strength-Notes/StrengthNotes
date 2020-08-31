import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Feather';
// eslint-disable-next-line import/no-named-default
import { default as MaterialIcon } from 'react-native-vector-icons/MaterialIcons';
import ExerciseProperties from '../../../redux/ExerciseProperties';
import {
  getSetsAtDate,
  getSetsOfExercise,
  getExerciseObjectFromName,
} from '../../../redux/organizers';
import {
  updateSetCommentAction,
  removeSetAction,
  moveSetAction,
} from '../../../redux/actions';
import CommentModal from './CommentModal';
import Footer from './Footer';
import styles from './EntryTab.styles';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class EntryTab extends React.Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
    this.updateSetCommentDispatch = props.updateSetCommentDispatch;
    this.removeSetDispatch = props.removeSetDispatch;
    this.moveSetDispatch = props.moveSetDispatch;

    this.state = this.setupProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    this.setState(this.setupProps(nextProps));
  }

  setupProps = ({ route, sets, exercises }) => {
    const { date } = route.params;
    let { exercise, exerciseString } = route.params;

    if (exerciseString === undefined) {
      // exerciseString is not defined: use object
      exerciseString = exercise.name;
    } else {
      // exerciseString is defined, so let's find the object ourselves
      exercise = getExerciseObjectFromName(exercises, exerciseString);
    }

    const allSetsAtDate = getSetsAtDate(sets, date);
    const setsOfExercise = getSetsOfExercise(allSetsAtDate, exerciseString);

    // Set a default for distanceUnitSelected
    // If this isn't done, a bug will occur when adding sets with default selected
    let distanceUnitSelected = 'm';
    if (this.state) {
      distanceUnitSelected = this.state.distanceUnitSelected; // eslint-disable-line
    }

    // Return state object
    return {
      sets,
      date,
      exercise,
      setsOfExercise,
      distanceUnitSelected,
    };
  }

  getRightActions = (setObj) => (dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-10, 0],
      outputRange: [50, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton
        style={styles.trashActionButton}
        onPress={() => this.removeSetDispatch(setObj)}
      >
        <AnimatedIcon
          style={[
            styles.trashIcon,
            {
              transform: [{ translateX: trans }],
            },
          ]}
          name="trash-2"
          size={32}
        />
      </RectButton>
    );
  };

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
      <Swipeable
        renderRightActions={this.getRightActions(setObj)}
      >
        <View style={styles.setRow}>
          <TouchableOpacity
            style={styles.setCommentButton}
            onPress={this.openCommentModal(setObj)}
          >
            <MaterialIcon
              name={comment ? 'chat' : 'chat-bubble-outline'}
              size={32}
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
      </Swipeable>
    );
  };

  render() {
    const {
      date,
      exercise,
      setsOfExercise,
      commentModalVisible,
      commentModalSet,
      selectedSet,
    } = this.state;
    let selectedSetKey = '';

    if (selectedSet) {
      selectedSetKey = selectedSet.key;
    }

    return (
      <SafeAreaView style={styles.container}>
        <CommentModal
          comment={commentModalSet ? commentModalSet.comment : ''}
          onChangeComment={(newComment) => {
            this.updateSetCommentDispatch(commentModalSet, newComment);
          }}
          modalVisible={commentModalVisible || false}
          closeModal={this.closeCommentModal}
        />

        <View style={styles.header}>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        </View>

        <DraggableFlatList
          style={styles.list}
          data={setsOfExercise}
          renderItem={
            ({ item, drag }) => (
              <TouchableOpacity
                style={[selectedSetKey === item.key ? styles.selectedSetRow : null]}
                onPress={() => {
                  const { onSelectSetObj, onUnselectSetObj } = this.state;

                  if (selectedSetKey === item.key) {
                    this.setState({
                      selectedSet: undefined,
                    });
                    onUnselectSetObj();
                  } else {
                    this.setState({
                      selectedSet: item,
                    });
                    onSelectSetObj(item);
                  }
                }}
                onLongPress={drag}
              >
                <this.getSetRow setObj={item} />
              </TouchableOpacity>
            )
          }
          keyExtractor={(item) => `draggable-item-${item.key}`}
          onDragEnd={({ from, to }) => {
            const set = setsOfExercise[from];
            const distanceMoved = to - from;
            this.moveSetDispatch(set, distanceMoved);
          }}
          activationDistance={15}
        />

        <Footer
          date={date}
          exercise={exercise}
          getOnSelectSetObj={(onSelectSetObj) => {
            this.setState({
              onSelectSetObj,
            });
          }}
          getOnUnselectSetObj={(onUnselectSetObj) => {
            this.setState({
              onUnselectSetObj,
            });
          }}
        />
      </SafeAreaView>
    );
  }
}

EntryTab.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      date: PropTypes.string.isRequired,
      exercise: PropTypes.shape({
        name: PropTypes.string.isRequired,
        primary: PropTypes.string.isRequired,
        secondary: PropTypes.string,
      }),
      exerciseString: PropTypes.string,
    }).isRequired,
  }).isRequired,
  updateSetCommentDispatch: PropTypes.func.isRequired,
  removeSetDispatch: PropTypes.func.isRequired,
  moveSetDispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  sets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  sets: state.sets,
  exercises: state.exercises,
});

const mapDispatchToProps = (dispatch) => ({
  updateSetCommentDispatch: (set, newComment) => {
    dispatch(updateSetCommentAction(set, newComment));
  },
  removeSetDispatch: (key) => {
    dispatch(removeSetAction(key));
  },
  moveSetDispatch: (set, distanceMoved) => {
    dispatch(moveSetAction(set, distanceMoved));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EntryTab);
