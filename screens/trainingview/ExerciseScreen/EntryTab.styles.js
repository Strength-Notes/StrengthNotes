import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'lightgray',
    marginBottom: 10,
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: 10,
  },
  list: {
    marginLeft: 8,
    marginRight: 8,
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 4,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  selectedSetRow: {
    backgroundColor: 'blue',
    borderRadius: 5,
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
    fontSize: 24,
  },
  weightUnit: {
    fontSize: 20,
  },
  repsNum: {
    fontSize: 24,
  },
  repsLabel: {
    fontSize: 20,
  },
  timeNum: {
    marginTop: 6,
    fontSize: 21,
  },
  rpe: {
    marginLeft: 48,
    fontSize: 24,
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#6f6b70',
    height: 40,
  },
  compoundContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  weightInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  repsInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  distanceInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  distanceUnitInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  rpeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 3,
  },
  clearButton: {
    margin: 3,
    marginLeft: 8,
  },
  clearButtonText: {
    flex: 1,
    width: 64,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  addButton: {
    margin: 3,
    marginLeft: 8,
  },
  addButtonText: {
    flex: 1,
    fontWeight: 'bold',
    width: 81,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  trashActionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  trashIcon: {
    marginTop: 4,
  },
});

export default styles;
