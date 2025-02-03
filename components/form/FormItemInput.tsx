import * as React from 'react';
import type { JSX } from 'react';
import classNames from 'classnames';
import { get, set } from 'rc-util';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';

import type { ColProps } from '../grid/col';
import Col from '../grid/col';
import { FormContext, FormItemPrefixContext } from './context';
import ErrorList from './ErrorList';
import type { ValidateStatus } from './FormItem';
import FallbackCmp from './style/fallbackCmp';

/** @internal */
type InternalItemRender = {
  mark: string;
  render: (
    props: FormItemInputProps & FormItemInputMiscProps,
    domList: {
      input: JSX.Element;
      errorList: JSX.Element | null;
      extra: JSX.Element | null;
    },
  ) => React.ReactNode;
  prepare: (
    ...params: Parameters<InternalItemRender['render']>
  ) => Parameters<InternalItemRender['render']>[1];
};

interface FormItemInputMiscProps {
  prefixCls: string;
  children: React.ReactNode;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
  marginBottom?: number | null;
  onErrorVisibleChanged?: (visible: boolean) => void;
  /** @internal do not use in any of your production. */
  _internalItemRender?: InternalItemRender;
}

export interface FormItemInputProps {
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  extra?: React.ReactNode;
  status?: ValidateStatus;
  help?: React.ReactNode;
  fieldId?: string;
  label?: React.ReactNode;
}
const GRID_MAX = 24;

const FormItemInput: React.FC<FormItemInputProps & FormItemInputMiscProps> = (props) => {
  const {
    prefixCls,
    status,
    labelCol,
    wrapperCol,
    children,
    errors,
    warnings,
    _internalItemRender: formItemRender,
    extra,
    help,
    fieldId,
    marginBottom,
    onErrorVisibleChanged,
    label,
  } = props;
  const baseClassName = `${prefixCls}-item`;

  const formContext = React.useContext(FormContext);

  const mergedWrapperCol = React.useMemo(() => {
    let mergedWrapper: ColProps = { ...(wrapperCol || formContext.wrapperCol || {}) };
    if (label === null && !labelCol && !wrapperCol && formContext.labelCol) {
      const list = [undefined, 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

      list.forEach((size) => {
        const _size = size ? [size] : [];

        const formLabel = get(formContext.labelCol, _size);
        const formLabelObj = typeof formLabel === 'object' ? formLabel : {};

        const wrapper = get(mergedWrapper, _size);
        const wrapperObj = typeof wrapper === 'object' ? wrapper : {};

        if ('span' in formLabelObj && !('offset' in wrapperObj) && formLabelObj.span < GRID_MAX) {
          mergedWrapper = set(mergedWrapper, [..._size, 'offset'], formLabelObj.span);
        }
      });
    }
    return mergedWrapper;
  }, [wrapperCol, formContext]);

  const className = classNames(`${baseClassName}-control`, mergedWrapperCol.className);

  // Pass to sub FormItem should not with col info
  const subFormContext = React.useMemo(() => {
    const { labelCol, wrapperCol, ...rest } = formContext;
    return rest;
  }, [formContext]);

  const extraRef = React.useRef<HTMLDivElement>(null);
  const [extraHeight, setExtraHeight] = React.useState<number>(0);
  useLayoutEffect(() => {
    if (extra && extraRef.current) {
      setExtraHeight(extraRef.current.clientHeight);
    } else {
      setExtraHeight(0);
    }
  }, [extra]);

  const inputDom: React.ReactNode = (
    <div className={`${baseClassName}-control-input`}>
      <div className={`${baseClassName}-control-input-content`}>{children}</div>
    </div>
  );
  const formItemContext = React.useMemo(() => ({ prefixCls, status }), [prefixCls, status]);
  const errorListDom: React.ReactNode =
    marginBottom !== null || errors.length || warnings.length ? (
      <FormItemPrefixContext.Provider value={formItemContext}>
        <ErrorList
          fieldId={fieldId}
          errors={errors}
          warnings={warnings}
          help={help}
          helpStatus={status}
          className={`${baseClassName}-explain-connected`}
          onVisibleChanged={onErrorVisibleChanged}
        />
      </FormItemPrefixContext.Provider>
    ) : null;

  const extraProps: { id?: string } = {};

  if (fieldId) {
    extraProps.id = `${fieldId}_extra`;
  }

  // If extra = 0, && will goes wrong
  // 0&&error -> 0
  const extraDom: React.ReactNode = extra ? (
    <div {...extraProps} className={`${baseClassName}-extra`} ref={extraRef}>
      {extra}
    </div>
  ) : null;

  let innerRender: InternalItemRender['render'] = (_, { input, errorList, extra }) => (
    <>
      {input}
      {errorList || extra ? (
        <div
          className={`${baseClassName}-additional`}
          style={marginBottom ? { minHeight: marginBottom + extraHeight } : {}}
        >
          {errorList}
          {extra}
        </div>
      ) : null}
    </>
  );

  // It is just for `pro-components`
  if (formItemRender?.mark === 'pro_table_render') {
    if (typeof formItemRender.prepare === 'function') {
      const _clonedInnerRender = innerRender;
      innerRender = (...args) => _clonedInnerRender(args[0], formItemRender.prepare(...args));
    } else if (typeof formItemRender.render === 'function') {
      innerRender = formItemRender.render;
    }
  }

  return (
    <FormContext.Provider value={subFormContext}>
      <Col {...mergedWrapperCol} className={className}>
        {innerRender(props, {
          input: inputDom,
          errorList: errorListDom,
          extra: extraDom,
        })}
      </Col>
      <FallbackCmp prefixCls={prefixCls} />
    </FormContext.Provider>
  );
};

export default FormItemInput;
