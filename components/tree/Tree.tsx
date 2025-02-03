import type { Component } from 'react';
import React from 'react';
import HolderOutlined from '@ant-design/icons/HolderOutlined';
import classNames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import type { BasicDataNode, TreeProps as RcTreeProps } from 'rc-tree';
import RcTree from 'rc-tree';
import type { DataNode, Key } from 'rc-tree/lib/interface';
import DisabledContext from '../config-provider/DisabledContext';

import initCollapseMotion from '../_util/motion';
import { ConfigContext } from '../config-provider';
import { useToken } from '../theme/internal';
import useStyle from './style';
import dropIndicatorRender from './utils/dropIndicator';
import SwitcherIconCom from './utils/iconUtil';

export type SwitcherIcon = React.ReactNode | ((props: AntTreeNodeProps) => React.ReactNode);
export type TreeLeafIcon = React.ReactNode | ((props: AntTreeNodeProps) => React.ReactNode);
type TreeIcon = React.ReactNode | ((props: AntdTreeNodeAttribute) => React.ReactNode);

export interface AntdTreeNodeAttribute {
  eventKey: string;
  prefixCls: string;
  className: string;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  children: React.ReactNode;
  title: React.ReactNode;
  pos: string;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  isLeaf: boolean;
  selectable: boolean;
  disabled: boolean;
  disableCheckbox: boolean;
}

export interface AntTreeNodeProps {
  className?: string;
  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  title?: React.ReactNode | ((data: DataNode) => React.ReactNode);
  key?: Key;
  eventKey?: Key;
  isLeaf?: boolean;
  checked?: boolean;
  expanded?: boolean;
  loading?: boolean;
  selected?: boolean;
  selectable?: boolean;
  icon?: TreeIcon;
  children?: React.ReactNode;
  [customProp: string]: any;
}

export interface AntTreeNode extends Component<AntTreeNodeProps> {}

export interface AntTreeNodeBaseEvent {
  node: AntTreeNode;
  nativeEvent: MouseEvent;
}

export interface AntTreeNodeCheckedEvent extends AntTreeNodeBaseEvent {
  event: 'check';
  checked?: boolean;
  checkedNodes?: AntTreeNode[];
}

export interface AntTreeNodeSelectedEvent extends AntTreeNodeBaseEvent {
  event: 'select';
  selected?: boolean;
  selectedNodes?: DataNode[];
}

export interface AntTreeNodeExpandedEvent extends AntTreeNodeBaseEvent {
  expanded?: boolean;
}

export interface AntTreeNodeMouseEvent {
  node: AntTreeNode;
  event: React.DragEvent<HTMLElement>;
}

export interface AntTreeNodeDragEnterEvent extends AntTreeNodeMouseEvent {
  expandedKeys: Key[];
}

export interface AntTreeNodeDropEvent {
  node: AntTreeNode;
  dragNode: AntTreeNode;
  dragNodesKeys: Key[];
  dropPosition: number;
  dropToGap?: boolean;
  event: React.MouseEvent<HTMLElement>;
}

// [Legacy] Compatible for v3
export type TreeNodeNormal = DataNode;

type DraggableFn = (node: DataNode) => boolean;

interface DraggableConfig {
  icon?: React.ReactNode;
  nodeDraggable?: DraggableFn;
}

export interface TreeProps<T extends BasicDataNode = DataNode>
  extends Omit<
    RcTreeProps<T>,
    'prefixCls' | 'showLine' | 'direction' | 'draggable' | 'icon' | 'switcherIcon'
  > {
  showLine?: boolean | { showLeafIcon: boolean | TreeLeafIcon };
  className?: string;
  /** Whether to support multiple selection */
  multiple?: boolean;
  /** Whether to automatically expand the parent node */
  autoExpandParent?: boolean;
  /** Node selection in Checkable state is fully controlled (the selected state of parent and child nodes is no longer associated) */
  checkStrictly?: boolean;
  /** Whether to support selection */
  checkable?: boolean;
  /** whether to disable the tree */
  disabled?: boolean;
  /** Expand all tree nodes by default */
  defaultExpandAll?: boolean;
  /** Expand the corresponding tree node by default */
  defaultExpandParent?: boolean;
  /** Expand the specified tree node by default */
  defaultExpandedKeys?: Key[];
  /** (Controlled) Expand the specified tree node */
  expandedKeys?: Key[];
  /** (Controlled) Tree node with checked checkbox */
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  /** Tree node with checkbox checked by default */
  defaultCheckedKeys?: Key[];
  /** (Controlled) Set the selected tree node */
  selectedKeys?: Key[];
  /** Tree node selected by default */
  defaultSelectedKeys?: Key[];
  selectable?: boolean;
  /** Click on the tree node to trigger */
  filterAntTreeNode?: (node: AntTreeNode) => boolean;
  loadedKeys?: Key[];
  /** Set the node to be draggable (IE>8) */
  draggable?: DraggableFn | boolean | DraggableConfig;
  style?: React.CSSProperties;
  showIcon?: boolean;
  icon?: TreeIcon;
  switcherIcon?: SwitcherIcon;
  switcherLoadingIcon?: React.ReactNode;
  prefixCls?: string;
  children?: React.ReactNode;
  blockNode?: boolean;
}

const Tree = React.forwardRef<RcTree, TreeProps>((props, ref) => {
  const { getPrefixCls, direction, virtual, tree } = React.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    className,
    showIcon = false,
    showLine,
    switcherIcon,
    switcherLoadingIcon,
    blockNode = false,
    children,
    checkable = false,
    selectable = true,
    draggable,
    motion: customMotion,
    style,
    disabled: customDisabled,
  } = props;

  const prefixCls = getPrefixCls('tree', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const motion: CSSMotionProps = customMotion ?? {
    ...initCollapseMotion(rootPrefixCls),
    motionAppear: false,
  };

  const newProps = {
    ...props,
    checkable,
    selectable,
    showIcon,
    motion,
    blockNode,
    showLine: Boolean(showLine),
    dropIndicatorRender,
    disabled: mergedDisabled,
  };

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const [, token] = useToken();

  const itemHeight = token.paddingXS / 2 + (token.Tree?.titleHeight || token.controlHeightSM);

  const draggableConfig = React.useMemo(() => {
    if (!draggable) {
      return false;
    }

    let mergedDraggable: DraggableConfig = {};
    switch (typeof draggable) {
      case 'function':
        mergedDraggable.nodeDraggable = draggable;
        break;
      case 'object':
        mergedDraggable = { ...draggable };
        break;
      default:
        break;
      // Do nothing
    }

    if (mergedDraggable.icon !== false) {
      mergedDraggable.icon = mergedDraggable.icon || <HolderOutlined />;
    }

    return mergedDraggable;
  }, [draggable]);

  const renderSwitcherIcon = (nodeProps: AntTreeNodeProps) => (
    <SwitcherIconCom
      prefixCls={prefixCls}
      switcherIcon={switcherIcon}
      switcherLoadingIcon={switcherLoadingIcon}
      treeNodeProps={nodeProps}
      showLine={showLine}
    />
  );

  return wrapCSSVar(
    // @ts-ignore
    <RcTree
      itemHeight={itemHeight}
      ref={ref}
      virtual={virtual}
      {...newProps}
      // newProps may contain style so declare style below it
      style={{ ...tree?.style, ...style }}
      prefixCls={prefixCls}
      className={classNames(
        {
          [`${prefixCls}-icon-hide`]: !showIcon,
          [`${prefixCls}-block-node`]: blockNode,
          [`${prefixCls}-unselectable`]: !selectable,
          [`${prefixCls}-rtl`]: direction === 'rtl',
        },
        tree?.className,
        className,
        hashId,
        cssVarCls,
      )}
      direction={direction}
      checkable={checkable ? <span className={`${prefixCls}-checkbox-inner`} /> : checkable}
      selectable={selectable}
      switcherIcon={renderSwitcherIcon}
      draggable={draggableConfig}
    >
      {children}
    </RcTree>,
  );
});

if (process.env.NODE_ENV !== 'production') {
  Tree.displayName = 'Tree';
}

export default Tree;
