import classNames from 'classnames';
import type { SliderProps as RcSliderProps } from 'rc-slider';
import RcSlider from 'rc-slider';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import type { TooltipPlacement } from '../tooltip';
import SliderTooltip from './SliderTooltip';

import useStyle from './style';

export type SliderMarks = RcSliderProps['marks'];

interface HandleGeneratorInfo {
  value?: number;
  dragging?: boolean;
  index: number;
}

export type HandleGeneratorFn = (config: {
  tooltipPrefixCls?: string;
  prefixCls?: string;
  info: HandleGeneratorInfo;
}) => React.ReactElement;

export interface SliderTooltipProps {
  prefixCls?: string;
  open?: boolean;
  placement?: TooltipPlacement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  formatter?: null | ((value?: number) => React.ReactNode);
}

export interface SliderBaseProps {
  prefixCls?: string;
  reverse?: boolean;
  min?: number;
  max?: number;
  step?: null | number;
  marks?: SliderMarks;
  dots?: boolean;
  included?: boolean;
  disabled?: boolean;
  vertical?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  tooltip?: boolean | SliderTooltipProps;
  autoFocus?: boolean;
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onAfterChange?: (value: number) => void;
  handleStyle?: React.CSSProperties;
  trackStyle?: React.CSSProperties;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true | SliderRange;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onAfterChange?: (value: [number, number]) => void;
  handleStyle?: React.CSSProperties[];
  trackStyle?: React.CSSProperties[];
}

interface SliderRange {
  draggableTrack?: boolean;
}

export type Opens = { [index: number]: boolean };

const Slider = React.forwardRef<unknown, SliderSingleProps | SliderRangeProps>(
  (props, ref: any) => {
    const { getPrefixCls, direction, getPopupContainer } = React.useContext(ConfigContext);
    const [opens, setOpens] = React.useState<Opens>({});

    const toggleTooltipOpen = (index: number, visible: boolean) => {
      setOpens((prev: Opens) => ({ ...prev, [index]: visible }));
    };

    const getTooltipPlacement = (tooltipPlacement?: TooltipPlacement, vertical?: boolean) => {
      if (tooltipPlacement) {
        return tooltipPlacement;
      }
      if (!vertical) {
        return 'top';
      }
      return direction === 'rtl' ? 'left' : 'right';
    };

    const { prefixCls: customizePrefixCls, range, className, ...restProps } = props;
    const prefixCls = getPrefixCls('slider', customizePrefixCls);

    const [wrapSSR, hashId] = useStyle(prefixCls);

    const cls = classNames(
      className,
      {
        [`${prefixCls}-rtl`]: direction === 'rtl',
      },
      hashId,
    );

    // make reverse default on rtl direction
    if (direction === 'rtl' && !restProps.vertical) {
      restProps.reverse = !restProps.reverse;
    }

    // Range config
    const [mergedRange, draggableTrack] = React.useMemo(() => {
      if (!range) {
        return [false];
      }

      return typeof range === 'object' ? [true, range.draggableTrack] : [true, false];
    }, [range]);

    const handleRender: RcSliderProps['handleRender'] = (node, info) => {
      const { index, dragging } = info;

      const rootPrefixCls = getPrefixCls();
      const { tooltip, vertical } = props;

      let tooltipProps: SliderTooltipProps = {
        formatter(value) {
          return typeof value === 'number' ? value.toString() : '';
        },
      };
      if (typeof tooltip === 'boolean') {
        tooltipProps.open = tooltip;
      } else if (typeof tooltip === 'object') {
        tooltipProps = { ...tooltipProps, ...tooltip };
      }
      const {
        open: tooltipOpen,
        placement: tooltipPlacement,
        getPopupContainer: getTooltipPopupContainer,
        prefixCls: customizeTooltipPrefixCls,
        formatter: tipFormatter,
      } = tooltipProps;

      const isTipFormatter = tipFormatter ? opens[index] || dragging : false;
      const open = tooltipOpen || (tooltipOpen === undefined && isTipFormatter);

      const passedProps = {
        ...node.props,
        onMouseEnter: () => toggleTooltipOpen(index, true),
        onMouseLeave: () => toggleTooltipOpen(index, false),
      };

      const tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);

      return (
        <SliderTooltip
          prefixCls={tooltipPrefixCls}
          title={tipFormatter ? tipFormatter(info.value) : ''}
          visible={open}
          placement={getTooltipPlacement(tooltipPlacement, vertical)}
          transitionName={`${rootPrefixCls}-zoom-down`}
          key={index}
          overlayClassName={`${prefixCls}-tooltip`}
          getPopupContainer={getTooltipPopupContainer || getPopupContainer}
        >
          {React.cloneElement(node, passedProps)}
        </SliderTooltip>
      );
    };

    return wrapSSR(
      <RcSlider
        {...(restProps as SliderRangeProps)}
        step={restProps.step!}
        range={mergedRange}
        draggableTrack={draggableTrack}
        className={cls}
        ref={ref}
        prefixCls={prefixCls}
        handleRender={handleRender}
      />,
    );
  },
);

if (process.env.NODE_ENV !== 'production') {
  Slider.displayName = 'Slider';
}

export default Slider;
