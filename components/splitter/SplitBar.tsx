import React, { ReactElement, useMemo, useState } from 'react';
import DownOutlined from '@ant-design/icons/DownOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import UpOutlined from '@ant-design/icons/UpOutlined';
import classNames from 'classnames';
import useEvent from 'rc-util/lib/hooks/useEvent';

import { SplitterProps } from './interface';

export interface SplitBarProps {
  index: number;
  active: boolean;
  prefixCls: string;
  resizable: boolean;
  startCollapsible: boolean;
  endCollapsible: boolean;
  draggerIcon?: SplitterProps['draggerIcon'];
  collapsibleIcon?: SplitterProps['collapsibleIcon'];
  onOffsetStart: (index: number) => void;
  onOffsetUpdate: (index: number, offsetX: number, offsetY: number) => void;
  onOffsetEnd: VoidFunction;
  onCollapse: (index: number, type: 'start' | 'end') => void;
  vertical: boolean;
  ariaNow: number;
  ariaMin: number;
  ariaMax: number;
  lazy?: boolean;
  containerSize: number;
}

function getValidNumber(num: number | undefined): number {
  return typeof num === 'number' && !Number.isNaN(num) ? Math.round(num) : 0;
}

const SplitBar: React.FC<SplitBarProps> = (props) => {
  const {
    prefixCls,
    vertical,
    index,
    active,
    ariaNow,
    ariaMin,
    ariaMax,
    resizable,
    draggerIcon,
    collapsibleIcon,
    startCollapsible,
    endCollapsible,
    onOffsetStart,
    onOffsetUpdate,
    onOffsetEnd,
    onCollapse,
    lazy,
    containerSize,
  } = props;

  const splitBarPrefixCls = `${prefixCls}-bar`;

  // ======================== Resize ========================
  const [startPos, setStartPos] = useState<[x: number, y: number] | null>(null);
  const [constrainedOffset, setConstrainedOffset] = useState<number>(0);

  const constrainedOffsetX = vertical ? 0 : constrainedOffset;
  const constrainedOffsetY = vertical ? constrainedOffset : 0;

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (resizable && e.currentTarget) {
      setStartPos([e.pageX, e.pageY]);
      onOffsetStart(index);
    }
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (resizable && e.touches.length === 1) {
      const touch = e.touches[0];
      setStartPos([touch.pageX, touch.pageY]);
      onOffsetStart(index);
    }
  };

  // Updated constraint calculation
  const getConstrainedOffset = (rawOffset: number) => {
    const currentPos = (containerSize * ariaNow) / 100;
    const newPos = currentPos + rawOffset;

    // Calculate available space
    const minAllowed = Math.max(0, (containerSize * ariaMin) / 100);
    const maxAllowed = Math.min(containerSize, (containerSize * ariaMax) / 100);

    // Constrain new position within bounds
    const clampedPos = Math.max(minAllowed, Math.min(maxAllowed, newPos));
    return clampedPos - currentPos;
  };

  const handleLazyMove = useEvent((offsetX: number, offsetY: number) => {
    const constrainedOffsetValue = getConstrainedOffset(vertical ? offsetY : offsetX);
    setConstrainedOffset(constrainedOffsetValue);
  });

  const handleLazyEnd = useEvent(() => {
    onOffsetUpdate(index, constrainedOffsetX, constrainedOffsetY);
    setConstrainedOffset(0);
  });

  React.useEffect(() => {
    if (startPos) {
      const onMouseMove = (e: MouseEvent) => {
        const { pageX, pageY } = e;
        const offsetX = pageX - startPos[0];
        const offsetY = pageY - startPos[1];

        if (lazy) {
          handleLazyMove(offsetX, offsetY);
        } else {
          onOffsetUpdate(index, offsetX, offsetY);
        }
      };

      const onMouseUp = () => {
        if (lazy) {
          handleLazyEnd();
        }
        setStartPos(null);
        onOffsetEnd();
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const offsetX = touch.pageX - startPos[0];
          const offsetY = touch.pageY - startPos[1];

          if (lazy) {
            handleLazyMove(offsetX, offsetY);
          } else {
            onOffsetUpdate(index, offsetX, offsetY);
          }
        }
      };

      const handleTouchEnd = () => {
        if (lazy) {
          handleLazyEnd();
        }
        setStartPos(null);
        onOffsetEnd();
      };

      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [startPos, lazy, vertical, index, containerSize, ariaNow, ariaMin, ariaMax]);

  const transformStyle = {
    [`--${splitBarPrefixCls}-preview-offset`]: `${constrainedOffset}px`,
  };

  // ======================== Render ========================
  const [startIcon, endIcon, startCustomize, endCustomize] = useMemo(() => {
    let startIcon = null;
    let endIcon = null;
    const startCustomize = !!collapsibleIcon?.start;
    const endCustomize = !!collapsibleIcon?.end;

    if (vertical) {
      startIcon = startCustomize ? collapsibleIcon.start : <UpOutlined />;
      endIcon = endCustomize ? collapsibleIcon.end : <DownOutlined />;
    } else {
      startIcon = startCustomize ? collapsibleIcon.start : <LeftOutlined />;
      endIcon = endCustomize ? collapsibleIcon.end : <RightOutlined />;
    }

    return [startIcon, endIcon, startCustomize, endCustomize];
  }, [collapsibleIcon, vertical]);

  return (
    <div
      className={splitBarPrefixCls}
      role="separator"
      aria-valuenow={getValidNumber(ariaNow)}
      aria-valuemin={getValidNumber(ariaMin)}
      aria-valuemax={getValidNumber(ariaMax)}
    >
      {lazy && (
        <div
          className={classNames(`${splitBarPrefixCls}-preview`, {
            [`${splitBarPrefixCls}-preview-active`]: !!constrainedOffset,
          })}
          style={transformStyle}
        />
      )}

      <div
        className={classNames(`${splitBarPrefixCls}-dragger`, {
          [`${splitBarPrefixCls}-dragger-disabled`]: !resizable,
          [`${splitBarPrefixCls}-dragger-active`]: active,
          [`${splitBarPrefixCls}-dragger-customize`]: !!draggerIcon,
        })}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {draggerIcon ? (
          <div className={classNames(`${splitBarPrefixCls}-dragger-icon-wrapper`)}>
            {active ? draggerIcon.active : draggerIcon.default}
          </div>
        ) : null}
      </div>

      {/* Start Collapsible */}
      {startCollapsible && (
        <div
          className={classNames(
            `${splitBarPrefixCls}-collapse-bar`,
            `${splitBarPrefixCls}-collapse-bar-start`,
            {
              [`${splitBarPrefixCls}-collapse-bar-customize`]: startCustomize,
            },
          )}
          onClick={() => onCollapse(index, 'start')}
        >
          {React.isValidElement(startIcon)
            ? React.cloneElement(startIcon as ReactElement<{ className: string }>, {
                className: classNames(
                  `${splitBarPrefixCls}-collapse-icon`,
                  `${splitBarPrefixCls}-collapse-start`,
                  (startIcon as ReactElement<{ className: string }>).props.className,
                ),
              })
            : startIcon}
        </div>
      )}

      {/* End Collapsible */}
      {endCollapsible && (
        <div
          className={classNames(
            `${splitBarPrefixCls}-collapse-bar`,
            `${splitBarPrefixCls}-collapse-bar-end`,
            {
              [`${splitBarPrefixCls}-collapse-bar-customize`]: endCustomize,
            },
          )}
          onClick={() => onCollapse(index, 'end')}
        >
          {React.isValidElement(endIcon)
            ? React.cloneElement(endIcon as ReactElement<{ className: string }>, {
                className: classNames(
                  `${splitBarPrefixCls}-collapse-icon`,
                  `${splitBarPrefixCls}-collapse-end`,
                  (endIcon as ReactElement<{ className: string }>).props.className,
                ),
              })
            : endIcon}
        </div>
      )}
    </div>
  );
};

export default SplitBar;
