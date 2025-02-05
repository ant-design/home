import * as React from 'react';
import classNames from 'classnames';

import { ConfigContext } from '../config-provider';
import type { SkeletonElementProps } from './Element';
import useStyle from './style';

export interface SkeletonNodeProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  children?: React.ReactNode;
}

const SkeletonNode: React.FC<SkeletonNodeProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    classNames: skeletonNodeClassNames,
    rootClassName,
    style,
    styles,
    active,
    children,
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const cls = classNames(
    prefixCls,
    `${prefixCls}-element`,
    {
      [`${prefixCls}-active`]: active,
    },
    hashId,
    skeletonNodeClassNames?.root,
    className,
    rootClassName,
    cssVarCls,
  );

  return wrapCSSVar(
    <div className={cls} style={styles?.root}>
      <div
        className={classNames(skeletonNodeClassNames?.content, `${prefixCls}-node`)}
        style={{ ...styles?.content, ...style }}
      >
        {children}
      </div>
    </div>,
  );
};

export default SkeletonNode;
