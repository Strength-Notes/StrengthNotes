import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import TrainingView from '../../screens/TrainingView';

const mockStore = configureMockStore();
const store = mockStore({});

let realDate;

describe('<TrainingView />', () => {
  it('renders correctly', () => {
    // Setup mocked Date class
    realDate = Date;

    const currentDate = new Date('2020-08-08T10:02:52.146Z');
    global.Date = class extends Date {
      constructor(date) {
        if (date) {
          // eslint-disable-next-line constructor-super
          return super(date);
        }

        return currentDate;
      }
    };

    const renderer = new ShallowRenderer();
    renderer.render(
      <Provider store={store}>
        <NavigationContainer>
          <TrainingView />
        </NavigationContainer>
      </Provider>,
    );
    const result = renderer.getRenderOutput();

    expect(result).toMatchSnapshot();
    // And test the function
    expect(TrainingView({ navigation: {} })).toMatchSnapshot();

    // Undo mocked Date class
    global.date = realDate;
  });
});
