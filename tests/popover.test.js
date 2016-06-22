import test from 'ava';
import React from 'react';
import Popover from '../components/popover'
import { mount } from 'enzyme';

test('should show overlay when trigger is clicked', (t) => {
  const popover = mount(
    <Popover content="console.log('hello world')" title="code" trigger="click">
      <a href="#">show me your code</a>
    </Popover>
  );

  t.is(popover.instance().getPopupDomNode(), undefined);

  popover.find('a').simulate('click');

  const popup = popover.instance().getPopupDomNode();
  t.truthy(popup);
  t.true(popup.className.indexOf('ant-popover-placement-top') > 0);
  t.regex(popup.innerHTML, /<div class="ant-popover-title".*?>code<\/div>/);
  t.regex(popup.innerHTML, /<div class="ant-popover-inner-content".*?>console\.log\('hello world'\)<\/div>/);
});
