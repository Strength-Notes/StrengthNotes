import { StyleSheet } from 'react-native';

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
    marginLeft: 16,
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

export default styles;
