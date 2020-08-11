import { createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';
import PropTypes from 'prop-types';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whiteList: ['sets', 'exercises'],
};

const store = createStore(
  persistReducer(persistConfig, rootReducer),
);

const persistor = persistStore(store);
export const shapeOfSetObject = PropTypes.shape({
  key: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  exercise: PropTypes.string.isRequired,
  category: PropTypes.string,
  weight: PropTypes.number,
  weightUnit: PropTypes.string,
  reps: PropTypes.number,
  distance: PropTypes.number,
  distanceUnit: PropTypes.string,
  time: PropTypes.number,
  rpe: PropTypes.number,
  comment: PropTypes.string,
});

export { persistor };
export default store;
