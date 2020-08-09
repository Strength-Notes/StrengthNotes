import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AddExerciseScreen from '../../../screens/trainingview/AddExerciseScreen';
import ExerciseProperties from '../../../redux/ExerciseProperties';

const exercises = [
  {
    name: 'Squat',
    primary: ExerciseProperties.WEIGHT,
    secondary: ExerciseProperties.REPS,
  },
];

const mockStore = configureMockStore();
const store = mockStore({
  exercises,
});

describe('<AddExerciseScreen />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <AddExerciseScreen
          route={{ params: { date: '2020-08-08' } }}
          navigation={{ navigate: jest.fn(), setOptions: jest.fn() }}
        />
      </Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
