import * as React from 'react';
import { forwardRef } from 'react';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import classNames from 'classnames';
import type { MenuProps as RcMenuProps, MenuRef as RcMenuRef } from 'rc-menu';
import RcMenu from 'rc-menu';
import { useEvent } from 'rc-util';
import omit from 'rc-util/lib/omit';

import initCollapseMotion from '../_util/motion';
import { cloneElement, isValidElement } from '../_util/reactNode';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import type { SiderContextProps } from '../layout/Sider';
import type { ItemType } from './hooks/useItems';
import useItems from './hooks/useItems';
import type { MenuContextProps, MenuTheme } from './MenuContext';
import MenuContext from './MenuContext';
import OverrideContext from './OverrideContext';
import useStyle from './style';

export interface MenuProps extends Omit<RcMenuProps, 'items'> {
  theme?: MenuTheme;
  inlineIndent?: number;

  // >>>>> Private
  /**
   * @private Internal Usage. Not promise crash if used in production. Connect with chenshuai2144
   *   for removing.
   */
  _internalDisableMenuItemTitleTooltip?: boolean;

  items?: ItemType[];
}

type InternalMenuProps = MenuProps &
  SiderContextProps & {
    collapsedWidth?: string | number;
  };

const InternalMenu = forwardRef<RcMenuRef, InternalMenuProps>((props, ref) => {
  const override = React.useContext(OverrideContext);
  const overrideObj = override || {};

  const { getPrefixCls, getPopupContainer, direction, menu } = React.useContext(ConfigContext);

  const rootPrefixCls = getPrefixCls();

  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    theme = 'light',
    expandIcon,
    _internalDisableMenuItemTitleTooltip,
    inlineCollapsed,
    siderCollapsed,
    items,
    children,
    rootClassName,
    mode,
    selectable,
    onClick,
    overflowedIndicatorPopupClassName,
    ...restProps
  } = props;

  const passedProps = omit(restProps, ['collapsedWidth']);

  // ========================= Items ===========================
  const mergedChildren = useItems(items) || children;

  // ======================== Warning ==========================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Menu');

    warning(
      !('inlineCollapsed' in props && mode !== 'inline'),
      'usage',
      '`inlineCollapsed` should only be used when `mode` is inline.',
    );

    warning(
      !(props.siderCollapsed !== undefined && 'inlineCollapsed' in props),
      'usage',
      '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.',
    );

    warning.deprecated('items' in props && !children, 'children', 'items');
  }

  overrideObj.validator?.({ mode });

  // ========================== Click ==========================
  // Tell dropdown that item clicked
  const onItemClick = useEvent<Required<MenuProps>['onClick']>((...args) => {
    onClick?.(...args);
    overrideObj.onClick?.();
  });

  // ========================== Mode ===========================
  const mergedMode = overrideObj.mode || mode;

  // ======================= Selectable ========================
  const mergedSelectable = selectable ?? overrideObj.selectable;

  // ======================== Collapsed ========================
  // Inline Collapsed
  const mergedInlineCollapsed = React.useMemo(() => {
    if (siderCollapsed !== undefined) {
      return siderCollapsed;
    }
    return inlineCollapsed;
  }, [inlineCollapsed, siderCollapsed]);

  const defaultMotions = {
    horizontal: { motionName: `${rootPrefixCls}-slide-up` },
    inline: initCollapseMotion(rootPrefixCls),
    other: { motionName: `${rootPrefixCls}-zoom-big` },
  };

  const prefixCls = getPrefixCls('menu', customizePrefixCls || overrideObj.prefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls, !override);
  const menuClassName = classNames(`${prefixCls}-${theme}`, menu?.className, className);

  // ====================== Expand Icon ========================
  let mergedExpandIcon: MenuProps['expandIcon'];
  if (typeof expandIcon === 'function') {
    mergedExpandIcon = expandIcon;
  } else if (expandIcon === null || expandIcon === false) {
    mergedExpandIcon = null;
  } else if (overrideObj.expandIcon === null || overrideObj.expandIcon === false) {
    mergedExpandIcon = null;
  } else {
    const beClone: React.ReactNode = (expandIcon ?? overrideObj.expandIcon) as React.ReactNode;
    mergedExpandIcon = cloneElement(beClone, {
      className: classNames(
        `${prefixCls}-submenu-expand-icon`,
        isValidElement(beClone) ? beClone.props?.className : '',
      ),
    });
  }

  // ======================== Context ==========================
  const contextValue = React.useMemo<MenuContextProps>(
    () => ({
      prefixCls,
      inlineCollapsed: mergedInlineCollapsed || false,
      direction,
      firstLevel: true,
      theme,
      mode: mergedMode,
      disableMenuItemTitleTooltip: _internalDisableMenuItemTitleTooltip,
    }),
    [prefixCls, mergedInlineCollapsed, direction, _internalDisableMenuItemTitleTooltip, theme],
  );

  // ========================= Render ==========================
  return wrapSSR(
    <OverrideContext.Provider value={null}>
      <MenuContext.Provider value={contextValue}>
        <RcMenu
          getPopupContainer={getPopupContainer}
          overflowedIndicator={<EllipsisOutlined />}
          overflowedIndicatorPopupClassName={classNames(
            prefixCls,
            `${prefixCls}-${theme}`,
            overflowedIndicatorPopupClassName,
          )}
          mode={mergedMode}
          selectable={mergedSelectable}
          onClick={onItemClick}
          {...passedProps}
          inlineCollapsed={mergedInlineCollapsed}
          style={{ ...menu?.style, ...style }}
          className={menuClassName}
          prefixCls={prefixCls}
          direction={direction}
          defaultMotions={defaultMotions}
          expandIcon={mergedExpandIcon}
          ref={ref}
          rootClassName={classNames(rootClassName, hashId, overrideObj.rootClassName)}
        >
          {mergedChildren}
        </RcMenu>
      </MenuContext.Provider>
    </OverrideContext.Provider>,
  );
});

export default InternalMenu;
