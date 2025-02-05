import React from 'react';

import Skeleton from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { render } from '../../../tests/utils';
import type { AvatarProps } from '../Avatar';
import type { SkeletonButtonProps } from '../Button';
import { ElementSemanticName } from '../Element';
import type { SkeletonImageProps } from '../Image';
import type { SkeletonInputProps } from '../Input';
import type { SkeletonNodeProps } from '../Node';
import type { SemanticName, SkeletonProps } from '../Skeleton';

describe('Skeleton', () => {
  const genSkeleton = (props: SkeletonProps) =>
    render(
      <Skeleton loading {...props}>
        Bamboo
      </Skeleton>,
    );
  const genSkeletonButton = (props: SkeletonButtonProps) => render(<Skeleton.Button {...props} />);
  const genSkeletonAvatar = (props: AvatarProps) => render(<Skeleton.Avatar {...props} />);
  const genSkeletonInput = (props: SkeletonInputProps) => render(<Skeleton.Input {...props} />);
  const genSkeletonImage = (props: SkeletonImageProps) => render(<Skeleton.Image {...props} />);
  const genSkeletonNode = (props: SkeletonNodeProps) => render(<Skeleton.Node {...props} />);

  mountTest(Skeleton);
  rtlTest(Skeleton);

  it('should without avatar and paragraph', () => {
    const { asFragment } = genSkeleton({ avatar: false, paragraph: false });
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should square avatar', () => {
    const { asFragment } = genSkeleton({ avatar: true, paragraph: false });
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should round title and paragraph', () => {
    const { asFragment } = genSkeleton({ round: true, title: true, paragraph: true });
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should display without children and falsy loading props', () => {
    const { asFragment } = render(<Skeleton loading={false} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should display with empty children and falsy loading props', () => {
    const { container } = render(<Skeleton loading={false}>{0}</Skeleton>);
    expect(container.textContent).toBe('0');
  });

  it('should display children', () => {
    const { container } = render(<Skeleton loading={false}>{[1, 2, 3]}</Skeleton>);
    expect(container.textContent).toBe('123');
  });

  describe('avatar', () => {
    it('size', () => {
      const { asFragment } = genSkeleton({ avatar: { size: 'small' } });
      expect(asFragment().firstChild).toMatchSnapshot();
      const { asFragment: wrapperDefault } = genSkeleton({ avatar: { size: 'default' } });
      expect(wrapperDefault().firstChild).toMatchSnapshot();
      const { asFragment: wrapperLarge } = genSkeleton({ avatar: { size: 'large' } });
      expect(wrapperLarge().firstChild).toMatchSnapshot();
      const { asFragment: wrapperNumber } = genSkeleton({ avatar: { size: 20 } });
      expect(wrapperNumber().firstChild).toMatchSnapshot();
    });

    it('shape', () => {
      const { asFragment: wrapperCircle } = genSkeleton({ avatar: { shape: 'circle' } });
      expect(wrapperCircle().firstChild).toMatchSnapshot();
      const { asFragment: wrapperSquare } = genSkeleton({ avatar: { shape: 'square' } });
      expect(wrapperSquare().firstChild).toMatchSnapshot();
    });
  });

  describe('title', () => {
    it('width', () => {
      const { asFragment } = genSkeleton({ title: { width: '93%' } });
      expect(asFragment().firstChild).toMatchSnapshot();
    });
  });

  describe('paragraph', () => {
    it('rows', () => {
      const { asFragment } = genSkeleton({ paragraph: { rows: 5 } });
      expect(asFragment().firstChild).toMatchSnapshot();
    });

    it('width', () => {
      const { asFragment: wrapperPure } = genSkeleton({ paragraph: { width: '93%' } });
      expect(wrapperPure().firstChild).toMatchSnapshot();
      const { asFragment: wrapperList } = genSkeleton({ paragraph: { width: ['28%', '93%'] } });
      expect(wrapperList().firstChild).toMatchSnapshot();
    });
  });

  describe('button element', () => {
    it('active', () => {
      const { asFragment } = genSkeletonButton({ active: true });
      expect(asFragment().firstChild).toMatchSnapshot();
    });
    it('block', () => {
      const { asFragment } = genSkeletonButton({ block: true });
      expect(asFragment().firstChild).toMatchSnapshot();
    });
    it('size', () => {
      const { asFragment: wrapperDefault } = genSkeletonButton({ size: 'default' });
      expect(wrapperDefault().firstChild).toMatchSnapshot();
      const { asFragment: wrapperLarge } = genSkeletonButton({ size: 'large' });
      expect(wrapperLarge().firstChild).toMatchSnapshot();
      const { asFragment } = genSkeletonButton({ size: 'small' });
      expect(asFragment().firstChild).toMatchSnapshot();
    });
    it('shape', () => {
      const { asFragment: wrapperDefault } = genSkeletonButton({ shape: 'default' });
      expect(wrapperDefault().firstChild).toMatchSnapshot();
      const { asFragment: wrapperRound } = genSkeletonButton({ shape: 'round' });
      expect(wrapperRound().firstChild).toMatchSnapshot();
      const { asFragment: wrapperCircle } = genSkeletonButton({ shape: 'circle' });
      expect(wrapperCircle().firstChild).toMatchSnapshot();
    });
  });

  describe('avatar element', () => {
    it('active', () => {
      const { asFragment } = genSkeletonAvatar({ active: true });
      expect(asFragment().firstChild).toMatchSnapshot();
    });
    it('size', () => {
      const { asFragment } = genSkeletonAvatar({ size: 'small' });
      expect(asFragment().firstChild).toMatchSnapshot();
      const { asFragment: wrapperDefault } = genSkeletonAvatar({ size: 'default' });
      expect(wrapperDefault().firstChild).toMatchSnapshot();
      const { asFragment: wrapperLarge } = genSkeletonAvatar({ size: 'large' });
      expect(wrapperLarge().firstChild).toMatchSnapshot();
      const { asFragment: wrapperNumber } = genSkeletonAvatar({ size: 20 });
      expect(wrapperNumber().firstChild).toMatchSnapshot();
    });

    it('shape', () => {
      const { asFragment: wrapperCircle } = genSkeletonAvatar({ shape: 'circle' });
      expect(wrapperCircle().firstChild).toMatchSnapshot();
      const { asFragment: wrapperSquare } = genSkeletonAvatar({ shape: 'square' });
      expect(wrapperSquare().firstChild).toMatchSnapshot();
    });
  });

  describe('input element', () => {
    it('active', () => {
      const { asFragment } = genSkeletonInput({ active: true });
      expect(asFragment().firstChild).toMatchSnapshot();
    });
    it('size', () => {
      const { asFragment } = genSkeletonInput({ size: 'small' });
      expect(asFragment().firstChild).toMatchSnapshot();
      const { asFragment: wrapperDefault } = genSkeletonInput({ size: 'default' });
      expect(wrapperDefault().firstChild).toMatchSnapshot();
      const { asFragment: wrapperLarge } = genSkeletonInput({ size: 'large' });
      expect(wrapperLarge().firstChild).toMatchSnapshot();
    });
  });

  describe('image element', () => {
    it('should render normal', () => {
      const { asFragment } = genSkeletonImage({});
      expect(asFragment().firstChild).toMatchSnapshot();
    });
  });

  describe('custom node element', () => {
    it('should render normal', () => {
      const { asFragment } = genSkeletonNode({});
      expect(asFragment().firstChild).toMatchSnapshot();
      const { asFragment: asFragmentNode } = genSkeletonNode({
        children: <span>Custom Content Node</span>,
      });
      expect(asFragmentNode().firstChild).toMatchSnapshot();
    });
  });

  it('should support style', () => {
    const { asFragment } = genSkeleton({ style: { background: 'blue' } });
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('Skeleton should apply custom styles to semantic elements', () => {
    const rootStyle = { background: 'pink' };
    const headerStyle = { background: 'green' };
    const sectionStyle = { background: 'yellow' };
    const avatarStyle = { background: 'blue' };
    const titleStyle = { background: 'red' };
    const paragraphStyle = { background: 'orange' };

    const customStyles: Record<SemanticName, React.CSSProperties> = {
      root: rootStyle,
      header: headerStyle,
      section: sectionStyle,
      avatar: avatarStyle,
      title: titleStyle,
      paragraph: paragraphStyle,
    };

    const customClassNames: Record<SemanticName, string> = {
      root: 'custom-root',
      header: 'custom-header',
      section: 'custom-section',
      avatar: 'custom-avatar',
      title: 'custom-title',
      paragraph: 'custom-paragraph',
    };

    const { container } = genSkeleton({
      styles: customStyles,
      classNames: customClassNames,
      avatar: true,
    });

    const rootElement = container.querySelector('.ant-skeleton');
    expect(rootElement).toHaveStyle(rootStyle);
    expect(rootElement).toHaveClass(customClassNames.root);

    const headerElement = container.querySelector('.ant-skeleton-header');
    expect(headerElement).toHaveStyle(headerStyle);
    expect(headerElement).toHaveClass(customClassNames.header);

    const sectionElement = container.querySelector('.ant-skeleton-section');
    expect(sectionElement).toHaveStyle(sectionStyle);
    expect(sectionElement).toHaveClass(customClassNames.section);

    const avatarElement = container.querySelector('.ant-skeleton-avatar');
    expect(avatarElement).toHaveStyle(avatarStyle);
    expect(avatarElement).toHaveClass(customClassNames.avatar);

    const titleElement = container.querySelector('.ant-skeleton-title');
    expect(titleElement).toHaveStyle(titleStyle);
    expect(titleElement).toHaveClass(customClassNames.title);

    const paragraphElement = container.querySelector('.ant-skeleton-paragraph');
    expect(paragraphElement).toHaveStyle(paragraphStyle);
    expect(paragraphElement).toHaveClass(customClassNames.paragraph);
  });

  it('Elements should apply custom styles to semantic elements', () => {
    const elements = ['avatar', 'button', 'input', 'node', 'image'] as const;
    const rootStyle = { background: 'pink' };
    const elementStyle = { background: 'green' };

    type Elements = (typeof elements)[number];
    type SemanticRecord<T> = Partial<Record<Elements, Record<ElementSemanticName, T>>>;

    const customStyles: SemanticRecord<React.CSSProperties> = elements.reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: {
          root: rootStyle,
          content: elementStyle,
        },
      }),
      {},
    );

    const customClassNames: SemanticRecord<string> = elements.reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: {
          root: 'custom-root',
          content: `custom-${cur}`,
        },
      }),
      {},
    );

    const { container: avatarContainer } = genSkeletonAvatar({
      styles: customStyles.avatar,
      classNames: customClassNames.avatar,
    });

    const avatarRootElement = avatarContainer.querySelector('.ant-skeleton');
    expect(avatarRootElement).toHaveStyle(rootStyle);
    expect(avatarRootElement).toHaveClass(customClassNames.avatar!.root);

    const avatarElement = avatarContainer.querySelector('.ant-skeleton-avatar');
    expect(avatarElement).toHaveStyle(elementStyle);
    expect(avatarElement).toHaveClass(customClassNames.avatar!.content);

    const { container: buttonContainer } = genSkeletonButton({
      styles: customStyles.button,
      classNames: customClassNames.button,
    });

    const buttonRootElement = buttonContainer.querySelector('.ant-skeleton');
    expect(buttonRootElement).toHaveStyle(rootStyle);
    expect(buttonRootElement).toHaveClass(customClassNames.button!.root);

    const buttonElement = buttonContainer.querySelector('.ant-skeleton-button');
    expect(buttonElement).toHaveStyle(elementStyle);
    expect(buttonElement).toHaveClass(customClassNames.button!.content);

    const { container: inputContainer } = genSkeletonInput({
      styles: customStyles.input,
      classNames: customClassNames.input,
    });

    const inputRootElement = inputContainer.querySelector('.ant-skeleton');
    expect(inputRootElement).toHaveStyle(rootStyle);
    expect(inputRootElement).toHaveClass(customClassNames.input!.root);

    const inputElement = inputContainer.querySelector('.ant-skeleton-input');
    expect(inputElement).toHaveStyle(elementStyle);
    expect(inputElement).toHaveClass(customClassNames.input!.content);

    const { container: nodeContainer } = genSkeletonNode({
      styles: customStyles.node,
      classNames: customClassNames.node,
    });

    const nodeRootElement = nodeContainer.querySelector('.ant-skeleton');
    expect(nodeRootElement).toHaveStyle(rootStyle);
    expect(nodeRootElement).toHaveClass(customClassNames.node!.root);

    const nodeElement = nodeContainer.querySelector('.ant-skeleton-node');
    expect(nodeElement).toHaveStyle(elementStyle);
    expect(nodeElement).toHaveClass(customClassNames.node!.content);

    // Image is a derived component of node
    const { container: imageContainer } = genSkeletonImage({
      styles: customStyles.node,
      classNames: customClassNames.node,
    });

    const imageRootElement = imageContainer.querySelector('.ant-skeleton');
    expect(imageRootElement).toHaveStyle(rootStyle);
    expect(imageRootElement).toHaveClass(customClassNames.node!.root);

    const imageElement = imageContainer.querySelector('.ant-skeleton-node');
    expect(imageElement).toHaveStyle(elementStyle);
    expect(imageElement).toHaveClass(customClassNames.node!.content);
  });
});
