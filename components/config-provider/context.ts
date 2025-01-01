import * as React from 'react';

import type { WarningContextProps } from '../_util/warning';
import type { ShowWaveEffect } from '../_util/wave/interface';
import type { AlertProps } from '../alert';
import type { BadgeProps } from '../badge';
import type { ButtonProps } from '../button';
import type { CardProps } from '../card';
import type { CascaderProps } from '../cascader';
import type { CollapseProps } from '../collapse';
import type { DatePickerProps, RangePickerProps } from '../date-picker';
import type { DrawerProps } from '../drawer';
import type { FlexProps } from '../flex/interface';
import type { FloatButtonGroupProps } from '../float-button/interface';
import type { FormProps } from '../form/Form';
import type { InputProps, TextAreaProps } from '../input';
import type { InputNumberProps } from '../input-number';
import type { ListItemProps } from '../list';
import type { Locale } from '../locale';
import type { MentionsProps } from '../mentions';
import type { MenuProps } from '../menu';
import type { ModalProps } from '../modal';
import type { ArgsProps } from '../notification/interface';
import type { PaginationProps } from '../pagination';
import type { SelectProps } from '../select';
import type { SpaceProps } from '../space';
import type { SpinProps } from '../spin';
import type { TableProps } from '../table';
import type { TabsProps } from '../tabs';
import type { TagProps } from '../tag';
import type { AliasToken, MappingAlgorithm, OverrideToken } from '../theme/interface';
import type { TimePickerProps } from '../time-picker';
import type { TourProps } from '../tour/interface';
import type { TransferProps } from '../transfer';
import type { TreeSelectProps } from '../tree-select';
import type { RenderEmptyHandler } from './defaultRenderEmpty';
import type { TooltipProps } from '../tooltip';
import type { PopoverProps } from '../popover';
import type { PopconfirmProps } from '../popconfirm';
import type { QRCodeProps } from '../qr-code';

export const defaultPrefixCls = 'ant';
export const defaultIconPrefixCls = 'anticon';

export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

export interface CSPConfig {
  nonce?: string;
}

export type DirectionType = 'ltr' | 'rtl' | undefined;

type ComponentsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
  };
};

export interface ThemeConfig {
  /**
   * @descCN 用于修改 Design Token。
   * @descEN Modify Design Token.
   */
  token?: Partial<AliasToken>;
  /**
   * @descCN 用于修改各个组件的 Component Token 以及覆盖该组件消费的 Alias Token。
   * @descEN Modify Component Token and Alias Token applied to components.
   */
  components?: ComponentsConfig;
  /**
   * @descCN 用于修改 Seed Token 到 Map Token 的算法。
   * @descEN Modify the algorithms of theme.
   * @default defaultAlgorithm
   */
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  /**
   * @descCN 是否继承外层 `ConfigProvider` 中配置的主题。
   * @descEN Whether to inherit the theme configured in the outer layer `ConfigProvider`.
   * @default true
   */
  inherit?: boolean;
  /**
   * @descCN 是否开启 `hashed` 属性。如果你的应用中只存在一个版本的 antd，你可以设置为 `false` 来进一步减小样式体积。
   * @descEN Whether to enable the `hashed` attribute. If there is only one version of antd in your application, you can set `false` to reduce the bundle size.
   * @default true
   * @since 5.0.0
   */
  hashed?: boolean;
  /**
   * @descCN 通过 `cssVar` 配置来开启 CSS 变量模式，这个配置会被继承。
   * @descEN Enable CSS variable mode through `cssVar` configuration, This configuration will be inherited.
   * @default false
   * @since 5.12.0
   */
  cssVar?:
    | {
        /**
         * @descCN css 变量的前缀
         * @descEN Prefix for css variable.
         * @default ant
         */
        prefix?: string;
        /**
         * @descCN 主题的唯一 key，版本低于 react@18 时需要手动设置。
         * @descEN Unique key for theme, should be set manually < react@18.
         */
        key?: string;
      }
    | boolean;
}

export interface ComponentStyleConfig {
  className?: string;
  style?: React.CSSProperties;
}

export interface TableConfig extends ComponentStyleConfig {
  expandable?: {
    expandIcon?: NonNullable<TableProps['expandable']>['expandIcon'];
  };
}

export interface ImageConfig extends ComponentStyleConfig {
  preview?: Partial<Record<'closeIcon', React.ReactNode>>;
}

export type CollapseConfig = ComponentStyleConfig & Pick<CollapseProps, 'expandIcon'>;

export type MenuConfig = ComponentStyleConfig & Pick<MenuProps, 'expandIcon'>;

export type TourConfig = Pick<TourProps, 'closeIcon'>;

export type ModalConfig = ComponentStyleConfig &
  Pick<ModalProps, 'classNames' | 'styles' | 'closeIcon' | 'closable'>;

export type TabsConfig = ComponentStyleConfig &
  Pick<TabsProps, 'indicator' | 'indicatorSize' | 'more' | 'moreIcon' | 'addIcon' | 'removeIcon'>;

export type AlertConfig = ComponentStyleConfig & Pick<AlertProps, 'closable' | 'closeIcon'>;

export type BadgeConfig = ComponentStyleConfig & Pick<BadgeProps, 'classNames' | 'styles'>;

export type InputConfig = ComponentStyleConfig &
  Pick<InputProps, 'autoComplete' | 'classNames' | 'styles' | 'allowClear' | 'variant'>;

export type TextAreaConfig = ComponentStyleConfig &
  Pick<TextAreaProps, 'autoComplete' | 'classNames' | 'styles' | 'allowClear' | 'variant'>;

export type ButtonConfig = ComponentStyleConfig &
  Pick<ButtonProps, 'classNames' | 'styles' | 'autoInsertSpace'>;

export type NotificationConfig = ComponentStyleConfig & Pick<ArgsProps, 'closeIcon'>;

export type TagConfig = ComponentStyleConfig & Pick<TagProps, 'closeIcon' | 'closable'>;

export type CardConfig = ComponentStyleConfig & Pick<CardProps, 'classNames' | 'styles'>;

export type DrawerConfig = ComponentStyleConfig &
  Pick<DrawerProps, 'classNames' | 'styles' | 'closeIcon' | 'closable'>;

export type FlexConfig = ComponentStyleConfig & Pick<FlexProps, 'vertical'>;

export type TransferConfig = ComponentStyleConfig & Pick<TransferProps, 'selectionsIcon'>;

export type FormConfig = ComponentStyleConfig &
  Pick<FormProps, 'requiredMark' | 'colon' | 'scrollToFirstError' | 'validateMessages' | 'variant'>;

export type FloatButtonGroupConfig = Pick<FloatButtonGroupProps, 'closeIcon'>;

export type PaginationConfig = ComponentStyleConfig & Pick<PaginationProps, 'showSizeChanger'>;

export type SelectConfig = ComponentStyleConfig & Pick<SelectProps, 'showSearch' | 'variant'>;

export type SpaceConfig = ComponentStyleConfig & Pick<SpaceProps, 'size' | 'classNames' | 'styles'>;

export type TooltipConfig = Pick<TooltipProps, 'className' | 'style' | 'styles' | 'classNames'>;

export type PopoverConfig = Pick<PopoverProps, 'className' | 'style' | 'styles' | 'classNames'>;

export type PopconfirmConfig = Pick<
  PopconfirmProps,
  'className' | 'style' | 'styles' | 'classNames'
>;

export type QRcodeConfig = ComponentStyleConfig & Pick<QRCodeProps, 'classNames' | 'styles'>;

export type SpinConfig = ComponentStyleConfig & Pick<SpinProps, 'indicator'>;

export type InputNumberConfig = ComponentStyleConfig & Pick<InputNumberProps, 'variant'>;

export type CascaderConfig = ComponentStyleConfig & Pick<CascaderProps, 'variant'>;

export type TreeSelectConfig = ComponentStyleConfig & Pick<TreeSelectProps, 'variant'>;

export type DatePickerConfig = ComponentStyleConfig & Pick<DatePickerProps, 'variant'>;

export type RangePickerConfig = ComponentStyleConfig & Pick<RangePickerProps, 'variant'>;

export type TimePickerConfig = ComponentStyleConfig & Pick<TimePickerProps, 'variant'>;

export type MentionsConfig = ComponentStyleConfig & Pick<MentionsProps, 'variant'>;

export type PopupOverflow = 'viewport' | 'scroll';

export interface ListConfig extends ComponentStyleConfig {
  item?: Pick<ListItemProps, 'classNames' | 'styles'>;
}

export const Variants = ['outlined', 'borderless', 'filled'] as const;

export type Variant = (typeof Variants)[number];

export interface WaveConfig {
  /**
   * @descCN 是否开启水波纹效果。如果需要关闭，可以设置为 `false`。
   * @descEN Whether to use wave effect. If it needs to close, set to `false`.
   * @default true
   */
  disabled?: boolean;
  /**
   * @descCN 自定义水波纹效果。
   * @descEN Customized wave effect.
   */
  showEffect?: ShowWaveEffect;
}

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  iconPrefixCls: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty?: RenderEmptyHandler;
  /**
   * @descCN 设置 [Content Security Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) 配置。
   * @descEN Set the [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config.
   */
  csp?: CSPConfig;
  /** @deprecated Please use `{ button: { autoInsertSpace: boolean }}` instead */
  autoInsertSpaceInButton?: boolean;
  variant?: Variant;
  input?: InputConfig;
  textArea?: TextAreaConfig;
  inputNumber?: InputNumberConfig;
  pagination?: PaginationConfig;
  locale?: Locale;
  direction?: DirectionType;
  space?: SpaceConfig;
  splitter?: ComponentStyleConfig;
  virtual?: boolean;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  form?: FormConfig;
  theme?: ThemeConfig;
  select?: SelectConfig;
  alert?: AlertConfig;
  anchor?: ComponentStyleConfig;
  button?: ButtonConfig;
  divider?: ComponentStyleConfig;
  drawer?: DrawerConfig;
  calendar?: ComponentStyleConfig;
  carousel?: ComponentStyleConfig;
  cascader?: CascaderConfig;
  treeSelect?: TreeSelectConfig;
  collapse?: CollapseConfig;
  floatButtonGroup?: FloatButtonGroupConfig;
  typography?: ComponentStyleConfig;
  skeleton?: ComponentStyleConfig;
  spin?: SpinConfig;
  segmented?: ComponentStyleConfig;
  steps?: ComponentStyleConfig;
  statistic?: ComponentStyleConfig;
  image?: ImageConfig;
  layout?: ComponentStyleConfig;
  list?: ListConfig;
  mentions?: MentionsConfig;
  modal?: ModalConfig;
  progress?: ComponentStyleConfig;
  result?: ComponentStyleConfig;
  slider?: ComponentStyleConfig;
  breadcrumb?: ComponentStyleConfig;
  menu?: MenuConfig;
  checkbox?: ComponentStyleConfig;
  descriptions?: ComponentStyleConfig;
  empty?: ComponentStyleConfig;
  badge?: BadgeConfig;
  radio?: ComponentStyleConfig;
  rate?: ComponentStyleConfig;
  switch?: ComponentStyleConfig;
  transfer?: TransferConfig;
  avatar?: ComponentStyleConfig;
  message?: ComponentStyleConfig;
  tag?: TagConfig;
  table?: TableConfig;
  card?: CardConfig;
  tabs?: TabsConfig;
  timeline?: ComponentStyleConfig;
  timePicker?: TimePickerConfig;
  tour?: TourConfig;
  tooltip?: TooltipConfig;
  popover?: PopoverConfig;
  popconfirm?: PopconfirmConfig;
  qrcode?: QRcodeConfig;
  upload?: ComponentStyleConfig;
  notification?: NotificationConfig;
  tree?: ComponentStyleConfig;
  colorPicker?: ComponentStyleConfig;
  datePicker?: DatePickerConfig;
  rangePicker?: RangePickerConfig;
  dropdown?: ComponentStyleConfig;
  flex?: FlexConfig;
  wave?: WaveConfig;
  warning?: WarningContextProps;
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
};

// zombieJ: 🚨 Do not pass `defaultRenderEmpty` here since it will cause circular dependency.
export const ConfigContext = React.createContext<ConfigConsumerProps>({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls,
});

export const { Consumer: ConfigConsumer } = ConfigContext;
