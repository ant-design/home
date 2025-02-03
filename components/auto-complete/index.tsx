import * as React from 'react';
import classNames from 'classnames';
import type { BaseSelectRef } from 'rc-select';
import toArray from 'rc-util/lib/Children/toArray';
import omit from 'rc-util/lib/omit';

import { useZIndex } from '../_util/hooks/useZIndex';
import type { AdjustOverflow } from '../_util/placements';
import genPurePanel from '../_util/PurePanel';
import type { InputStatus } from '../_util/statusUtils';
import { devUseWarning } from '../_util/warning';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import type {
  BaseOptionType,
  DefaultOptionType,
  InternalSelectProps,
  RefSelectProps,
  SelectProps,
} from '../select';
import Select from '../select';

const { Option } = Select;

export interface DataSourceItemObject {
  value: string;
  text: string;
}
export type DataSourceItemType = DataSourceItemObject | React.ReactNode;

export interface AutoCompleteProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> extends Omit<
    InternalSelectProps<ValueType, OptionType>,
    'loading' | 'mode' | 'optionLabelProp' | 'labelInValue'
  > {
  /** @deprecated Please use `options` instead */
  dataSource?: DataSourceItemType[];
  status?: InputStatus;
  popupClassName?: string;
  /** @deprecated Please use `popupClassName` instead */
  dropdownClassName?: string;
  /** @deprecated Please use `popupMatchSelectWidth` instead */
  dropdownMatchSelectWidth?: boolean | number;
  popupMatchSelectWidth?: boolean | number;
  autoAdjustOverflow?: boolean | AdjustOverflow;
}

function isSelectOptionOrSelectOptGroup(child: any): boolean {
  return child?.type && (child.type.isSelectOption || child.type.isSelectOptGroup);
}

const AutoComplete: React.ForwardRefRenderFunction<RefSelectProps, AutoCompleteProps> = (
  props,
  ref,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    popupClassName,
    dropdownClassName,
    children,
    dataSource,
    autoAdjustOverflow = true,
  } = props;
  const childNodes: React.ReactElement[] = toArray(children);

  // ============================= Input =============================
  let customizeInput: React.ReactElement | undefined;

  if (
    childNodes.length === 1 &&
    React.isValidElement(childNodes[0]) &&
    !isSelectOptionOrSelectOptGroup(childNodes[0])
  ) {
    [customizeInput] = childNodes;
  }

  const getInputElement = customizeInput ? (): React.ReactElement => customizeInput! : undefined;

  // ============================ Options ============================
  let optionChildren: React.ReactNode;

  // [Legacy] convert `children` or `dataSource` into option children
  if (childNodes.length && isSelectOptionOrSelectOptGroup(childNodes[0])) {
    optionChildren = children;
  } else {
    optionChildren = dataSource
      ? dataSource.map((item) => {
          if (React.isValidElement(item)) {
            return item;
          }
          switch (typeof item) {
            case 'string':
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            case 'object': {
              const { value: optionValue } = item as DataSourceItemObject;
              return (
                <Option key={optionValue} value={optionValue}>
                  {(item as DataSourceItemObject).text}
                </Option>
              );
            }
            default:
              return undefined;
          }
        })
      : [];
  }

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('AutoComplete');

    warning.deprecated(!('dataSource' in props), 'dataSource', 'options');

    warning(
      !customizeInput || !('size' in props),
      'usage',
      'You need to control style self instead of setting `size` when using customize input.',
    );

    warning.deprecated(!dropdownClassName, 'dropdownClassName', 'popupClassName');
  }

  const { getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);

  const prefixCls = getPrefixCls('select', customizePrefixCls);

  // ============================ zIndex ============================
  const [zIndex] = useZIndex('SelectLike', props.dropdownStyle?.zIndex as number);

  return (
    <Select
      ref={ref}
      suffixIcon={null}
      {...omit(props, ['dataSource', 'dropdownClassName'])}
      prefixCls={prefixCls}
      popupClassName={popupClassName || dropdownClassName}
      dropdownStyle={{
        ...props.dropdownStyle,
        zIndex,
      }}
      className={classNames(`${prefixCls}-auto-complete`, className)}
      mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE as SelectProps['mode']}
      autoAdjustOverflow={autoAdjustOverflow}
      {...{
        // Internal api
        getInputElement,
      }}
    >
      {optionChildren}
    </Select>
  );
};

const RefAutoComplete = React.forwardRef<RefSelectProps, AutoCompleteProps>(
  AutoComplete,
) as unknown as (<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(
  props: React.PropsWithChildren<AutoCompleteProps<ValueType, OptionType>> &
    React.RefAttributes<BaseSelectRef>,
) => React.ReactElement) & {
  displayName?: string;
  Option: typeof Option;
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(RefAutoComplete, 'dropdownAlign', (props: any) =>
  omit(props, ['visible']),
);

RefAutoComplete.Option = Option;
RefAutoComplete._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

if (process.env.NODE_ENV !== 'production') {
  RefAutoComplete.displayName = 'AutoComplete';
}

export default RefAutoComplete;
