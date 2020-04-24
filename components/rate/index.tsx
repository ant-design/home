import * as React from 'react';
import RcRate from 'rc-rate';
import omit from 'omit.js';
import classNames from 'classnames';
import StarFilled from '@ant-design/icons/StarFilled';

import Tooltip from '../tooltip';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export interface RateProps {
  prefixCls?: string;
  count?: number;
  value?: number;
  defaultValue?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  tooltips?: Array<string>;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
  character?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface RateNodeProps {
  index: number;
}

const Rate = React.forwardRef<unknown, RateProps>((props, ref) => {
  const characterRender = (node: React.ReactElement, { index }: RateNodeProps) => {
    const { tooltips } = props;
    if (!tooltips) return node;
    return <Tooltip title={tooltips[index]}>{node}</Tooltip>;
  };

  const renderRate = ({ getPrefixCls, direction }: ConfigConsumerProps) => {
    const { prefixCls, className, ...restProps } = props;
    const rateProps = omit(restProps, ['tooltips']);
    const ratePrefixCls = getPrefixCls('rate', prefixCls);
    const rateClassNames = classNames(className, {
      [`${ratePrefixCls}-rtl`]: direction === 'rtl',
    });

    return (
      <RcRate
        ref={ref}
        characterRender={characterRender}
        {...rateProps}
        prefixCls={ratePrefixCls}
        className={rateClassNames}
      />
    );
  };

  return <ConfigConsumer>{renderRate}</ConfigConsumer>;
});

Rate.defaultProps = {
  character: <StarFilled />,
};

export default Rate;
