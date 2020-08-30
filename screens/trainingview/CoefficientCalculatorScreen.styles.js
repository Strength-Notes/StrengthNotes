import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyweightLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 8,
  },
  bodyweightInput: {
    textAlign: 'center',
    fontSize: 24,
  },
  totalInputContainer: {
    margin: 8,
  },
  totalLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 8,
  },
  totalInput: {
    textAlign: 'center',
    fontSize: 24,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 8,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  rowNumsContainer: {
    flex: 1,
  },
  rowPointsLabel: {
    fontSize: 24,
    textAlign: 'center',
  },
  rowCoefficientLabel: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
  },
});

export default styles;
