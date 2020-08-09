import CommentModal from '../../../../screens/trainingview/ExerciseScreen/CommentModal';

describe('<CommentModal />', () => {
  it('returns the proper component', () => {
    const component = CommentModal('Comment', jest.fn(), true, jest.fn());
    expect(component).toMatchSnapshot();
  });
});
