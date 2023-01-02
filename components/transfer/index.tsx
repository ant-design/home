/* eslint-disable @typescript-eslint/no-shadow */
import classNames from 'classnames';
import * as React from 'react';
import type { ConfigConsumerProps, RenderEmptyHandler } from '../config-provider';
import { ConfigContext } from '../config-provider';
import defaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import type { FormItemStatusContextProps } from '../form/context';
import { FormItemInputContext } from '../form/context';
import LocaleReceiver from '../locale/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { groupKeysMap, groupDisabledKeysMap } from '../_util/transKeys';
import warning from '../_util/warning';
import type { PaginationType } from './interface';
import type { TransferListProps } from './list';
import List from './list';
import type { TransferListBodyProps } from './ListBody';
import Operation from './operation';
import Search from './search';

import useStyle from './style';

export type { TransferListProps } from './list';
export type { TransferOperationProps } from './operation';
export type { TransferSearchProps } from './search';

export type TransferDirection = 'left' | 'right';

export interface RenderResultObject {
  label: React.ReactElement;
  value: string;
}

export type RenderResult = React.ReactElement | RenderResultObject | string | null;

export interface TransferItem {
  key?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  [name: string]: any;
}

export type KeyWise<T> = T & { key: string };

export type KeyWiseTransferItem = KeyWise<TransferItem>;

type TransferRender<RecordType> = (item: RecordType) => RenderResult;

export interface ListStyle {
  direction: TransferDirection;
}

export type SelectAllLabel =
  | React.ReactNode
  | ((info: { selectedCount: number; totalCount: number }) => React.ReactNode);

export interface TransferLocale {
  titles?: React.ReactNode[];
  notFoundContent?: React.ReactNode | React.ReactNode[];
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
  remove?: string;
  selectAll?: string;
  selectCurrent?: string;
  selectInvert?: string;
  removeAll?: string;
  removeCurrent?: string;
}

export interface TransferProps<RecordType> {
  prefixCls?: string;
  className?: string;
  disabled?: boolean;
  dataSource?: RecordType[];
  targetKeys?: string[];
  selectedKeys?: string[];
  render?: TransferRender<RecordType>;
  onChange?: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
  onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
  style?: React.CSSProperties;
  listStyle?: ((style: ListStyle) => React.CSSProperties) | React.CSSProperties;
  operationStyle?: React.CSSProperties;
  titles?: React.ReactNode[];
  operations?: string[];
  showSearch?: boolean;
  filterOption?: (inputValue: string, item: RecordType) => boolean;
  locale?: Partial<TransferLocale>;
  footer?: (
    props: TransferListProps<RecordType>,
    info?: {
      direction: TransferDirection;
    },
  ) => React.ReactNode;
  rowKey?: (record: RecordType) => string;
  onSearch?: (direction: TransferDirection, value: string) => void;
  onScroll?: (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => void;
  children?: (props: TransferListBodyProps<RecordType>) => React.ReactNode;
  showSelectAll?: boolean;
  selectAllLabels?: SelectAllLabel[];
  oneWay?: boolean;
  pagination?: PaginationType;
  status?: InputStatus;
}

interface TransferFCProps {
  prefixCls: string;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const TransferFC: React.FC<TransferFCProps> = (props) => {
  const { prefixCls } = props;

  const [wrapSSR, hashId] = useStyle(prefixCls);

  return wrapSSR(
    <div className={classNames(props.className, hashId)} style={props.style}>
      {props.children}
    </div>,
  );
};

const Transfer = <RecordType extends TransferItem = TransferItem>(
  props: TransferProps<RecordType>,
) => {
  const {
    dataSource = [],
    selectedKeys = [],
    targetKeys = [],
    titles,
    locale = {},
    rowKey,
    onScroll,
    onChange,
    onSearch,
    onSelectChange,
    prefixCls: customizePrefixCls,
    className,
    disabled,
    operations = [],
    showSearch = false,
    footer,
    style,
    listStyle = {},
    operationStyle,
    filterOption,
    render,
    children,
    showSelectAll,
    oneWay,
    pagination,
    selectAllLabels = [],
    status: customStatus,
  } = props;

  const [sourceSelectedKeys, setSourceSelectedKeys] = React.useState<string[]>(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!('selectedKeys' in props)) {
        warning(
          !pagination || !children,
          'Transfer',
          '`pagination` not support customize render list.',
        );
      }
    }
    if (selectedKeys.length) {
      return selectedKeys.filter((key) => !targetKeys.includes(key));
    }
    return [];
  });

  const [targetSelectedKeys, setTargetSelectedKeys] = React.useState<string[]>(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!('selectedKeys' in props)) {
        warning(
          !pagination || !children,
          'Transfer',
          '`pagination` not support customize render list.',
        );
      }
    }
    if (selectedKeys.length) {
      return selectedKeys.filter((key) => targetKeys.includes(key));
    }
    return [];
  });

  const setStateKeys = (
    direction: TransferDirection,
    keys: string[] | ((prevKeys: string[]) => string[]),
  ) => {
    if (direction === 'left') {
      setSourceSelectedKeys((prev) => (typeof keys === 'function' ? keys(prev || []) : keys));
    } else {
      setTargetSelectedKeys((prev) => (typeof keys === 'function' ? keys(prev || []) : keys));
    }
  };

  const getTitles = (transferLocale: TransferLocale): React.ReactNode[] =>
    titles ?? transferLocale.titles ?? [];

  const getLocale = (transferLocale: TransferLocale, renderEmpty: RenderEmptyHandler) => ({
    ...transferLocale,
    notFoundContent: renderEmpty('Transfer'),
    ...locale,
  });

  const handleLeftScroll = (e: React.SyntheticEvent<HTMLUListElement>) => {
    onScroll?.('left', e);
  };

  const handleRightScroll = (e: React.SyntheticEvent<HTMLUListElement>) => {
    onScroll?.('right', e);
  };

  const handleSelectChange = (direction: TransferDirection, holder: string[]) => {
    if (direction === 'left') {
      onSelectChange?.(holder, targetSelectedKeys);
    } else {
      onSelectChange?.(sourceSelectedKeys, holder);
    }
  };

  const moveTo = (direction: TransferDirection) => {
    const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
    const dataSourceDisabledKeysMap = groupDisabledKeysMap(dataSource);
    // filter the disabled options
    const newMoveKeys = moveKeys.filter((key) => !dataSourceDisabledKeysMap.has(key));
    const newMoveKeysMap = groupKeysMap(newMoveKeys);
    // move items to target box
    const newTargetKeys =
      direction === 'right'
        ? newMoveKeys.concat(targetKeys)
        : targetKeys.filter((targetKey) => !newMoveKeysMap.has(targetKey));

    // empty checked keys
    const oppositeDirection = direction === 'right' ? 'left' : 'right';
    setStateKeys(oppositeDirection, []);
    handleSelectChange(oppositeDirection, []);
    onChange?.(newTargetKeys, direction, newMoveKeys);
  };

  const moveToLeft = () => {
    moveTo('left');
  };

  const moveToRight = () => {
    moveTo('right');
  };

  const onItemSelectAll = (
    direction: TransferDirection,
    selectedKeys: string[],
    checkAll: boolean,
  ) => {
    setStateKeys(direction, (prevKeys) => {
      let mergedCheckedKeys: string[] = [];
      if (checkAll) {
        // Merge current keys with origin key
        mergedCheckedKeys = Array.from(new Set<string>([...prevKeys, ...selectedKeys]));
      } else {
        const selectedKeysMap = groupKeysMap(selectedKeys);
        // Remove current keys from origin keys
        mergedCheckedKeys = prevKeys.filter((key) => !selectedKeysMap.has(key));
      }
      handleSelectChange(direction, mergedCheckedKeys);
      return mergedCheckedKeys;
    });
  };

  const onLeftItemSelectAll = (selectedKeys: string[], checkAll: boolean) => {
    onItemSelectAll('left', selectedKeys, checkAll);
  };

  const onRightItemSelectAll = (selectedKeys: string[], checkAll: boolean) => {
    onItemSelectAll('right', selectedKeys, checkAll);
  };

  const handleLeftFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.('left', e.target.value);
  };

  const handleRightFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.('right', e.target.value);
  };

  const handleLeftClear = () => {
    onSearch?.('left', '');
  };

  const handleRightClear = () => {
    onSearch?.('right', '');
  };

  const onItemSelect = (direction: TransferDirection, selectedKey: string, checked: boolean) => {
    const holder = direction === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys];
    const index = holder.indexOf(selectedKey);
    if (index > -1) {
      holder.splice(index, 1);
    }
    if (checked) {
      holder.push(selectedKey);
    }
    handleSelectChange(direction, holder);
    if (!('selectedKeys' in props)) {
      setStateKeys(direction, holder);
    }
  };

  const onLeftItemSelect = (selectedKey: string, checked: boolean) => {
    onItemSelect('left', selectedKey, checked);
  };

  const onRightItemSelect = (selectedKey: string, checked: boolean) => {
    onItemSelect('right', selectedKey, checked);
  };

  const onRightItemRemove = (selectedKeys: string[]) => {
    setStateKeys('right', []);
    onChange?.(
      targetKeys.filter((key) => !selectedKeys.includes(key)),
      'left',
      [...selectedKeys],
    );
  };

  const handleListStyle = (
    listStyle: TransferProps<RecordType>['listStyle'],
    direction: TransferDirection,
  ): React.CSSProperties => {
    if (typeof listStyle === 'function') {
      return listStyle({ direction });
    }
    return listStyle!;
  };

  const separateDataSource = () => {
    const leftDataSource: KeyWise<RecordType>[] = [];
    const rightDataSource: KeyWise<RecordType>[] = new Array(targetKeys.length);
    const targetKeysMap = groupKeysMap(targetKeys);
    dataSource.forEach((record: KeyWise<RecordType>) => {
      if (rowKey) {
        record = { ...record, key: rowKey(record) };
      }
      // rightDataSource should be ordered by targetKeys
      // leftDataSource should be ordered by dataSource
      if (targetKeysMap.has(record.key)) {
        rightDataSource[targetKeysMap.get(record.key)!] = record;
      } else {
        leftDataSource.push(record);
      }
    });
    return { leftDataSource, rightDataSource };
  };

  const configContext = React.useContext<ConfigConsumerProps>(ConfigContext);
  const formItemContext = React.useContext<FormItemStatusContextProps>(FormItemInputContext);

  const { getPrefixCls, renderEmpty, direction } = configContext;
  const { hasFeedback, status } = formItemContext;

  const prefixCls = getPrefixCls('transfer', customizePrefixCls);
  const mergedStatus = getMergedStatus(status, customStatus);
  const mergedPagination = !children && pagination;

  const { leftDataSource, rightDataSource } = separateDataSource();
  const leftActive = targetSelectedKeys.length > 0;
  const rightActive = sourceSelectedKeys.length > 0;

  const cls = classNames(
    prefixCls,
    {
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-customize-list`]: !!children,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    getStatusClassNames(prefixCls, mergedStatus, hasFeedback),
    className,
  );

  return (
    <LocaleReceiver componentName="Transfer" defaultLocale={defaultLocale.Transfer}>
      {(contextLocale) => {
        const locale = getLocale(contextLocale, renderEmpty || defaultRenderEmpty);
        const titles = getTitles(locale);
        return (
          <TransferFC prefixCls={prefixCls} className={cls} style={style}>
            <List<KeyWise<RecordType>>
              prefixCls={`${prefixCls}-list`}
              titleText={titles?.[0]}
              dataSource={leftDataSource}
              filterOption={filterOption}
              style={handleListStyle(listStyle, 'left')}
              checkedKeys={sourceSelectedKeys}
              handleFilter={handleLeftFilter}
              handleClear={handleLeftClear}
              onItemSelect={onLeftItemSelect}
              onItemSelectAll={onLeftItemSelectAll}
              render={render}
              showSearch={showSearch}
              renderList={children}
              footer={footer}
              onScroll={handleLeftScroll}
              disabled={disabled}
              direction={direction === 'rtl' ? 'right' : 'left'}
              showSelectAll={showSelectAll}
              selectAllLabel={selectAllLabels[0]}
              pagination={mergedPagination}
              {...locale}
            />
            <Operation
              className={`${prefixCls}-operation`}
              rightActive={rightActive}
              rightArrowText={operations[0]}
              moveToRight={moveToRight}
              leftActive={leftActive}
              leftArrowText={operations[1]}
              moveToLeft={moveToLeft}
              style={operationStyle}
              disabled={disabled}
              direction={direction}
              oneWay={oneWay}
            />
            <List<KeyWise<RecordType>>
              prefixCls={`${prefixCls}-list`}
              titleText={titles?.[1]}
              dataSource={rightDataSource}
              filterOption={filterOption}
              style={handleListStyle(listStyle, 'right')}
              checkedKeys={targetSelectedKeys}
              handleFilter={handleRightFilter}
              handleClear={handleRightClear}
              onItemSelect={onRightItemSelect}
              onItemSelectAll={onRightItemSelectAll}
              onItemRemove={onRightItemRemove}
              render={render}
              showSearch={showSearch}
              renderList={children}
              footer={footer}
              onScroll={handleRightScroll}
              disabled={disabled}
              direction={direction === 'rtl' ? 'left' : 'right'}
              showSelectAll={showSelectAll}
              selectAllLabel={selectAllLabels[1]}
              showRemove={oneWay}
              pagination={mergedPagination}
              {...locale}
            />
          </TransferFC>
        );
      }}
    </LocaleReceiver>
  );
};

Transfer.List = List;
Transfer.Search = Search;
Transfer.Operation = Operation;

export default Transfer;
