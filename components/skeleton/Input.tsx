import * as React from 'react';
import classNames from 'classnames';

import { ConfigContext } from '../config-provider';
import type { SkeletonElementProps } from './Element';
import Element from './Element';
import useStyle from './style';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default';
  block?: boolean;
}

const SkeletonInput: React.FC<SkeletonInputProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    classNames: skeletonInputClassNames,
    rootClassName,
    active,
    block,
    style,
    styles,
    size = 'default',
    ...rest
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const cls = classNames(
    prefixCls,
    `${prefixCls}-element`,
    {
      [`${prefixCls}-active`]: active,
      [`${prefixCls}-block`]: block,
    },
    skeletonInputClassNames?.root,
    className,
    rootClassName,
    hashId,
    cssVarCls,
  );

  return wrapCSSVar(
    <div className={cls} style={styles?.root}>
      <Element
        prefixCls={`${prefixCls}-input`}
        className={skeletonInputClassNames?.content}
        style={{ ...styles?.content, ...style }}
        size={size}
        {...rest}
      />
    </div>,
  );
};

export default SkeletonInput;
