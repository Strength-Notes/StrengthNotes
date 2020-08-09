import React from 'react';
import renderer from 'react-test-renderer';
import TrainingCalendar from '../../../screens/trainingview/TrainingCalendar';

describe('<TrainingCalendar />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <TrainingCalendar
        navigation={{ navigate: jest.fn() }}
        route={{ params: { selectedDate: '2020-08-08' } }}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without "params" property of "route" prop', () => {
    const tree = renderer.create(
      <TrainingCalendar
        navigation={{ navigate: jest.fn() }}
        route={{}}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
