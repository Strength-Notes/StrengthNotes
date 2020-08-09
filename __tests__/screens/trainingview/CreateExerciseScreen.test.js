import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CreateExerciseScreen from '../../../screens/trainingview/CreateExerciseScreen';

const mockStore = configureMockStore();
const store = mockStore({});

describe('<CreateExerciseScreen />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <CreateExerciseScreen
          navigation={{ navigate: jest.fn() }}
        />
      </Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
