import * as React from 'react';
import classNames from 'classnames';

import extendsObject from '../_util/extendsObject';
import type { Breakpoint } from '../_util/responsiveObserver';
import { responsiveArray } from '../_util/responsiveObserver';
import { ConfigContext } from '../config-provider';
import { useComponentConfig } from '../config-provider/context';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import useSize from '../config-provider/hooks/useSize';
import { Row } from '../grid';
import type { RowProps } from '../grid';
import useBreakpoint from '../grid/hooks/useBreakpoint';
import type { PaginationConfig } from '../pagination';
import Pagination from '../pagination';
import type { SpinProps } from '../spin';
import Spin from '../spin';
import { ListContext } from './context';
import Item from './Item';
import useStyle from './style';

export type { ListItemMetaProps, ListItemProps } from './Item';
export type { ListConsumerProps } from './context';

export type ColumnCount = number;

export type ColumnType = 'gutter' | 'column' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ListGridType {
  gutter?: RowProps['gutter'];
  column?: ColumnCount;
  xs?: ColumnCount;
  sm?: ColumnCount;
  md?: ColumnCount;
  lg?: ColumnCount;
  xl?: ColumnCount;
  xxl?: ColumnCount;
}

export type ListSize = 'small' | 'default' | 'large';

export type ListItemLayout = 'horizontal' | 'vertical';

export interface ListProps<T> {
  bordered?: boolean;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  dataSource?: T[];
  extra?: React.ReactNode;
  grid?: ListGridType;
  id?: string;
  itemLayout?: ListItemLayout;
  loading?: boolean | SpinProps;
  loadMore?: React.ReactNode;
  pagination?: PaginationConfig | false;
  prefixCls?: string;
  rowKey?: ((item: T) => React.Key) | keyof T;
  renderItem?: (item: T, index: number) => React.ReactNode;
  size?: ListSize;
  split?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  locale?: ListLocale;

  styles?: {
    header?: React.CSSProperties;
    footer?: React.CSSProperties;
  };
}

export interface ListLocale {
  emptyText: React.ReactNode;
}

function InternalList<T>(
  {
    pagination = false as ListProps<T>['pagination'],
    prefixCls: customizePrefixCls,
    bordered = false,
    split = true,
    className,
    rootClassName,
    style,
    children,
    itemLayout,
    loadMore,
    grid,
    dataSource = [],
    size: customizeSize,
    header,
    footer,
    loading = false,
    rowKey,
    renderItem,
    locale,
    styles,
    ...rest
  }: ListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};

  const [paginationCurrent, setPaginationCurrent] = React.useState(
    paginationObj.defaultCurrent || 1,
  );
  const [paginationSize, setPaginationSize] = React.useState(paginationObj.defaultPageSize || 10);

  const {
    getPrefixCls,
    direction,
    className: contextClassName,
    style: contextStyle,
  } = useComponentConfig('list');
  const { renderEmpty } = React.useContext(ConfigContext);

  const defaultPaginationProps = {
    current: 1,
    total: 0,
  };

  const triggerPaginationEvent =
    (eventName: 'onChange' | 'onShowSizeChange') => (page: number, pageSize: number) => {
      setPaginationCurrent(page);
      setPaginationSize(pageSize);
      if (pagination) {
        pagination?.[eventName]?.(page, pageSize);
      }
    };

  const onPaginationChange = triggerPaginationEvent('onChange');

  const onPaginationShowSizeChange = triggerPaginationEvent('onShowSizeChange');

  const renderInnerItem = (item: T, index: number) => {
    if (!renderItem) return null;

    let key: any;

    if (typeof rowKey === 'function') {
      key = rowKey(item);
    } else if (rowKey) {
      key = item[rowKey];
    } else {
      key = (item as any).key;
    }

    if (!key) {
      key = `list-item-${index}`;
    }

    return <React.Fragment key={key}>{renderItem(item, index)}</React.Fragment>;
  };

  const isSomethingAfterLastItem = () => !!(loadMore || pagination || footer);

  const prefixCls = getPrefixCls('list', customizePrefixCls);

  // Style
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  let loadingProp = loading;
  if (typeof loadingProp === 'boolean') {
    loadingProp = {
      spinning: loadingProp,
    };
  }
  const isLoading = !!loadingProp?.spinning;

  const mergedSize = useSize(customizeSize);

  // large => lg
  // small => sm
  let sizeCls = '';
  switch (mergedSize) {
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
      break;
    default:
      break;
  }

  const classString = classNames(
    prefixCls,
    {
      [`${prefixCls}-vertical`]: itemLayout === 'vertical',
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-split`]: split,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-loading`]: isLoading,
      [`${prefixCls}-grid`]: !!grid,
      [`${prefixCls}-something-after-last-item`]: isSomethingAfterLastItem(),
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    contextClassName,
    className,
    rootClassName,
    hashId,
    cssVarCls,
  );

  const paginationProps = extendsObject<PaginationConfig>(
    defaultPaginationProps,
    {
      total: dataSource.length,
      current: paginationCurrent,
      pageSize: paginationSize,
    },
    pagination || {},
  );

  const largestPage = Math.ceil(paginationProps.total / paginationProps.pageSize);
  if (paginationProps.current > largestPage) {
    paginationProps.current = largestPage;
  }
  const paginationContent = pagination && (
    <div className={classNames(`${prefixCls}-pagination`)}>
      <Pagination
        align="end"
        {...paginationProps}
        onChange={onPaginationChange}
        onShowSizeChange={onPaginationShowSizeChange}
      />
    </div>
  );

  let splitDataSource = [...dataSource];
  if (pagination) {
    if (dataSource.length > (paginationProps.current - 1) * paginationProps.pageSize) {
      splitDataSource = [...dataSource].splice(
        (paginationProps.current - 1) * paginationProps.pageSize,
        paginationProps.pageSize,
      );
    }
  }

  const needResponsive = Object.keys(grid || {}).some((key) =>
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key),
  );
  const screens = useBreakpoint(needResponsive);
  const currentBreakpoint = React.useMemo(() => {
    for (let i = 0; i < responsiveArray.length; i += 1) {
      const breakpoint: Breakpoint = responsiveArray[i];
      if (screens[breakpoint]) {
        return breakpoint;
      }
    }
    return undefined;
  }, [screens]);

  const colStyle = React.useMemo(() => {
    if (!grid) {
      return undefined;
    }
    const columnCount =
      currentBreakpoint && grid[currentBreakpoint] ? grid[currentBreakpoint] : grid.column;
    if (columnCount) {
      return {
        width: `${100 / columnCount}%`,
        maxWidth: `${100 / columnCount}%`,
      };
    }
  }, [JSON.stringify(grid), currentBreakpoint]);

  let childrenContent: React.ReactNode = isLoading && <div style={{ minHeight: 53 }} />;
  if (splitDataSource.length > 0) {
    const items = splitDataSource.map((item: T, index: number) => renderInnerItem(item, index));
    childrenContent = grid ? (
      <Row gutter={grid.gutter}>
        {React.Children.map(items, (child) => (
          <div key={child?.key} style={colStyle}>
            {child}
          </div>
        ))}
      </Row>
    ) : (
      <ul className={`${prefixCls}-items`}>{items}</ul>
    );
  } else if (!children && !isLoading) {
    childrenContent = (
      <div className={`${prefixCls}-empty-text`}>
        {locale?.emptyText || renderEmpty?.('List') || <DefaultRenderEmpty componentName="List" />}
      </div>
    );
  }

  const paginationPosition = paginationProps.position || 'bottom';
  const contextValue = React.useMemo(
    () => ({ grid, itemLayout }),
    [JSON.stringify(grid), itemLayout],
  );

  return wrapCSSVar(
    <ListContext.Provider value={contextValue}>
      <div ref={ref} style={{ ...contextStyle, ...style }} className={classString} {...rest}>
        {(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent}
        {header && (
          <div className={`${prefixCls}-header`} style={styles?.header}>
            {header}
          </div>
        )}
        <Spin {...loadingProp}>
          {childrenContent}
          {children}
        </Spin>
        {footer && (
          <div className={`${prefixCls}-footer`} style={styles?.footer}>
            {footer}
          </div>
        )}
        {loadMore ||
          ((paginationPosition === 'bottom' || paginationPosition === 'both') && paginationContent)}
      </div>
    </ListContext.Provider>,
  );
}

const ListWithForwardRef = React.forwardRef(InternalList) as (<T>(
  props: ListProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => ReturnType<typeof InternalList>) &
  Pick<React.FC, 'displayName'>;

if (process.env.NODE_ENV !== 'production') {
  ListWithForwardRef.displayName = 'List';
}

type CompoundedComponent = typeof ListWithForwardRef & {
  Item: typeof Item;
};

const List = ListWithForwardRef as CompoundedComponent;

List.Item = Item;

export default List;
