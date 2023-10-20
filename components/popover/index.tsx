import * as React from 'react';
import classNames from 'classnames';

import type { RenderFunction } from '../_util/getRenderPropValue';
import { getRenderPropValue } from '../_util/getRenderPropValue';
import { useZIndex } from '../_util/hooks/useZIndex';
import { getTransitionName } from '../_util/motion';
import zIndexContext from '../_util/zindexContext';
import { ConfigContext } from '../config-provider';
import type { AbstractTooltipProps, TooltipRef } from '../tooltip';
import Tooltip from '../tooltip';
import PurePanel from './PurePanel';
// CSSINJS
import useStyle from './style';

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  content?: React.ReactNode | RenderFunction;
}

interface OverlayProps {
  prefixCls?: string;
  title?: PopoverProps['title'];
  content?: PopoverProps['content'];
}

const Overlay: React.FC<OverlayProps> = ({ title, content, prefixCls }) => (
  <>
    {title && <div className={`${prefixCls}-title`}>{getRenderPropValue(title)}</div>}
    <div className={`${prefixCls}-inner-content`}>{getRenderPropValue(content)}</div>
  </>
);

const Popover = React.forwardRef<TooltipRef, PopoverProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    content,
    overlayClassName,
    placement = 'top',
    trigger = 'hover',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayStyle = {},
    ...otherProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('popover', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const rootPrefixCls = getPrefixCls();

  const overlayCls = classNames(overlayClassName, hashId);

  // ============================ zIndex ============================
  const [zIndex, contextZIndex] = useZIndex('Popover', otherProps.zIndex);
  const injectFromPopover = (props as any)['data-popover-inject'];

  const contentNode = (
    <Tooltip
      placement={placement}
      trigger={trigger}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      overlayStyle={overlayStyle}
      {...otherProps}
      zIndex={injectFromPopover ? otherProps.zIndex : zIndex}
      prefixCls={prefixCls}
      overlayClassName={overlayCls}
      ref={ref}
      overlay={
        title || content ? <Overlay prefixCls={prefixCls} title={title} content={content} /> : null
      }
      transitionName={getTransitionName(rootPrefixCls, 'zoom-big', otherProps.transitionName)}
      data-popover-inject
    />
  );

  if (injectFromPopover) {
    return contentNode;
  }

  return wrapSSR(
    <zIndexContext.Provider value={contextZIndex}>{contentNode}</zIndexContext.Provider>,
  );
}) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<PopoverProps> & React.RefAttributes<unknown>
> & {
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};

if (process.env.NODE_ENV !== 'production') {
  Popover.displayName = 'Popover';
}

Popover._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export default Popover;
