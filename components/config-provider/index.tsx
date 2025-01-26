import * as React from 'react';

import warning from '../_util/warning';
import InternalConfigProvider from './ConfigProvider';
import type {
  ConfigConsumerProps,
  CSPConfig,
  DirectionType,
  Theme,
  ThemeConfig,
  Variant,
} from './context';
import {
  ConfigConsumer,
  ConfigContext,
  defaultIconPrefixCls,
  defaultPrefixCls,
  Variants,
} from './context';
import { registerTheme } from './cssVariables';
import type { RenderEmptyHandler } from './defaultRenderEmpty';
import existThemeConfig from './existThemeConfig';
import useConfig from './hooks/useConfig';
import SizeContext from './SizeContext';

export type { Variant };

export { Variants };

export const warnContext: (componentName: string) => void =
  process.env.NODE_ENV !== 'production'
    ? (componentName: string) => {
        warning(
          !existThemeConfig(),
          componentName,
          `Static function can not consume context like dynamic theme. Please use 'App' component instead.`,
        );
      }
    : /* istanbul ignore next */
      null!;

export {
  ConfigConsumer,
  ConfigContext,
  defaultPrefixCls,
  defaultIconPrefixCls,
  type ConfigConsumerProps,
  type CSPConfig,
  type DirectionType,
  type RenderEmptyHandler,
  type ThemeConfig,
};

export const configConsumerProps = [
  'getTargetContainer',
  'getPopupContainer',
  'rootPrefixCls',
  'getPrefixCls',
  'renderEmpty',
  'csp',
  'autoInsertSpaceInButton',
  'locale',
];

export { ConfigProviderProps } from './ConfigProvider';

type holderRenderType = (children: React.ReactNode) => React.ReactNode;

let globalPrefixCls: string;
let globalIconPrefixCls: string;
let globalTheme: ThemeConfig;
let globalHolderRender: holderRenderType | undefined;

function getGlobalPrefixCls() {
  return globalPrefixCls || defaultPrefixCls;
}

function getGlobalIconPrefixCls() {
  return globalIconPrefixCls || defaultIconPrefixCls;
}

function isLegacyTheme(theme: Theme | ThemeConfig): theme is Theme {
  return Object.keys(theme).some((key) => key.endsWith('Color'));
}

interface GlobalConfigProps {
  prefixCls?: string;
  iconPrefixCls?: string;
  theme?: Theme | ThemeConfig;
  holderRender?: holderRenderType;
}

const setGlobalConfig = (props: GlobalConfigProps) => {
  const { prefixCls, iconPrefixCls, theme, holderRender } = props;
  if (prefixCls !== undefined) {
    globalPrefixCls = prefixCls;
  }
  if (iconPrefixCls !== undefined) {
    globalIconPrefixCls = iconPrefixCls;
  }
  if ('holderRender' in props) {
    globalHolderRender = holderRender;
  }

  if (theme) {
    if (isLegacyTheme(theme)) {
      warning(
        false,
        'ConfigProvider',
        '`config` of css variable theme is not work in v5. Please use new `theme` config instead.',
      );
      registerTheme(getGlobalPrefixCls(), theme);
    } else {
      globalTheme = theme;
    }
  }
};

export const globalConfig = () => ({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) {
      return customizePrefixCls;
    }
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
  },
  getIconPrefixCls: getGlobalIconPrefixCls,
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalPrefixCls) {
      return globalPrefixCls;
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  },
  getTheme: () => globalTheme,
  holderRender: globalHolderRender,
});

type CompoundedComponent = typeof InternalConfigProvider & {
  /** @private internal Usage. do not use in your production */
  ConfigContext: typeof ConfigContext;
  /** @deprecated Please use `ConfigProvider.useConfig().componentSize` instead */
  SizeContext: typeof SizeContext;
  config: typeof setGlobalConfig;
  useConfig: typeof useConfig;
};

const ConfigProvider = InternalConfigProvider as CompoundedComponent;
ConfigProvider.ConfigContext = ConfigContext;
ConfigProvider.SizeContext = SizeContext;
ConfigProvider.config = setGlobalConfig;
ConfigProvider.useConfig = useConfig;

Object.defineProperty(ConfigProvider, 'SizeContext', {
  get: () => {
    warning(
      false,
      'ConfigProvider',
      'ConfigProvider.SizeContext is deprecated. Please use `ConfigProvider.useConfig().componentSize` instead.',
    );
    return SizeContext;
  },
});

export default ConfigProvider;
