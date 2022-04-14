import * as React from 'react';
import classNames from 'classnames';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import RCPicker from 'rc-picker';
import { PickerMode } from 'rc-picker/lib/interface';
import { GenerateConfig } from 'rc-picker/lib/generate/index';
import { forwardRef, useContext } from 'react';
import enUS from '../locale/en_US';
import { getPlaceholder, transPlacement2DropdownAlign } from '../util';
import devWarning from '../../_util/devWarning';
import { ConfigContext, ConfigConsumerProps } from '../../config-provider';
import LocaleReceiver from '../../locale-provider/LocaleReceiver';
import SizeContext from '../../config-provider/SizeContext';
import {
  PickerProps,
  PickerLocale,
  PickerDateProps,
  PickerTimeProps,
  getTimeProps,
  Components,
} from '.';
import { FormItemInputContext } from '../../form/context';
import { getMergedStatus, getStatusClassNames, InputStatus } from '../../_util/statusUtils';
import useStyle from '../style';

export default function generatePicker<DateType>(generateConfig: GenerateConfig<DateType>) {
  type DatePickerProps = PickerProps<DateType> & {
    status?: InputStatus;
  };

  function getPicker<InnerPickerProps extends DatePickerProps>(
    picker?: PickerMode,
    displayName?: string,
  ) {
    type InternalPickerProps = InnerPickerProps & { hashId?: string };

    class Picker extends React.Component<InternalPickerProps> {
      static contextType = ConfigContext;

      static displayName: string;

      context: ConfigConsumerProps;

      pickerRef = React.createRef<RCPicker<DateType>>();

      constructor(props: InnerPickerProps) {
        super(props);
        devWarning(
          picker !== 'quarter',
          displayName!,
          `DatePicker.${displayName} is legacy usage. Please use DatePicker[picker='${picker}'] directly.`,
        );
      }

      focus = () => {
        if (this.pickerRef.current) {
          this.pickerRef.current.focus();
        }
      };

      blur = () => {
        if (this.pickerRef.current) {
          this.pickerRef.current.blur();
        }
      };

      renderPicker = (contextLocale: PickerLocale) => {
        const locale = { ...contextLocale, ...this.props.locale };
        const { getPrefixCls, direction, getPopupContainer } = this.context;
        const {
          prefixCls: customizePrefixCls,
          getPopupContainer: customizeGetPopupContainer,
          className,
          size: customizeSize,
          bordered = true,
          placement,
          placeholder,
          status: customStatus,
          dropdownClassName,
          hashId,
          ...restProps
        } = this.props;
        const { format, showTime } = this.props as any;
        const prefixCls = getPrefixCls('picker', customizePrefixCls);

        const additionalProps = {
          showToday: true,
        };

        let additionalOverrideProps: any = {};
        if (picker) {
          additionalOverrideProps.picker = picker;
        }
        const mergedPicker = picker || this.props.picker;

        additionalOverrideProps = {
          ...additionalOverrideProps,
          ...(showTime ? getTimeProps({ format, picker: mergedPicker, ...showTime }) : {}),
          ...(mergedPicker === 'time'
            ? getTimeProps({ format, ...this.props, picker: mergedPicker })
            : {}),
        };
        const rootPrefixCls = getPrefixCls();

        return (
          <SizeContext.Consumer>
            {size => {
              const mergedSize = customizeSize || size;

              return (
                <FormItemInputContext.Consumer>
                  {({ hasFeedback, status: contextStatus, feedbackIcon }) => {
                    const suffixNode = (
                      <>
                        {mergedPicker === 'time' ? <ClockCircleOutlined /> : <CalendarOutlined />}
                        {hasFeedback && feedbackIcon}
                      </>
                    );

                    return (
                      <RCPicker<DateType>
                        ref={this.pickerRef}
                        placeholder={getPlaceholder(mergedPicker, locale, placeholder)}
                        suffixIcon={suffixNode}
                        dropdownAlign={transPlacement2DropdownAlign(direction, placement)}
                        clearIcon={<CloseCircleFilled />}
                        prevIcon={<span className={`${prefixCls}-prev-icon`} />}
                        nextIcon={<span className={`${prefixCls}-next-icon`} />}
                        superPrevIcon={<span className={`${prefixCls}-super-prev-icon`} />}
                        superNextIcon={<span className={`${prefixCls}-super-next-icon`} />}
                        allowClear
                        transitionName={`${rootPrefixCls}-slide-up`}
                        {...additionalProps}
                        {...restProps}
                        {...additionalOverrideProps}
                        locale={locale!.lang}
                        className={classNames(
                          {
                            [`${prefixCls}-${mergedSize}`]: mergedSize,
                            [`${prefixCls}-borderless`]: !bordered,
                          },
                          getStatusClassNames(
                            prefixCls,
                            getMergedStatus(contextStatus, customStatus),
                            hasFeedback,
                          ),
                          hashId,
                          className,
                        )}
                        prefixCls={prefixCls}
                        getPopupContainer={customizeGetPopupContainer || getPopupContainer}
                        generateConfig={generateConfig}
                        components={Components}
                        direction={direction}
                        dropdownClassName={classNames(hashId, dropdownClassName)}
                      />
                    );
                  }}
                </FormItemInputContext.Consumer>
              );
            }}
          </SizeContext.Consumer>
        );
      };

      render() {
        return (
          <LocaleReceiver componentName="DatePicker" defaultLocale={enUS}>
            {this.renderPicker}
          </LocaleReceiver>
        );
      }
    }

    const PickerWrapper = forwardRef<Picker, InnerPickerProps>((props, ref) => {
      const { prefixCls: customizePrefixCls, ...rest } = props;

      const { getPrefixCls } = useContext(ConfigContext);
      const prefixCls = getPrefixCls('picker', customizePrefixCls);
      const [wrapSSR, hashId] = useStyle(prefixCls);

      // @ts-ignore
      return wrapSSR(<Picker {...rest} prefixCls={prefixCls} ref={ref} hashId={hashId} />);
    });

    if (displayName) {
      PickerWrapper.displayName = displayName;
    }

    return PickerWrapper;
  }

  const DatePicker = getPicker<DatePickerProps>();
  const WeekPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('week', 'WeekPicker');
  const MonthPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('month', 'MonthPicker');
  const YearPicker = getPicker<Omit<PickerDateProps<DateType>, 'picker'>>('year', 'YearPicker');
  const TimePicker = getPicker<Omit<PickerTimeProps<DateType>, 'picker'>>('time', 'TimePicker');
  const QuarterPicker = getPicker<Omit<PickerTimeProps<DateType>, 'picker'>>(
    'quarter',
    'QuarterPicker',
  );

  return { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker };
}
