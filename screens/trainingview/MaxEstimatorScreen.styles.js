import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weightInputContainer: {
    alignSelf: 'center',
  },
  weightLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 8,
  },
  weightInput: {
    textAlign: 'center',
    fontSize: 24,
  },
  repsInputContainer: {
    alignSelf: 'center',
    margin: 8,
  },
  repsLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 8,
  },
  repsInput: {
    textAlign: 'center',
    fontSize: 24,
  },
  scrollContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 16,
    marginTop: 6,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    elevation: 3, // This is an Android-only style
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 8,
  },
  rowRepsLabel: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  rowWeightLabel: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default styles;
