import * as React from 'react';
import StarFilled from '@ant-design/icons/StarFilled';
import classNames from 'classnames';
import RcRate from 'rc-rate';
import type { RateRef, RateProps as RcRateProps } from 'rc-rate/lib/Rate';
import type { StarProps as RcStarProps } from 'rc-rate/lib/Star';

import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import Tooltip, { TooltipProps } from '../tooltip';
import useStyle from './style';

export interface RateProps extends RcRateProps {
  rootClassName?: string;
  tooltips?: Array<string>;
  tooltipProps?: TooltipProps;
}

const Rate = React.forwardRef<RateRef, RateProps>((props, ref) => {
  const {
    prefixCls,
    className,
    rootClassName,
    style,
    tooltips,
    tooltipProps,
    character = <StarFilled />,
    disabled: customDisabled,
    ...rest
  } = props;

  const characterRender: RcStarProps['characterRender'] = (node, { index }) => {
    if (!tooltips) {
      return node;
    }
    return (
      <Tooltip title={tooltips[index as number]} {...tooltipProps}>
        {node}
      </Tooltip>
    );
  };

  const { getPrefixCls, direction, rate } = React.useContext(ConfigContext);
  const ratePrefixCls = getPrefixCls('rate', prefixCls);

  // Style
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(ratePrefixCls);

  const mergedStyle: React.CSSProperties = { ...rate?.style, ...style };

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  return wrapCSSVar(
    <RcRate
      ref={ref}
      character={character}
      characterRender={characterRender}
      disabled={mergedDisabled}
      {...rest}
      className={classNames(className, rootClassName, hashId, cssVarCls, rate?.className)}
      style={mergedStyle}
      prefixCls={ratePrefixCls}
      direction={direction}
    />,
  );
});

if (process.env.NODE_ENV !== 'production') {
  Rate.displayName = 'Rate';
}

export default Rate;
