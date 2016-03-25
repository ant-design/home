import React from 'react';
import RcTree from 'rc-tree';
import animation from '../common/openAnimation';

export default class Tree extends React.Component {
  render() {
    const props = this.props;
    let checkable = props.checkable;
    if (checkable) {
      checkable = <span className={`${props.prefixCls}-checkbox-inner`}></span>;
    }
    return (
      <RcTree {...props} checkable={checkable}>
        {this.props.children}
      </RcTree>
    );
  }
}

Tree.defaultProps = {
  prefixCls: 'ant-tree',
  checkable: false,
  showIcon: false,
  openAnimation: animation,
};

Tree.TreeNode = RcTree.TreeNode;
