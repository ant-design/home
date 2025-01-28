import * as React from 'react';
import { createTheme, StyleContext as CssInJsStyleContext } from '@ant-design/cssinjs';
import IconContext from '@ant-design/icons/lib/components/Context';
import useMemo from 'rc-util/lib/hooks/useMemo';
import { merge } from 'rc-util/lib/utils/set';

import { devUseWarning, WarningContext } from '../_util/warning';
import type { WarningContextProps } from '../_util/warning';
import ValidateMessagesContext from '../form/validateMessagesContext';
import type { Locale } from '../locale';
import LocaleProvider, { ANT_MARK } from '../locale';
import type { LocaleContextProps } from '../locale/context';
import LocaleContext from '../locale/context';
import defaultLocale from '../locale/en_US';
import { defaultTheme, DesignTokenContext } from '../theme/context';
import defaultSeedToken from '../theme/themes/seed';
import type {
  AlertConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  CascaderConfig,
  CollapseConfig,
  ComponentStyleConfig,
  ConfigConsumerProps,
  CSPConfig,
  DatePickerConfig,
  DirectionType,
  DrawerConfig,
  EmptyConfig,
  FlexConfig,
  FloatButtonGroupConfig,
  FormConfig,
  ImageConfig,
  InputConfig,
  InputNumberConfig,
  ListConfig,
  MentionsConfig,
  MenuConfig,
  ModalConfig,
  NotificationConfig,
  PaginationConfig,
  PopconfirmConfig,
  PopoverConfig,
  PopupOverflow,
  RangePickerConfig,
  SelectConfig,
  SpaceConfig,
  SpinConfig,
  TableConfig,
  TabsConfig,
  TagConfig,
  TextAreaConfig,
  ThemeConfig,
  TimePickerConfig,
  TooltipConfig,
  TourConfig,
  TransferConfig,
  TreeSelectConfig,
  Variant,
  WaveConfig,
} from './context';
import { ConfigContext, defaultIconPrefixCls } from './context';
import type { RenderEmptyHandler } from './defaultRenderEmpty';
import { DisabledContextProvider } from './DisabledContext';
import existThemeConfig from './existThemeConfig';
import useTheme from './hooks/useTheme';
import MotionWrapper from './MotionWrapper';
import PropWarning from './PropWarning';
import type { SizeType } from './SizeContext';
import { SizeContextProvider } from './SizeContext';
import useStyle from './style';

// These props is used by `useContext` directly in sub component
const PASSED_PROPS: Exclude<
  keyof ConfigConsumerProps,
  'rootPrefixCls' | 'getPrefixCls' | 'warning'
>[] = [
  'getTargetContainer',
  'getPopupContainer',
  'renderEmpty',
  'input',
  'pagination',
  'form',
  'select',
  'button',
];

export interface ConfigProviderProps {
  getTargetContainer?: () => HTMLElement | Window;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  prefixCls?: string;
  iconPrefixCls?: string;
  children?: React.ReactNode;
  renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  /** @deprecated Please use `{ button: { autoInsertSpace: boolean }}` instead */
  autoInsertSpaceInButton?: boolean;
  variant?: Variant;
  form?: FormConfig;
  input?: InputConfig;
  inputNumber?: InputNumberConfig;
  textArea?: TextAreaConfig;
  select?: SelectConfig;
  pagination?: PaginationConfig;
  /**
   * @descCN 语言包配置，语言包可到 `antd/locale` 目录下寻找。
   * @descEN Language package setting, you can find the packages in `antd/locale`.
   */
  locale?: Locale;
  componentSize?: SizeType;
  componentDisabled?: boolean;
  /**
   * @descCN 设置布局展示方向。
   * @descEN Set direction of layout.
   * @default ltr
   */
  direction?: DirectionType;
  space?: SpaceConfig;
  splitter?: ComponentStyleConfig;
  /**
   * @descCN 设置 `false` 时关闭虚拟滚动。
   * @descEN Close the virtual scrolling when setting `false`.
   * @default true
   */
  virtual?: boolean;
  /** @deprecated Please use `popupMatchSelectWidth` instead */
  dropdownMatchSelectWidth?: boolean;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  theme?: ThemeConfig;
  warning?: WarningContextProps;
  alert?: AlertConfig;
  anchor?: ComponentStyleConfig;
  button?: ButtonConfig;
  calendar?: ComponentStyleConfig;
  carousel?: ComponentStyleConfig;
  cascader?: CascaderConfig;
  treeSelect?: TreeSelectConfig;
  collapse?: CollapseConfig;
  divider?: ComponentStyleConfig;
  drawer?: DrawerConfig;
  typography?: ComponentStyleConfig;
  skeleton?: ComponentStyleConfig;
  spin?: SpinConfig;
  segmented?: ComponentStyleConfig;
  statistic?: ComponentStyleConfig;
  steps?: ComponentStyleConfig;
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
  floatButtonGroup?: FloatButtonGroupConfig;
  checkbox?: ComponentStyleConfig;
  descriptions?: ComponentStyleConfig;
  empty?: EmptyConfig;
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
  upload?: ComponentStyleConfig;
  notification?: NotificationConfig;
  tree?: ComponentStyleConfig;
  colorPicker?: ComponentStyleConfig;
  datePicker?: DatePickerConfig;
  rangePicker?: RangePickerConfig;
  dropdown?: ComponentStyleConfig;
  flex?: FlexConfig;
  /**
   * Wave is special component which only patch on the effect of component interaction.
   */
  wave?: WaveConfig;
  tour?: TourConfig;
  tooltip?: TooltipConfig;
  popover?: PopoverConfig;
  popconfirm?: PopconfirmConfig;
}

interface ProviderChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps;
  legacyLocale: Locale;
}

const ProviderChildren: React.FC<ProviderChildrenProps> = (props) => {
  const {
    children,
    csp: customCsp,
    autoInsertSpaceInButton,
    alert,
    anchor,
    form,
    locale,
    componentSize,
    direction,
    space,
    splitter,
    virtual,
    dropdownMatchSelectWidth,
    popupMatchSelectWidth,
    popupOverflow,
    legacyLocale,
    parentContext,
    iconPrefixCls: customIconPrefixCls,
    theme,
    componentDisabled,
    segmented,
    statistic,
    spin,
    calendar,
    carousel,
    cascader,
    collapse,
    typography,
    checkbox,
    descriptions,
    divider,
    drawer,
    skeleton,
    steps,
    image,
    layout,
    list,
    mentions,
    modal,
    progress,
    result,
    slider,
    breadcrumb,
    menu,
    pagination,
    input,
    textArea,
    empty,
    badge,
    radio,
    rate,
    switch: SWITCH,
    transfer,
    avatar,
    message,
    tag,
    table,
    card,
    tabs,
    timeline,
    timePicker,
    upload,
    notification,
    tree,
    colorPicker,
    datePicker,
    rangePicker,
    flex,
    wave,
    dropdown,
    warning: warningConfig,
    tour,
    tooltip,
    popover,
    popconfirm,
    floatButtonGroup,
    variant,
    inputNumber,
    treeSelect,
  } = props;

  // =================================== Context ===================================
  const getPrefixCls = React.useCallback(
    (suffixCls: string, customizePrefixCls?: string) => {
      const { prefixCls } = props;

      if (customizePrefixCls) {
        return customizePrefixCls;
      }

      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    },
    [parentContext.getPrefixCls, props.prefixCls],
  );

  const iconPrefixCls = customIconPrefixCls || parentContext.iconPrefixCls || defaultIconPrefixCls;
  const csp = customCsp || parentContext.csp;

  useStyle(iconPrefixCls, csp);

  const mergedTheme = useTheme(theme, parentContext.theme, { prefixCls: getPrefixCls('') });

  if (process.env.NODE_ENV !== 'production') {
    existThemeConfig(existThemeConfig() || !!mergedTheme);
  }

  const baseConfig = {
    csp,
    autoInsertSpaceInButton,
    alert,
    anchor,
    locale: locale || legacyLocale,
    direction,
    space,
    splitter,
    virtual,
    popupMatchSelectWidth: popupMatchSelectWidth ?? dropdownMatchSelectWidth,
    popupOverflow,
    getPrefixCls,
    iconPrefixCls,
    theme: mergedTheme,
    segmented,
    statistic,
    spin,
    calendar,
    carousel,
    cascader,
    collapse,
    typography,
    checkbox,
    descriptions,
    divider,
    drawer,
    skeleton,
    steps,
    image,
    input,
    textArea,
    layout,
    list,
    mentions,
    modal,
    progress,
    result,
    slider,
    breadcrumb,
    menu,
    pagination,
    empty,
    badge,
    radio,
    rate,
    switch: SWITCH,
    transfer,
    avatar,
    message,
    tag,
    table,
    card,
    tabs,
    timeline,
    timePicker,
    upload,
    notification,
    tree,
    colorPicker,
    datePicker,
    rangePicker,
    flex,
    wave,
    dropdown,
    warning: warningConfig,
    tour,
    tooltip,
    popover,
    popconfirm,
    floatButtonGroup,
    variant,
    inputNumber,
    treeSelect,
  };

  if (process.env.NODE_ENV !== 'production') {
    const warningFn = devUseWarning('ConfigProvider');
    warningFn(
      !('autoInsertSpaceInButton' in props),
      'deprecated',
      '`autoInsertSpaceInButton` is deprecated. Please use `{ button: { autoInsertSpace: boolean }}` instead.',
    );
  }

  const config: ConfigConsumerProps = {
    ...parentContext,
  };

  (Object.keys(baseConfig) as (keyof typeof baseConfig)[]).forEach((key) => {
    if (baseConfig[key] !== undefined) {
      (config as any)[key] = baseConfig[key];
    }
  });

  // Pass the props used by `useContext` directly with child component.
  // These props should merged into `config`.
  PASSED_PROPS.forEach((propName) => {
    const propValue = props[propName];
    if (propValue) {
      (config as any)[propName] = propValue;
    }
  });

  if (typeof autoInsertSpaceInButton !== 'undefined') {
    // merge deprecated api
    config.button = {
      autoInsertSpace: autoInsertSpaceInButton,
      ...config.button,
    };
  }

  // https://github.com/ant-design/ant-design/issues/27617
  const memoedConfig = useMemo(
    () => config,
    config,
    (prevConfig, currentConfig) => {
      const prevKeys = Object.keys(prevConfig) as Array<keyof typeof config>;
      const currentKeys = Object.keys(currentConfig) as Array<keyof typeof config>;
      return (
        prevKeys.length !== currentKeys.length ||
        prevKeys.some((key) => prevConfig[key] !== currentConfig[key])
      );
    },
  );

  const { layer } = React.useContext(CssInJsStyleContext);

  const memoIconContextValue = React.useMemo(
    () => ({ prefixCls: iconPrefixCls, csp, layer: layer ? 'antd' : undefined }),
    [iconPrefixCls, csp, layer],
  );

  let childNode = (
    <>
      <PropWarning dropdownMatchSelectWidth={dropdownMatchSelectWidth} />
      {children}
    </>
  );

  const validateMessages = React.useMemo(
    () =>
      merge(
        defaultLocale.Form?.defaultValidateMessages || {},
        memoedConfig.locale?.Form?.defaultValidateMessages || {},
        memoedConfig.form?.validateMessages || {},
        form?.validateMessages || {},
      ),
    [memoedConfig, form?.validateMessages],
  );

  if (Object.keys(validateMessages).length > 0) {
    childNode = (
      <ValidateMessagesContext.Provider value={validateMessages}>
        {childNode}
      </ValidateMessagesContext.Provider>
    );
  }

  if (locale) {
    childNode = (
      <LocaleProvider locale={locale} _ANT_MARK__={ANT_MARK}>
        {childNode}
      </LocaleProvider>
    );
  }

  if (iconPrefixCls || csp) {
    childNode = (
      <IconContext.Provider value={memoIconContextValue}>{childNode}</IconContext.Provider>
    );
  }

  if (componentSize) {
    childNode = <SizeContextProvider size={componentSize}>{childNode}</SizeContextProvider>;
  }

  // =================================== Motion ===================================
  childNode = <MotionWrapper>{childNode}</MotionWrapper>;

  // ================================ Dynamic theme ================================
  const memoTheme = React.useMemo(() => {
    const { algorithm, token, components, cssVar, ...rest } = mergedTheme || {};
    const themeObj =
      algorithm && (!Array.isArray(algorithm) || algorithm.length > 0)
        ? createTheme(algorithm)
        : defaultTheme;

    const parsedComponents: any = {};
    Object.entries(components || {}).forEach(([componentName, componentToken]) => {
      const parsedToken: typeof componentToken & { theme?: typeof defaultTheme } = {
        ...componentToken,
      };
      if ('algorithm' in parsedToken) {
        if (parsedToken.algorithm === true) {
          parsedToken.theme = themeObj;
        } else if (
          Array.isArray(parsedToken.algorithm) ||
          typeof parsedToken.algorithm === 'function'
        ) {
          parsedToken.theme = createTheme(parsedToken.algorithm);
        }
        delete parsedToken.algorithm;
      }
      parsedComponents[componentName] = parsedToken;
    });

    const mergedToken = {
      ...defaultSeedToken,
      ...token,
    };

    return {
      ...rest,
      theme: themeObj,

      token: mergedToken,
      components: parsedComponents,
      override: {
        override: mergedToken,
        ...parsedComponents,
      },
      cssVar: cssVar as Exclude<ThemeConfig['cssVar'], boolean>,
    };
  }, [mergedTheme]);

  if (theme) {
    childNode = (
      <DesignTokenContext.Provider value={memoTheme}>{childNode}</DesignTokenContext.Provider>
    );
  }

  // ================================== Warning ===================================
  if (memoedConfig.warning) {
    childNode = (
      <WarningContext.Provider value={memoedConfig.warning}>{childNode}</WarningContext.Provider>
    );
  }

  // =================================== Render ===================================
  if (componentDisabled !== undefined) {
    childNode = (
      <DisabledContextProvider disabled={componentDisabled}>{childNode}</DisabledContextProvider>
    );
  }

  return <ConfigContext.Provider value={memoedConfig}>{childNode}</ConfigContext.Provider>;
};

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const context = React.useContext<ConfigConsumerProps>(ConfigContext);
  const antLocale = React.useContext<LocaleContextProps | undefined>(LocaleContext);
  return <ProviderChildren parentContext={context} legacyLocale={antLocale!} {...props} />;
};

if (process.env.NODE_ENV !== 'production') {
  ConfigProvider.displayName = 'ConfigProvider';
}

export default ConfigProvider;
