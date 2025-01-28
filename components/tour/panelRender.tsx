import type { ReactNode } from 'react';
import React from 'react';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import classNames from 'classnames';

import type { ButtonProps } from '../button';
import Button from '../button';
import { useLocale } from '../locale';
import defaultLocale from '../locale/en_US';
import type { SemanticName, TourStepProps } from './interface';
import TourContext from './TourContext';

function isValidNode(node: ReactNode): boolean {
  return node !== undefined && node !== null;
}

interface TourPanelProps {
  stepProps: Omit<TourStepProps, 'closable'> & {
    closable?: Exclude<TourStepProps['closable'], boolean>;
  };
  current: number;
  type: TourStepProps['type'];
  indicatorsRender?: TourStepProps['indicatorsRender'];
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
}

// Due to the independent design of Panel, it will be too coupled to put in rc-tour,
// so a set of Panel logic is implemented separately in antd.
const TourPanel: React.FC<TourPanelProps> = (props) => {
  const { stepProps, current, type, indicatorsRender } = props;
  const {
    prefixCls,
    total = 1,
    title,
    onClose,
    onPrev,
    onNext,
    onFinish,
    cover,
    description,
    nextButtonProps,
    prevButtonProps,
    type: stepType,
    closable,
  } = stepProps;

  const tourContext = React.useContext(TourContext);
  const { classNames: tourClassNames, styles } = tourContext;

  const mergedType = stepType ?? type;

  const mergedCloseIcon = (
    <button type="button" onClick={onClose} className={`${prefixCls}-close`}>
      {closable?.closeIcon || <CloseOutlined className={`${prefixCls}-close-icon`} />}
    </button>
  );

  const isLastStep = current === total - 1;

  const prevBtnClick = () => {
    onPrev?.();
    prevButtonProps?.onClick?.();
  };

  const nextBtnClick = () => {
    if (isLastStep) {
      onFinish?.();
    } else {
      onNext?.();
    }
    nextButtonProps?.onClick?.();
  };

  const headerNode = isValidNode(title) ? (
    <div
      className={classNames(`${prefixCls}-header`, tourClassNames?.header)}
      style={styles?.header}
    >
      <div
        className={classNames(`${prefixCls}-title`, tourClassNames?.title)}
        style={styles?.title}
      >
        {title}
      </div>
    </div>
  ) : null;

  const descriptionNode = isValidNode(description) ? (
    <div
      className={classNames(`${prefixCls}-description`, tourClassNames?.description)}
      style={styles?.description}
    >
      {description}
    </div>
  ) : null;

  const coverNode = isValidNode(cover) ? (
    <div className={classNames(`${prefixCls}-cover`, tourClassNames?.cover)} style={styles?.cover}>
      {cover}
    </div>
  ) : null;

  let mergedIndicatorNode: ReactNode;

  if (indicatorsRender) {
    mergedIndicatorNode = indicatorsRender(current, total);
  } else {
    mergedIndicatorNode = [...Array.from({ length: total }).keys()].map<ReactNode>(
      (stepItem, index) => (
        <span
          key={stepItem}
          className={classNames(
            index === current && `${prefixCls}-indicator-active`,
            `${prefixCls}-indicator`,
            tourClassNames?.indicator,
          )}
          style={styles?.indicator}
        />
      ),
    );
  }

  const mainBtnType = mergedType === 'primary' ? 'default' : 'primary';

  const secondaryBtnProps: ButtonProps = {
    type: 'default',
    ghost: mergedType === 'primary',
  };

  const [contextLocale] = useLocale('Tour', defaultLocale.Tour);

  return (
    <div className={`${prefixCls}-pannel`}>
      <div
        className={classNames(`${prefixCls}-section`, tourClassNames?.section)}
        style={styles?.section}
      >
        {closable && mergedCloseIcon}
        {coverNode}
        {headerNode}
        {descriptionNode}
        <div
          className={classNames(`${prefixCls}-footer`, tourClassNames?.footer)}
          style={styles?.footer}
        >
          {total > 1 && <div className={`${prefixCls}-indicators`}>{mergedIndicatorNode}</div>}
          <div
            className={classNames(`${prefixCls}-actions`, tourClassNames?.actions)}
            style={styles?.actions}
          >
            {current !== 0 ? (
              <Button
                {...secondaryBtnProps}
                {...prevButtonProps}
                onClick={prevBtnClick}
                size="small"
                className={classNames(`${prefixCls}-prev-btn`, prevButtonProps?.className)}
              >
                {prevButtonProps?.children ?? contextLocale?.Previous}
              </Button>
            ) : null}
            <Button
              type={mainBtnType}
              {...nextButtonProps}
              onClick={nextBtnClick}
              size="small"
              className={classNames(`${prefixCls}-next-btn`, nextButtonProps?.className)}
            >
              {nextButtonProps?.children ??
                (isLastStep ? contextLocale?.Finish : contextLocale?.Next)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPanel;
