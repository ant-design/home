import { mount } from 'enzyme';
import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import Comment from '../index';

describe('Comment', () => {
  mountTest(Comment);
  rtlTest(Comment);

  it('should support empty actions', () => {
    const wrapper = mount(
      <Comment
        actions={[]}
        author={<a>Han Solo</a>}
        content={
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure), to help people create their product prototypes beautifully
            and efficiently.
          </p>
        }
        datetime="YYYY-MM-DD HH:mm:ss"
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });
});
