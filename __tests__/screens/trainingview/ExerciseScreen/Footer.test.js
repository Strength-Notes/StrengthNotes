import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Footer from '../../../../screens/trainingview/ExerciseScreen/Footer';
import ExerciseProperties from '../../../../redux/ExerciseProperties';

const mockStore = configureMockStore();
const store = mockStore({});

function renderForProperties(primary, secondary) {
  const tree = renderer.create(
    <Provider store={store}>
      <Footer
        date={new Date('2020-08-08')}
        exercise={{
          name: 'Squat',
          primary,
          secondary,
        }}
      />
    </Provider>,
  ).toJSON();
  return tree;
}

describe('<Footer />', () => {
  it('returns the proper component for each ExerciseProperty', () => {
    expect(renderForProperties(
      ExerciseProperties.WEIGHT,
      ExerciseProperties.REPS,
    )).toMatchSnapshot();
    expect(renderForProperties(
      ExerciseProperties.DISTANCE,
      ExerciseProperties.TIME,
    )).toMatchSnapshot();
  });

  it('returns the proper component for undefined properties', () => {
    expect(renderForProperties()).toMatchSnapshot();
  });
});
