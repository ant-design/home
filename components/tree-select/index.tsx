import * as React from 'react';
import classNames from 'classnames';
import type { BaseSelectRef } from 'rc-select';
import type { Placement } from 'rc-select/lib/BaseSelect';
import type { TreeSelectProps as RcTreeSelectProps } from 'rc-tree-select';
import RcTreeSelect, { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode } from 'rc-tree-select';
import type { DataNode } from 'rc-tree-select/lib/interface';
import omit from 'rc-util/lib/omit';

import { useZIndex } from '../_util/hooks/useZIndex';
import type { SelectCommonPlacement } from '../_util/motion';
import { getTransitionName } from '../_util/motion';
import genPurePanel from '../_util/PurePanel';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import type { Variant } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import DisabledContext from '../config-provider/DisabledContext';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import { FormItemInputContext } from '../form/context';
import useVariant from '../form/hooks/useVariants';
import mergedBuiltinPlacements from '../select/mergedBuiltinPlacements';
import useSelectStyle from '../select/style';
import useIcons from '../select/useIcons';
import useShowArrow from '../select/useShowArrow';
import { useCompactItemContext } from '../space/Compact';
import { useToken } from '../theme/internal';
import type { AntTreeNodeProps, TreeProps } from '../tree';
import type { SwitcherIcon } from '../tree/Tree';
import SwitcherIconCom from '../tree/utils/iconUtil';
import useStyle from './style';

type RawValue = string | number;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: React.ReactNode;
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[];

export interface TreeSelectProps<ValueType = any, OptionType extends DataNode = DataNode>
  extends Omit<
    RcTreeSelectProps<ValueType, OptionType>,
    | 'showTreeIcon'
    | 'treeMotion'
    | 'mode'
    | 'getInputElement'
    | 'backfill'
    | 'treeLine'
    | 'switcherIcon'
  > {
  suffixIcon?: React.ReactNode;
  size?: SizeType;
  disabled?: boolean;
  placement?: SelectCommonPlacement;
  popupClassName?: string;
  /** @deprecated Please use `popupClassName` instead */
  dropdownClassName?: string;
  /** @deprecated Use `variant` instead. */
  bordered?: boolean;
  treeLine?: TreeProps['showLine'];
  status?: InputStatus;
  switcherIcon?: SwitcherIcon | RcTreeSelectProps<ValueType, OptionType>['switcherIcon'];
  rootClassName?: string;
  [key: `aria-${string}`]: React.AriaAttributes[keyof React.AriaAttributes];
  /** @deprecated Please use `popupMatchSelectWidth` instead */
  dropdownMatchSelectWidth?: boolean | number;
  popupMatchSelectWidth?: boolean | number;
  /**
   * @deprecated `showArrow` is deprecated which will be removed in next major version. It will be a
   *   default behavior, you can hide it by setting `suffixIcon` to null.
   */
  showArrow?: boolean;
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant;
}

const InternalTreeSelect = <ValueType = any, OptionType extends DataNode = DataNode>(
  props: TreeSelectProps<ValueType, OptionType>,
  ref: React.Ref<BaseSelectRef>,
) => {
  const {
    prefixCls: customizePrefixCls,
    size: customizeSize,
    disabled: customDisabled,
    bordered = true,
    className,
    rootClassName,
    treeCheckable,
    multiple,
    listHeight = 256,
    listItemHeight: customListItemHeight,
    placement,
    notFoundContent,
    switcherIcon,
    treeLine,
    getPopupContainer,
    popupClassName,
    dropdownClassName,
    treeIcon = false,
    transitionName,
    choiceTransitionName = '',
    status: customStatus,
    treeExpandAction,
    builtinPlacements,
    dropdownMatchSelectWidth,
    popupMatchSelectWidth,
    allowClear,
    variant: customVariant,
    dropdownStyle,
    tagRender,
    maxCount,
    showCheckedStrategy,
    treeCheckStrictly,
    ...restProps
  } = props;
  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
    direction,
    virtual,
    popupMatchSelectWidth: contextPopupMatchSelectWidth,
    popupOverflow,
  } = React.useContext(ConfigContext);

  const [, token] = useToken();
  const listItemHeight = customListItemHeight ?? token?.controlHeightSM + token?.paddingXXS;

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('TreeSelect');

    warning(
      multiple !== false || !treeCheckable,
      'usage',
      '`multiple` will always be `true` when `treeCheckable` is true',
    );

    warning.deprecated(!dropdownClassName, 'dropdownClassName', 'popupClassName');

    warning.deprecated(
      dropdownMatchSelectWidth === undefined,
      'dropdownMatchSelectWidth',
      'popupMatchSelectWidth',
    );

    warning(
      !('showArrow' in props),
      'deprecated',
      '`showArrow` is deprecated which will be removed in next major version. It will be a default behavior, you can hide it by setting `suffixIcon` to null.',
    );

    warning.deprecated(!('bordered' in props), 'bordered', 'variant');
  }

  const rootPrefixCls = getPrefixCls();
  const prefixCls = getPrefixCls('select', customizePrefixCls);
  const treePrefixCls = getPrefixCls('select-tree', customizePrefixCls);
  const treeSelectPrefixCls = getPrefixCls('tree-select', customizePrefixCls);
  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);

  const rootCls = useCSSVarCls(prefixCls);
  const treeSelectRootCls = useCSSVarCls(treeSelectPrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useSelectStyle(prefixCls, rootCls);
  const [treeSelectWrapCSSVar] = useStyle(treeSelectPrefixCls, treePrefixCls, treeSelectRootCls);

  const [variant, enableVariantCls] = useVariant('treeSelect', customVariant, bordered);

  const mergedDropdownClassName = classNames(
    popupClassName || dropdownClassName,
    `${treeSelectPrefixCls}-dropdown`,
    {
      [`${treeSelectPrefixCls}-dropdown-rtl`]: direction === 'rtl',
    },
    rootClassName,
    cssVarCls,
    rootCls,
    treeSelectRootCls,
    hashId,
  );

  const isMultiple = !!(treeCheckable || multiple);

  const mergedMaxCount = React.useMemo(() => {
    if (
      maxCount &&
      ((showCheckedStrategy === 'SHOW_ALL' && !treeCheckStrictly) ||
        showCheckedStrategy === 'SHOW_PARENT')
    ) {
      return undefined;
    }
    return maxCount;
  }, [maxCount, showCheckedStrategy, treeCheckStrictly]);

  const showSuffixIcon = useShowArrow(props.suffixIcon, props.showArrow);

  const mergedPopupMatchSelectWidth =
    popupMatchSelectWidth ?? dropdownMatchSelectWidth ?? contextPopupMatchSelectWidth;

  // ===================== Form =====================
  const {
    status: contextStatus,
    hasFeedback,
    isFormItemInput,
    feedbackIcon,
  } = React.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // ===================== Icons =====================
  const { suffixIcon, removeIcon, clearIcon } = useIcons({
    ...restProps,
    multiple: isMultiple,
    showSuffixIcon,
    hasFeedback,
    feedbackIcon,
    prefixCls,
    componentName: 'TreeSelect',
  });

  const mergedAllowClear = allowClear === true ? { clearIcon } : allowClear;

  // ===================== Empty =====================
  let mergedNotFound: React.ReactNode;
  if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent;
  } else {
    mergedNotFound = renderEmpty?.('Select') || <DefaultRenderEmpty componentName="Select" />;
  }

  // ==================== Render =====================
  const selectProps = omit(restProps, [
    'suffixIcon',
    'removeIcon',
    'clearIcon',
    'itemIcon' as any,
    'switcherIcon' as any,
  ]);

  // ===================== Placement =====================
  const memoizedPlacement = React.useMemo<Placement>(() => {
    if (placement !== undefined) {
      return placement;
    }
    return direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
  }, [placement, direction]);

  const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const mergedClassName = classNames(
    !customizePrefixCls && treeSelectPrefixCls,
    {
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-${variant}`]: enableVariantCls,
      [`${prefixCls}-in-form-item`]: isFormItemInput,
    },
    getStatusClassNames(prefixCls, mergedStatus, hasFeedback),
    compactItemClassnames,
    className,
    rootClassName,
    cssVarCls,
    rootCls,
    treeSelectRootCls,
    hashId,
  );

  const renderSwitcherIcon = (nodeProps: AntTreeNodeProps) => (
    <SwitcherIconCom
      prefixCls={treePrefixCls}
      switcherIcon={switcherIcon as SwitcherIcon}
      treeNodeProps={nodeProps}
      showLine={treeLine}
    />
  );

  // ============================ zIndex ============================
  const [zIndex] = useZIndex('SelectLike', dropdownStyle?.zIndex as number);

  const returnNode = (
    <RcTreeSelect
      virtual={virtual}
      disabled={mergedDisabled}
      {...selectProps}
      dropdownMatchSelectWidth={mergedPopupMatchSelectWidth}
      builtinPlacements={mergedBuiltinPlacements({
        buildInPlacements: builtinPlacements,
        popupOverflow,
      })}
      ref={ref}
      prefixCls={prefixCls}
      className={mergedClassName}
      listHeight={listHeight}
      listItemHeight={listItemHeight}
      treeCheckable={
        treeCheckable ? <span className={`${prefixCls}-tree-checkbox-inner`} /> : treeCheckable
      }
      treeLine={!!treeLine}
      suffixIcon={suffixIcon}
      multiple={isMultiple}
      placement={memoizedPlacement}
      removeIcon={removeIcon}
      allowClear={mergedAllowClear}
      switcherIcon={renderSwitcherIcon as RcTreeSelectProps['switcherIcon']}
      showTreeIcon={treeIcon as boolean}
      notFoundContent={mergedNotFound}
      getPopupContainer={getPopupContainer || getContextPopupContainer}
      treeMotion={null}
      dropdownClassName={mergedDropdownClassName}
      dropdownStyle={{ ...dropdownStyle, zIndex }}
      choiceTransitionName={getTransitionName(rootPrefixCls, '', choiceTransitionName)}
      transitionName={getTransitionName(rootPrefixCls, 'slide-up', transitionName)}
      treeExpandAction={treeExpandAction}
      tagRender={isMultiple ? tagRender : undefined}
      maxCount={mergedMaxCount}
      showCheckedStrategy={showCheckedStrategy}
      treeCheckStrictly={treeCheckStrictly}
    />
  );

  return wrapCSSVar(treeSelectWrapCSSVar(returnNode));
};

const TreeSelectRef = React.forwardRef(InternalTreeSelect) as <
  ValueType = any,
  OptionType extends DataNode = DataNode,
>(
  props: React.PropsWithChildren<TreeSelectProps<ValueType, OptionType>> &
    React.RefAttributes<BaseSelectRef>,
) => React.ReactElement;

type InternalTreeSelectType = typeof TreeSelectRef;

type CompoundedComponent = InternalTreeSelectType & {
  displayName?: string;
  TreeNode: typeof TreeNode;
  SHOW_ALL: typeof SHOW_ALL;
  SHOW_PARENT: typeof SHOW_PARENT;
  SHOW_CHILD: typeof SHOW_CHILD;
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};

const TreeSelect = TreeSelectRef as CompoundedComponent;

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(TreeSelect, 'dropdownAlign', (props: any) =>
  omit(props, ['visible']),
);

TreeSelect.TreeNode = TreeNode;
TreeSelect.SHOW_ALL = SHOW_ALL;
TreeSelect.SHOW_PARENT = SHOW_PARENT;
TreeSelect.SHOW_CHILD = SHOW_CHILD;
TreeSelect._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

if (process.env.NODE_ENV !== 'production') {
  TreeSelect.displayName = 'TreeSelect';
}

export { TreeNode };

export default TreeSelect;
