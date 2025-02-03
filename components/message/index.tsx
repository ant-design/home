import React, { useContext } from 'react';

import { AppConfigContext } from '../app/context';
import ConfigProvider, { ConfigContext, globalConfig, warnContext } from '../config-provider';
import { getReactRender } from '../config-provider/UnstableContext';
import type {
  ArgsProps,
  ConfigOptions,
  MessageInstance,
  MessageType,
  NoticeType,
  TypeOpen,
} from './interface';
import PurePanel from './PurePanel';
import useMessage, { useInternalMessage } from './useMessage';
import { wrapPromiseFn } from './util';

export type { ArgsProps };

let message: GlobalMessage | null = null;

let act: (callback: VoidFunction) => Promise<void> | void = (callback) => callback();

interface GlobalMessage {
  fragment: DocumentFragment;
  instance?: MessageInstance | null;
  sync?: VoidFunction;
}

interface OpenTask {
  type: 'open';
  config: ArgsProps;
  resolve: VoidFunction;
  setCloseFn: (closeFn: VoidFunction) => void;
  skipped?: boolean;
}

interface TypeTask {
  type: NoticeType;
  args: Parameters<TypeOpen>;
  resolve: VoidFunction;
  setCloseFn: (closeFn: VoidFunction) => void;
  skipped?: boolean;
}

type Task =
  | OpenTask
  | TypeTask
  | {
      type: 'destroy';
      key?: React.Key;
      skipped?: boolean;
    };

let taskQueue: Task[] = [];

let defaultGlobalConfig: ConfigOptions = {};

function getGlobalContext() {
  const { getContainer, duration, rtl, maxCount, top } = defaultGlobalConfig;
  const mergedContainer = getContainer?.() || document.body;

  return { getContainer: () => mergedContainer, duration, rtl, maxCount, top };
}

interface GlobalHolderRef {
  instance: MessageInstance;
  sync: () => void;
}

const GlobalHolder = React.forwardRef<
  GlobalHolderRef,
  { messageConfig: ConfigOptions; sync: () => void }
>((props, ref) => {
  const { messageConfig, sync } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = defaultGlobalConfig.prefixCls || getPrefixCls('message');
  const appConfig = useContext(AppConfigContext);

  const [api, holder] = useInternalMessage({ ...messageConfig, prefixCls, ...appConfig.message });

  React.useImperativeHandle(ref, () => {
    const instance: MessageInstance = { ...api };

    Object.keys(instance).forEach((method) => {
      instance[method as keyof MessageInstance] = (...args: any[]) => {
        sync();
        return (api as any)[method](...args);
      };
    });

    return {
      instance,
      sync,
    };
  });
  return holder;
});

const GlobalHolderWrapper = React.forwardRef<GlobalHolderRef, unknown>((_, ref) => {
  const [messageConfig, setMessageConfig] = React.useState<ConfigOptions>(getGlobalContext);

  const sync = () => {
    setMessageConfig(getGlobalContext);
  };

  React.useEffect(sync, []);

  const global = globalConfig();
  const rootPrefixCls = global.getRootPrefixCls();
  const rootIconPrefixCls = global.getIconPrefixCls();
  const theme = global.getTheme();
  const csp = global.getCsp();

  const dom = <GlobalHolder ref={ref} sync={sync} messageConfig={messageConfig} />;
  return (
    <ConfigProvider prefixCls={rootPrefixCls} iconPrefixCls={rootIconPrefixCls} theme={theme} csp={csp}>
      {global.holderRender ? global.holderRender(dom) : dom}
    </ConfigProvider>
  );
});

function flushNotice() {
  if (!message) {
    const holderFragment = document.createDocumentFragment();

    const newMessage: GlobalMessage = {
      fragment: holderFragment,
    };

    message = newMessage;

    // Delay render to avoid sync issue
    act(() => {
      const reactRender = getReactRender();

      reactRender(
        <GlobalHolderWrapper
          ref={(node) => {
            const { instance, sync } = node || {};

            // React 18 test env will throw if call immediately in ref
            Promise.resolve().then(() => {
              if (!newMessage.instance && instance) {
                newMessage.instance = instance;
                newMessage.sync = sync;
                flushNotice();
              }
            });
          }}
        />,
        holderFragment,
      );
    });

    return;
  }

  // Notification not ready
  if (!message.instance) {
    return;
  }

  // >>> Execute task
  taskQueue.forEach((task) => {
    const { type, skipped } = task;

    // Only `skipped` when user call notice but cancel it immediately
    // and instance not ready
    if (!skipped) {
      switch (type) {
        case 'open': {
          act(() => {
            const closeFn = message!.instance!.open({
              ...defaultGlobalConfig,
              ...task.config,
            });

            closeFn?.then(task.resolve);
            task.setCloseFn(closeFn);
          });
          break;
        }

        case 'destroy':
          act(() => {
            message?.instance!.destroy(task.key);
          });
          break;

        // Other type open
        default: {
          act(() => {
            const closeFn = message!.instance![type](...task.args);

            closeFn?.then(task.resolve);
            task.setCloseFn(closeFn);
          });
        }
      }
    }
  });

  // Clean up
  taskQueue = [];
}

// ==============================================================================
// ==                                  Export                                  ==
// ==============================================================================

function setMessageGlobalConfig(config: ConfigOptions) {
  defaultGlobalConfig = {
    ...defaultGlobalConfig,
    ...config,
  };

  // Trigger sync for it
  act(() => {
    message?.sync?.();
  });
}

function open(config: ArgsProps): MessageType {
  const result = wrapPromiseFn((resolve) => {
    let closeFn: VoidFunction;

    const task: OpenTask = {
      type: 'open',
      config,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn;
      },
    };
    taskQueue.push(task);

    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });

  flushNotice();

  return result;
}

function typeOpen(type: NoticeType, args: Parameters<TypeOpen>): MessageType {
  const global = globalConfig();

  if (process.env.NODE_ENV !== 'production' && !global.holderRender) {
    warnContext('message');
  }

  const result = wrapPromiseFn((resolve) => {
    let closeFn: VoidFunction;

    const task: TypeTask = {
      type,
      args,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn;
      },
    };

    taskQueue.push(task);

    return () => {
      if (closeFn) {
        act(() => {
          closeFn();
        });
      } else {
        task.skipped = true;
      }
    };
  });

  flushNotice();

  return result;
}

const destroy: BaseMethods['destroy'] = (key) => {
  taskQueue.push({
    type: 'destroy',
    key,
  });
  flushNotice();
};

interface BaseMethods {
  open: (config: ArgsProps) => MessageType;
  destroy: (key?: React.Key) => void;
  config: typeof setMessageGlobalConfig;
  useMessage: typeof useMessage;
  /** @private Internal Component. Do not use in your production. */
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
}

interface MessageMethods {
  info: TypeOpen;
  success: TypeOpen;
  error: TypeOpen;
  warning: TypeOpen;
  loading: TypeOpen;
}

const methods: (keyof MessageMethods)[] = ['success', 'info', 'warning', 'error', 'loading'];

const baseStaticMethods: BaseMethods = {
  open,
  destroy,
  config: setMessageGlobalConfig,
  useMessage,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
};

const staticMethods = baseStaticMethods as MessageMethods & BaseMethods;

methods.forEach((type: keyof MessageMethods) => {
  staticMethods[type] = (...args: Parameters<TypeOpen>) => typeOpen(type, args);
});

// ==============================================================================
// ==                                   Test                                   ==
// ==============================================================================
const noop = () => {};

/** @internal Only Work in test env */
// eslint-disable-next-line import/no-mutable-exports
export let actWrapper: (wrapper: any) => void = noop;

if (process.env.NODE_ENV === 'test') {
  actWrapper = (wrapper) => {
    act = wrapper;
  };
}

/** @internal Only Work in test env */
// eslint-disable-next-line import/no-mutable-exports
export let actDestroy = noop;

if (process.env.NODE_ENV === 'test') {
  actDestroy = () => {
    message = null;
  };
}

export default staticMethods;
