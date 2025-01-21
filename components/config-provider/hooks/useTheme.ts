import useMemo from '@rc-component/util/lib/hooks/useMemo';
import isEqual from '@rc-component/util/lib/isEqual';

import { devUseWarning } from '../../_util/warning';
import type { OverrideToken } from '../../theme/interface';
import { defaultConfig } from '../../theme/internal';
import type { ThemeConfig } from '../context';
import useThemeKey from './useThemeKey';

export default function useTheme(
  theme?: ThemeConfig,
  parentTheme?: ThemeConfig,
  config?: {
    prefixCls?: string;
  },
): ThemeConfig | undefined {
  const warning = devUseWarning('ConfigProvider');

  const themeConfig = theme || {};
  const parentThemeConfig: ThemeConfig =
    themeConfig.inherit === false || !parentTheme
      ? {
          ...defaultConfig,
          hashed: parentTheme?.hashed ?? defaultConfig.hashed,
        }
      : parentTheme;

  const themeKey = useThemeKey();

  if (process.env.NODE_ENV !== 'production') {
    const validKey = !!themeKey;
    warning(
      validKey,
      'breaking',
      'Missing key in `cssVar` config. Please upgrade to React 18 or set `cssVar.key` manually in each ConfigProvider inside `cssVar` enabled ConfigProvider.',
    );
  }

  return useMemo<ThemeConfig | undefined>(
    () => {
      if (!theme) {
        return parentTheme;
      }

      // Override
      const mergedComponents = {
        ...parentThemeConfig.components,
      };

      (Object.keys(theme.components || {}) as (keyof OverrideToken)[]).forEach((componentName) => {
        mergedComponents[componentName] = {
          ...mergedComponents[componentName],
          ...theme.components![componentName],
        } as any;
      });

      const cssVarKey = `css-var-${themeKey.replace(/:/g, '')}`;
      const mergedCssVar = {
        prefix: config?.prefixCls, // Same as prefixCls by default
        key: cssVarKey,
      };

      // Base token
      return {
        ...parentThemeConfig,
        ...themeConfig,

        token: {
          ...parentThemeConfig.token,
          ...themeConfig.token,
        },
        components: mergedComponents,
        cssVar: mergedCssVar,
      };
    },
    [themeConfig, parentThemeConfig],
    (prev, next) =>
      prev.some((prevTheme, index) => {
        const nextTheme = next[index];

        return !isEqual(prevTheme, nextTheme, true);
      }),
  );
}
