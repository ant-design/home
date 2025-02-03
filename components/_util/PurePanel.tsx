import * as React from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';

import ConfigProvider, { ConfigContext } from '../config-provider';
import type { AnyObject } from './type';

export function withPureRenderTheme<T extends AnyObject = AnyObject>(Component: React.FC<T>) {
  return (props: T) => {
    const { theme } = React.useContext(ConfigContext);

    return (
      <ConfigProvider
        theme={{
          ...theme,
          token: {
            ...(theme ? theme.token : {}),
            motion: false,
            zIndexPopupBase: 0,
          },
        }}
      >
        <Component {...props} />
      </ConfigProvider>
    );
  };
}

export interface BaseProps {
  prefixCls?: string;
  style?: React.CSSProperties;
}

/* istanbul ignore next */
const genPurePanel = <ComponentProps extends BaseProps = BaseProps>(
  Component: React.ComponentType<Readonly<ComponentProps>>,
  alignPropName?: 'align' | 'dropdownAlign' | 'popupAlign',
  postProps?: (props: ComponentProps) => ComponentProps,
  defaultPrefixCls?: string,
  getDropdownCls?: (prefixCls: string) => string,
) => {
  type WrapProps = ComponentProps & AnyObject;

  const PurePanel: React.FC<WrapProps> = (props) => {
    const { prefixCls: customizePrefixCls, style } = props;

    const holderRef = React.useRef<HTMLDivElement>(null);
    const [popupHeight, setPopupHeight] = React.useState(0);
    const [popupWidth, setPopupWidth] = React.useState(0);
    const [open, setOpen] = useMergedState(false, {
      value: props.open,
    });

    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls(defaultPrefixCls || 'select', customizePrefixCls);

    React.useEffect(() => {
      // We do not care about ssr
      setOpen(true);

      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver((entries) => {
          const element = entries[0].target as HTMLDivElement;
          setPopupHeight(element.offsetHeight + 8);
          setPopupWidth(element.offsetWidth);
        });

        const interval = setInterval(() => {
          const dropdownCls = getDropdownCls
            ? `.${getDropdownCls(prefixCls)}`
            : `.${prefixCls}-dropdown`;
          const popup = holderRef.current?.querySelector(dropdownCls);
          if (popup) {
            clearInterval(interval);
            resizeObserver.observe(popup);
          }
        }, 10);

        return () => {
          clearInterval(interval);
          resizeObserver.disconnect();
        };
      }
    }, []);

    let mergedProps: WrapProps = {
      ...props,
      style: {
        ...style,
        margin: 0,
      },
      open,
      visible: open,
      getPopupContainer: () => holderRef.current!,
    };

    if (postProps) {
      mergedProps = postProps(mergedProps);
    }
    if (alignPropName) {
      Object.assign(mergedProps, {
        [alignPropName]: {
          overflow: {
            adjustX: false,
            adjustY: false,
          },
        },
      });
    }
    const mergedStyle: React.CSSProperties = {
      paddingBottom: popupHeight,
      position: 'relative',
      minWidth: popupWidth,
    };
    return (
      <div ref={holderRef} style={mergedStyle}>
        <Component {...mergedProps} />
      </div>
    );
  };

  return withPureRenderTheme<AnyObject>(PurePanel);
};

export default genPurePanel;
