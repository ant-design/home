import * as React from 'react';
import classNames from 'classnames';
import { SubMenu as RcSubMenu, useFullPath } from 'rc-menu';
import omit from 'rc-util/lib/omit';

import { useZIndex } from '../_util/hooks/useZIndex';
import { cloneElement } from '../_util/reactNode';
import type { SubMenuType } from './interface';
import type { MenuContextProps } from './MenuContext';
import MenuContext from './MenuContext';
import { ConfigContext } from '../config-provider';

export interface SubMenuProps extends Omit<SubMenuType, 'ref' | 'key' | 'children' | 'label'> {
  title?: React.ReactNode;
  children?: React.ReactNode;
  /**
   * @deprecated No longer needed, it can now be safely deleted.
   * @see: https://github.com/ant-design/ant-design/pull/30638
   */
  level?: number;
}

const SubMenu: React.FC<SubMenuProps> = (props) => {
  const { popupClassName, icon, title, theme: customTheme } = props;
  const context = React.useContext(MenuContext);
  const { menu } = React.useContext(ConfigContext);
  const { prefixCls, inlineCollapsed, theme: contextTheme } = context;

  const parentPath = useFullPath();

  let titleNode: React.ReactNode;

  if (!icon) {
    titleNode =
      inlineCollapsed && !parentPath.length && title && typeof title === 'string' ? (
        <div className={`${prefixCls}-inline-collapsed-noicon`}>{title.charAt(0)}</div>
      ) : (
        <span className={`${prefixCls}-title-content`}>{title}</span>
      );
  } else {
    // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
    // ref: https://github.com/ant-design/ant-design/pull/23456
    const titleIsSpan = React.isValidElement(title) && title.type === 'span';
    titleNode = (
      <>
        {cloneElement(icon, {
          className: classNames(
            React.isValidElement(icon)
              ? (icon as React.ReactElement<{ className?: string }>).props?.className
              : '',
            `${prefixCls}-item-icon`,
          ),
        })}
        {titleIsSpan ? title : <span className={`${prefixCls}-title-content`}>{title}</span>}
      </>
    );
  }

  const contextValue = React.useMemo<MenuContextProps>(
    () => ({ ...context, firstLevel: false }),
    [context],
  );

  // ============================ zIndex ============================
  const [zIndex] = useZIndex('Menu');

  return (
    <MenuContext.Provider value={contextValue}>
      <RcSubMenu
        {...omit(props, ['icon'])}
        title={titleNode}
        popupClassName={classNames(
          prefixCls,
          popupClassName,
          `${prefixCls}-${customTheme || contextTheme}`,
        )}
        style={{ ...menu?.style, ...style }}
        popupStyle={{
          zIndex,
          // fix: https://github.com/ant-design/ant-design/issues/47826#issuecomment-2360737237
          ...props.popupStyle,
        }}
      />
    </MenuContext.Provider>
  );
};

export default SubMenu;
