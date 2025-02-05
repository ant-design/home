import * as React from 'react';
import classNames from 'classnames';

import { useComponentConfig } from '../config-provider/context';
import type { AvatarProps } from './Avatar';
import SkeletonAvatar from './Avatar';
import SkeletonButton from './Button';
import Element from './Element';
import SkeletonImage from './Image';
import SkeletonInput from './Input';
import SkeletonNode from './Node';
import type { SkeletonParagraphProps } from './Paragraph';
import Paragraph from './Paragraph';
import useStyle from './style';
import type { SkeletonTitleProps } from './Title';
import Title from './Title';

/* This only for skeleton internal. */
type SkeletonAvatarProps = Omit<AvatarProps, 'active'>;

export type SemanticName = 'root' | 'header' | 'section' | 'avatar' | 'title' | 'paragraph';

export interface SkeletonProps {
  active?: boolean;
  loading?: boolean;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  avatar?: SkeletonAvatarProps | boolean;
  title?: SkeletonTitleProps | boolean;
  paragraph?: SkeletonParagraphProps | boolean;
  round?: boolean;
  classNames?: Record<SemanticName, string>;
  styles?: Record<SemanticName, React.CSSProperties>;
}

function getComponentProps<T>(prop?: T | boolean): T | Record<string, string> {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}

function getAvatarBasicProps(hasTitle: boolean, hasParagraph: boolean): SkeletonAvatarProps {
  if (hasTitle && !hasParagraph) {
    // Square avatar
    return { size: 'large', shape: 'square' };
  }

  return { size: 'large', shape: 'circle' };
}

function getTitleBasicProps(hasAvatar: boolean, hasParagraph: boolean): SkeletonTitleProps {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' };
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' };
  }

  return {};
}

function getParagraphBasicProps(hasAvatar: boolean, hasTitle: boolean): SkeletonParagraphProps {
  const basicProps: SkeletonParagraphProps = {};

  // Width
  if (!hasAvatar || !hasTitle) {
    basicProps.width = '61%';
  }

  // Rows
  if (!hasAvatar && hasTitle) {
    basicProps.rows = 3;
  } else {
    basicProps.rows = 2;
  }

  return basicProps;
}

type CompoundedComponent = {
  Button: typeof SkeletonButton;
  Avatar: typeof SkeletonAvatar;
  Input: typeof SkeletonInput;
  Image: typeof SkeletonImage;
  Node: typeof SkeletonNode;
};

// Tips: ctx.classNames.root < ctx.className < cpns.classNames.root < cpns.className < rootClassName

const Skeleton: React.FC<SkeletonProps> & CompoundedComponent = (props) => {
  const {
    prefixCls: customizePrefixCls,
    loading,
    className,
    rootClassName,
    classNames: skeletonClassNames,
    style,
    styles,
    children,
    avatar = false,
    title = true,
    paragraph = true,
    active,
    round,
  } = props;

  const {
    getPrefixCls,
    direction,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles,
  } = useComponentConfig('skeleton');
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  if (loading || !('loading' in props)) {
    const hasAvatar = !!avatar;
    const hasTitle = !!title;
    const hasParagraph = !!paragraph;

    // Avatar
    let avatarNode: React.ReactNode;
    if (hasAvatar) {
      const avatarProps: SkeletonAvatarProps = {
        className: classNames(contextClassNames.avatar, skeletonClassNames?.avatar),
        prefixCls: `${prefixCls}-avatar`,
        ...getAvatarBasicProps(hasTitle, hasParagraph),
        ...getComponentProps(avatar),
        style: { ...contextStyles?.avatar, ...styles?.avatar },
      };
      // We direct use SkeletonElement as avatar in skeleton internal.
      avatarNode = (
        <div
          className={classNames(
            contextClassNames?.header,
            skeletonClassNames?.header,
            `${prefixCls}-header`,
          )}
          style={{ ...contextStyles?.header, ...styles?.header }}
        >
          <Element {...avatarProps} />
        </div>
      );
    }

    let contentNode: React.ReactNode;
    if (hasTitle || hasParagraph) {
      // Title
      let $title: React.ReactNode;
      if (hasTitle) {
        const titleProps: SkeletonTitleProps = {
          className: classNames(contextClassNames?.title, skeletonClassNames?.title),
          prefixCls: `${prefixCls}-title`,
          ...getTitleBasicProps(hasAvatar, hasParagraph),
          ...getComponentProps(title),
          style: { ...contextStyles?.title, ...styles?.title },
        };

        $title = <Title {...titleProps} />;
      }

      // Paragraph
      let paragraphNode: React.ReactNode;
      if (hasParagraph) {
        const paragraphProps: SkeletonParagraphProps = {
          className: classNames(contextClassNames?.paragraph, skeletonClassNames?.paragraph),
          prefixCls: `${prefixCls}-paragraph`,
          ...getParagraphBasicProps(hasAvatar, hasTitle),
          ...getComponentProps(paragraph),
          style: { ...contextStyles?.paragraph, ...styles?.paragraph },
        };

        paragraphNode = <Paragraph {...paragraphProps} />;
      }

      contentNode = (
        <div
          className={classNames(
            contextClassNames?.section,
            skeletonClassNames?.section,
            `${prefixCls}-section`,
          )}
          style={{ ...contextStyles?.section, ...styles?.section }}
        >
          {$title}
          {paragraphNode}
        </div>
      );
    }

    const cls = classNames(
      prefixCls,
      {
        [`${prefixCls}-with-avatar`]: hasAvatar,
        [`${prefixCls}-active`]: active,
        [`${prefixCls}-rtl`]: direction === 'rtl',
        [`${prefixCls}-round`]: round,
      },
      contextClassNames?.root,
      skeletonClassNames?.root,
      contextClassName,
      className,
      rootClassName,
      hashId,
      cssVarCls,
    );

    return wrapCSSVar(
      <div
        className={cls}
        style={{ ...contextStyles?.root, ...contextStyle, ...styles?.root, ...style }}
      >
        {avatarNode}
        {contentNode}
      </div>,
    );
  }
  return children ?? null;
};

Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Node = SkeletonNode;

if (process.env.NODE_ENV !== 'production') {
  Skeleton.displayName = 'Skeleton';
}

export default Skeleton;
