import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.85,
    margin: 20,
    backgroundColor: 'lightgray',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontWeight: 'bold',
  },
});

const CommentModal = ({
  comment,
  onChangeComment,
  modalVisible,
  closeModal,
}) => (
  <Modal
    animationType="fade"
    transparent
    isVisible={modalVisible}
    onBackdropPress={closeModal}
    onBackButtonPress={closeModal}
  >
    <View style={styles.centeredContainer}>
      <View style={styles.modalContainer}>
        <Text style={styles.header}>Comment</Text>

        <View
          style={{
            backgroundColor: 'black',
            height: 0.5,
            width: styles.modalContainer.width * 0.75,
          }}
        />

        <TextInput
          style={styles.textInput}
          onChangeText={onChangeComment}
          value={comment}
          placeholder="Enter set details here"
          placeholderTextColor="gray"
          multiline
        />
      </View>
    </View>
  </Modal>
);

CommentModal.propTypes = {
  comment: PropTypes.string,
  onChangeComment: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

CommentModal.defaultProps = {
  comment: '',
};

export default CommentModal;
